import { z } from 'zod/v4';

// ─── App Shortcut ───
export const AppShortcutSchema = z.object({
  id: z.string(),
  packageName: z.string(),
  displayName: z.string(),
  icon: z.string().optional(),
  visible: z.boolean().default(true),
  order: z.number(),
  category: z.string().optional(),
});

export type AppShortcut = z.infer<typeof AppShortcutSchema>;

// ─── Connect Laptop Config ───
export const ConnectLaptopSchema = z.object({
  label: z.string().default('เชื่อมต่อแลปท็อป'),
  subtitle: z.string().default('แชร์หน้าจอแบบไร้สาย'),
  icon: z.string().default('monitor'),
  receiverPackage: z.string().optional(),
  receiverActivity: z.string().optional(),
  launchStrategy: z.enum(['intent', 'manual', 'auto']).default('manual'),
  instructions: z.string().default('กด Win + K บน Windows 11 แล้วเลือก TV'),
  showStatus: z.boolean().default(true),
});

export type ConnectLaptopConfig = z.infer<typeof ConnectLaptopSchema>;

// ─── Section ───
export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(['header', 'connect', 'favorites', 'quickSettings']),
  visible: z.boolean().default(true),
  order: z.number(),
  label: z.string().optional(),
});

export type Section = z.infer<typeof SectionSchema>;

// ─── Theme Config ───
export const ThemeConfigSchema = z.object({
  name: z.string(),
  backgroundColor: z.string().default('#0F172A'),
  surfaceColor: z.string().default('#1E293B'),
  accentColor: z.string().default('#7C3AED'),
  accentSecondary: z.string().default('#3B82F6'),
  textColor: z.string().default('#F8FAFC'),
  textMuted: z.string().default('#94A3B8'),
  cardRadius: z.number().min(0).max(32).default(16),
  fontScale: z.number().min(0.8).max(1.5).default(1),
  spacing: z.number().min(4).max(32).default(16),
  cardSize: z.enum(['small', 'medium', 'large']).default('medium'),
  backgroundImage: z.string().optional(),
  stickerIndex: z.number().min(1).max(30).default(13).optional(),
  secondarySticker: z.string().default('deco-set').optional(),
  showRibbonBadge: z.boolean().default(true).optional(),
  showFloralDeco: z.boolean().default(true).optional(),
  stickerComposition: z.enum(['cluster', 'duo', 'single']).default('cluster').optional(),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

// ─── Full TV Config ───
export const TVConfigSchema = z.object({
  version: z.number().default(1),
  updatedAt: z.string().optional(),
  publishedAt: z.string().optional(),
  theme: ThemeConfigSchema,
  sections: z.array(SectionSchema),
  apps: z.array(AppShortcutSchema),
  connectLaptop: ConnectLaptopSchema,
});

export type TVConfig = z.infer<typeof TVConfigSchema>;

// ─── Default Config ───
export const DEFAULT_APPS: AppShortcut[] = [
  { id: 'youtube', packageName: 'com.google.android.youtube.tv', displayName: 'YouTube', icon: '📺', visible: true, order: 0, category: 'streaming' },
  { id: 'netflix', packageName: 'com.netflix.ninja', displayName: 'Netflix', icon: '🎬', visible: true, order: 1, category: 'streaming' },
  { id: 'prime', packageName: 'com.amazon.amazonvideo.livingroom', displayName: 'Prime Video', icon: '🎥', visible: true, order: 2, category: 'streaming' },
  { id: 'disney', packageName: 'com.disney.disneyplus', displayName: 'Disney+', icon: '✨', visible: true, order: 3, category: 'streaming' },
  { id: 'spotify', packageName: 'com.spotify.tv.android', displayName: 'Spotify', icon: '🎵', visible: true, order: 4, category: 'music' },
  { id: 'plex', packageName: 'com.plexapp.android', displayName: 'Plex', icon: '🎞', visible: true, order: 5, category: 'media' },
  { id: 'vlc', packageName: 'org.videolan.vlc', displayName: 'VLC', icon: '📹', visible: false, order: 6, category: 'media' },
  { id: 'chrome', packageName: 'com.android.chrome', displayName: 'Chrome', icon: '🌐', visible: false, order: 7, category: 'utility' },
];

export const DEFAULT_SECTIONS: Section[] = [
  { id: 'header', type: 'header', visible: true, order: 0, label: 'ส่วนหัว' },
  { id: 'connect', type: 'connect', visible: true, order: 1, label: 'เชื่อมต่อแลปท็อป' },
  { id: 'favorites', type: 'favorites', visible: true, order: 2, label: 'แอปโปรด' },
  { id: 'quickSettings', type: 'quickSettings', visible: true, order: 3, label: 'การตั้งค่าด่วน' },
];

export const DEFAULT_THEME: ThemeConfig = {
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
};

export const MY_MELODY_THEME: ThemeConfig = {
  name: 'My Melody',
  backgroundColor: '#FCEEF2',
  surfaceColor: '#FFFFFF',
  accentColor: '#EE98AE',
  accentSecondary: '#E7829C',
  textColor: '#5C3A4D',
  textMuted: '#A67C8D',
  cardRadius: 18,
  fontScale: 1,
  spacing: 16,
  cardSize: 'medium',
  backgroundImage: '/themes/mymelody.png',
  stickerIndex: 13,
  secondarySticker: 'deco-set',
  showRibbonBadge: true,
  showFloralDeco: true,
  stickerComposition: 'cluster',
};

export const MY_MELODY_APPS: AppShortcut[] = [
  { id: 'youtube', packageName: 'com.google.android.youtube.tv', displayName: 'YouTube', icon: 'youtube', visible: true, order: 0, category: 'streaming' },
  { id: 'netflix', packageName: 'com.netflix.ninja', displayName: 'Netflix', icon: 'netflix', visible: true, order: 1, category: 'streaming' },
  { id: 'prime', packageName: 'com.amazon.amazonvideo.livingroom', displayName: 'Prime Video', icon: 'prime', visible: true, order: 2, category: 'streaming' },
  { id: 'disney', packageName: 'com.disney.disneyplus', displayName: 'Disney+', icon: 'disney', visible: true, order: 3, category: 'streaming' },
  { id: 'spotify', packageName: 'com.spotify.tv.android', displayName: 'Spotify', icon: 'spotify', visible: true, order: 4, category: 'music' },
  { id: 'playstore', packageName: 'com.android.vending', displayName: 'Play Store', icon: 'playstore', visible: true, order: 5, category: 'system' },
];

export const MY_MELODY_CONFIG: TVConfig = {
  version: 1,
  updatedAt: new Date().toISOString(),
  theme: MY_MELODY_THEME,
  sections: DEFAULT_SECTIONS,
  apps: MY_MELODY_APPS,
  connectLaptop: {
    label: 'Connect Laptop',
    subtitle: 'Wireless Screen Sharing',
    icon: 'monitor',
    receiverPackage: 'com.mediatek.androidbox',
    receiverActivity: 'com.mediatek.androidbox.MainActivity',
    launchStrategy: 'manual',
    instructions: 'กด Win + K บน Windows 11 แล้วเลือก TV ของคุณ',
    showStatus: true,
  },
};

export const DEFAULT_CONFIG: TVConfig = MY_MELODY_CONFIG;

