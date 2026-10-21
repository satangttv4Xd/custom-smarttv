import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { TVConfig, ThemeConfig, AppShortcut, Section, ConnectLaptopConfig } from '../types/config';
import { DEFAULT_CONFIG, TVConfigSchema, MY_MELODY_THEME } from '../types/config';

// ─── History for undo/redo ───
interface HistoryEntry {
  config: TVConfig;
  timestamp: number;
  label: string;
}

interface EditorState {
  // Core config
  config: TVConfig;
  savedConfig: TVConfig | null;
  isDirty: boolean;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // Saved themes
  savedThemes: ThemeConfig[];

  // UI State
  activeTab: string;
  previewMode: boolean;
  previewFocusIndex: number;
  previewDirection: 'up' | 'down' | 'left' | 'right' | null;
  isPublishing: boolean;
  lastPublished: string | null;

  // Connection
  deviceConnected: boolean;
  deviceStatus: 'connected' | 'disconnected' | 'unknown';
  tvIp: string;
  isConnecting: boolean;

  // Actions
  setTvIp: (ip: string) => void;
  checkDeviceStatus: () => Promise<void>;
  connectDevice: (ip?: string) => Promise<boolean>;
  launchScreenShare: () => Promise<boolean>;
  runDebloat: () => Promise<boolean>;
  runRestore: () => Promise<boolean>;
  setConfig: (config: TVConfig) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  updateConnectLaptop: (updates: Partial<ConnectLaptopConfig>) => void;
  updateApp: (id: string, updates: Partial<AppShortcut>) => void;
  addApp: (app: AppShortcut) => void;
  removeApp: (id: string) => void;
  reorderApps: (apps: AppShortcut[]) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  reorderSections: (sections: Section[]) => void;
  setActiveTab: (tab: string) => void;
  togglePreview: () => void;
  setPreviewFocus: (index: number) => void;
  simulateRemote: (direction: 'up' | 'down' | 'left' | 'right') => void;

  // Theme management
  saveTheme: (name: string) => void;
  loadTheme: (name: string) => void;
  deleteTheme: (name: string) => void;
  duplicateTheme: (name: string, newName: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Publish
  publish: () => Promise<void>;
  resetToDefault: () => void;
  exportConfig: () => string;
  importConfig: (json: string) => boolean;
}

const pushHistory = (state: EditorState, label: string): Partial<EditorState> => {
  const newEntry: HistoryEntry = {
    config: JSON.parse(JSON.stringify(state.config)),
    timestamp: Date.now(),
    label,
  };
  const history = state.history.slice(0, state.historyIndex + 1);
  history.push(newEntry);
  // Keep only last 50 history entries
  if (history.length > 50) history.shift();
  return {
    history,
    historyIndex: history.length - 1,
    canUndo: true,
    canRedo: false,
    isDirty: true,
  };
};

export const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
    config: JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
    savedConfig: null,
    isDirty: false,

    history: [{
      config: JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
      timestamp: Date.now(),
      label: 'เริ่มต้น',
    }],
    historyIndex: 0,

    savedThemes: [
      MY_MELODY_THEME,
      {
        name: 'NOVA Default',
        backgroundColor: '#0F172A',
        surfaceColor: '#1E293B',
        accentColor: '#7C3AED',
        accentSecondary: '#3B82F6',
        textColor: '#F8FAFC',
        textMuted: '#94A3B8',
        cardRadius: 16,
        fontScale: 1,
        spacing: 16,
        cardSize: 'medium',
      },
      {
        name: 'Midnight Ocean',
        backgroundColor: '#020617',
        surfaceColor: '#0F172A',
        accentColor: '#0EA5E9',
        accentSecondary: '#6366F1',
        textColor: '#F0F9FF',
        textMuted: '#7DD3FC',
        cardRadius: 20,
        fontScale: 1,
        spacing: 18,
        cardSize: 'medium',
      },
      {
        name: 'Aurora',
        backgroundColor: '#070A14',
        surfaceColor: '#111827',
        accentColor: '#10B981',
        accentSecondary: '#8B5CF6',
        textColor: '#ECFDF5',
        textMuted: '#6EE7B7',
        cardRadius: 12,
        fontScale: 1,
        spacing: 16,
        cardSize: 'medium',
      },
    ],

    activeTab: 'overview',
    previewMode: false,
    previewFocusIndex: 0,
    previewDirection: null,
    isPublishing: false,
    lastPublished: null,

    deviceConnected: false,
    deviceStatus: 'unknown',
    tvIp: '',
    isConnecting: false,
    canUndo: false,
    canRedo: false,

    // ─── Actions ───
    setTvIp: (ip) => set({ tvIp: ip }),

    checkDeviceStatus: async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          set({
            deviceConnected: !!data.connected,
            deviceStatus: data.connected ? 'connected' : 'disconnected',
            tvIp: data.tvIp || get().tvIp,
          });
        }
      } catch {
        set({ deviceStatus: 'unknown' });
      }
    },

    connectDevice: async (ip) => {
      const targetIp = ip || get().tvIp;
      if (!targetIp) return false;
      set({ isConnecting: true });
      try {
        const res = await fetch('/api/tv/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip: targetIp }),
        });
        const data = await res.json();
        set({
          isConnecting: false,
          deviceConnected: !!data.connected,
          deviceStatus: data.connected ? 'connected' : 'disconnected',
          tvIp: targetIp,
        });
        return !!data.connected;
      } catch {
        set({ isConnecting: false });
        return false;
      }
    },

    launchScreenShare: async () => {
      try {
        const res = await fetch('/api/tv/screen-share', { method: 'POST' });
        const data = await res.json();
        return !!data.success;
      } catch {
        return false;
      }
    },

    runDebloat: async () => {
      try {
        const res = await fetch('/api/tv/debloat', { method: 'POST' });
        const data = await res.json();
        return !!data.success;
      } catch {
        return false;
      }
    },

    runRestore: async () => {
      try {
        const res = await fetch('/api/tv/restore', { method: 'POST' });
        const data = await res.json();
        return !!data.success;
      } catch {
        return false;
      }
    },

    setConfig: (config) => set((state) => ({
      config,
      ...pushHistory(state, 'อัปเดตการตั้งค่า'),
    })),

    updateTheme: (updates) => set((state) => {
      const newConfig = {
        ...state.config,
        theme: { ...state.config.theme, ...updates },
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'อัปเดตธีม'),
      };
    }),

    updateConnectLaptop: (updates) => set((state) => {
      const newConfig = {
        ...state.config,
        connectLaptop: { ...state.config.connectLaptop, ...updates },
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'อัปเดตการเชื่อมต่อ'),
      };
    }),

    updateApp: (id, updates) => set((state) => {
      const newConfig = {
        ...state.config,
        apps: state.config.apps.map((app) =>
          app.id === id ? { ...app, ...updates } : app
        ),
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'อัปเดตแอป'),
      };
    }),

    addApp: (app) => set((state) => {
      const newConfig = {
        ...state.config,
        apps: [...state.config.apps, app],
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'เพิ่มแอป'),
      };
    }),

    removeApp: (id) => set((state) => {
      const newConfig = {
        ...state.config,
        apps: state.config.apps.filter((app) => app.id !== id),
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'ลบแอป'),
      };
    }),

    reorderApps: (apps) => set((state) => {
      const newConfig = {
        ...state.config,
        apps: apps.map((app, i) => ({ ...app, order: i })),
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'จัดลำดับแอปใหม่'),
      };
    }),

    updateSection: (id, updates) => set((state) => {
      const newConfig = {
        ...state.config,
        sections: state.config.sections.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'อัปเดตส่วน'),
      };
    }),

    reorderSections: (sections) => set((state) => {
      const newConfig = {
        ...state.config,
        sections: sections.map((s, i) => ({ ...s, order: i })),
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'จัดลำดับส่วนใหม่'),
      };
    }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    togglePreview: () => set((state) => ({ previewMode: !state.previewMode })),

    setPreviewFocus: (index) => set({ previewFocusIndex: index }),

    simulateRemote: (direction) => set((state) => {
      let newIndex = state.previewFocusIndex;
      const visibleApps = state.config.apps.filter(a => a.visible);
      const cols = 4;
      const maxIndex = visibleApps.length + 3; // apps + connect + quick settings items

      switch (direction) {
        case 'left': newIndex = Math.max(0, newIndex - 1); break;
        case 'right': newIndex = Math.min(maxIndex - 1, newIndex + 1); break;
        case 'up': newIndex = Math.max(0, newIndex - cols); break;
        case 'down': newIndex = Math.min(maxIndex - 1, newIndex + cols); break;
      }
      return { previewFocusIndex: newIndex, previewDirection: direction };
    }),

    // ─── Theme Management ───
    saveTheme: (name) => set((state) => {
      const theme = { ...state.config.theme, name };
      const existing = state.savedThemes.findIndex(t => t.name === name);
      const newThemes = [...state.savedThemes];
      if (existing >= 0) {
        newThemes[existing] = theme;
      } else {
        newThemes.push(theme);
      }
      return { savedThemes: newThemes };
    }),

    loadTheme: (name) => set((state) => {
      const theme = state.savedThemes.find(t => t.name === name);
      if (!theme) return {};
      const newConfig = {
        ...state.config,
        theme: { ...theme },
        updatedAt: new Date().toISOString(),
      };
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, `โหลดธีม: ${name}`),
      };
    }),

    deleteTheme: (name) => set((state) => ({
      savedThemes: state.savedThemes.filter(t => t.name !== name),
    })),

    duplicateTheme: (name, newName) => set((state) => {
      const theme = state.savedThemes.find(t => t.name === name);
      if (!theme) return {};
      return {
        savedThemes: [...state.savedThemes, { ...theme, name: newName }],
      };
    }),

    // ─── History ───
    undo: () => set((state) => {
      if (state.historyIndex <= 0) return {};
      const newIndex = state.historyIndex - 1;
      return {
        config: JSON.parse(JSON.stringify(state.history[newIndex].config)),
        historyIndex: newIndex,
        canUndo: newIndex > 0,
        canRedo: true,
        isDirty: true,
      };
    }),

    redo: () => set((state) => {
      if (state.historyIndex >= state.history.length - 1) return {};
      const newIndex = state.historyIndex + 1;
      return {
        config: JSON.parse(JSON.stringify(state.history[newIndex].config)),
        historyIndex: newIndex,
        canUndo: true,
        canRedo: newIndex < state.history.length - 1,
        isDirty: true,
      };
    }),

    // ─── Publish ───
    publish: async () => {
      set({ isPublishing: true });
      try {
        const state = get();
        const response = await fetch('/api/config/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.config),
        });
        if (response.ok) {
          set({
            isPublishing: false,
            isDirty: false,
            lastPublished: new Date().toISOString(),
            savedConfig: JSON.parse(JSON.stringify(state.config)),
          });
        } else {
          set({ isPublishing: false });
        }
      } catch {
        set({ isPublishing: false });
      }
    },

    resetToDefault: () => set((state) => {
      const newConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      return {
        config: newConfig,
        ...pushHistory({ ...state, config: newConfig }, 'รีเซ็ตเป็นค่าเริ่มต้น'),
      };
    }),

    exportConfig: () => {
      const state = get();
      return JSON.stringify(state.config, null, 2);
    },

    importConfig: (json: string) => {
      try {
        const parsed = JSON.parse(json);
        const validated = TVConfigSchema.parse(parsed);
        set((state) => ({
          config: validated,
          ...pushHistory({ ...state, config: validated }, 'นำเข้าการตั้งค่า'),
        }));
        return true;
      } catch {
        return false;
      }
    },
  }))
);
