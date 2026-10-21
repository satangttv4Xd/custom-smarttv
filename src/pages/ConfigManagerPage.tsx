import { useState, useRef } from 'react';
import { useEditorStore } from '../store/editor';
import {
  Save,
  Copy,
  Download,
  Upload,
  Trash2,
  RotateCcw,
  History,
  Check,
  X,
  Plus,
} from 'lucide-react';

export function ConfigManagerPage() {
  const {
    config,
    savedThemes,
    saveTheme,
    loadTheme,
    deleteTheme,
    duplicateTheme,
    exportConfig,
    importConfig,
    resetToDefault,
    history,
    historyIndex,
  } = useEditorStore();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-tv-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const success = importConfig(text);
      if (success) {
        setShowImportSuccess(true);
        setTimeout(() => setShowImportSuccess(false), 3000);
        setImportError(null);
      } else {
        setImportError('ไฟล์ JSON ไม่ถูกต้องหรือรูปแบบไม่ตรง');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveTheme = () => {
    if (!newThemeName.trim()) return;
    saveTheme(newThemeName.trim());
    setSaveModalOpen(false);
    setNewThemeName('');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">จัดการคอนฟิก</h2>
        <p className="page-subtitle">บันทึก โหลด นำเข้า ส่งออก และย้อนกลับการตั้งค่า</p>
      </div>

      <div className="grid grid-2">
        {/* Saved Themes */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">ธีมที่บันทึกไว้</div>
              <div className="card-subtitle">{savedThemes.length} ธีม</div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setSaveModalOpen(true)}>
              <Plus size={14} />
              บันทึกธีมปัจจุบัน
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedThemes.map((theme) => (
              <div key={theme.name} className="drag-item">
                <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                  {[theme.backgroundColor, theme.accentColor, theme.accentSecondary].map((c, i) => (
                    <div key={i} style={{
                      width: 14, height: 14, borderRadius: 4,
                      background: c, border: '1px solid var(--border)',
                    }} />
                  ))}
                </div>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{theme.name}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => loadTheme(theme.name)} title="โหลด">
                    <Upload size={12} />
                  </button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => duplicateTheme(theme.name, `${theme.name} (สำเนา)`)} title="ทำสำเนา">
                    <Copy size={12} />
                  </button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteTheme(theme.name)} title="ลบ" style={{ color: 'var(--error)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Import / Export */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">นำเข้า / ส่งออก</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn btn-secondary" onClick={handleExport} style={{ width: '100%', justifyContent: 'center' }}>
              <Download size={16} />
              ส่งออกการตั้งค่าเป็น JSON
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Upload size={16} />
              นำเข้าการตั้งค่าจาก JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />

            {importError && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                color: 'var(--error)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <X size={14} />
                {importError}
              </div>
            )}

            {showImportSuccess && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13,
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Check size={14} />
                นำเข้าสำเร็จ!
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <button className="btn btn-danger" onClick={resetToDefault} style={{ width: '100%', justifyContent: 'center' }}>
                <RotateCcw size={16} />
                รีเซ็ตทุกอย่างเป็นค่าเริ่มต้น
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div>
            <div className="card-title">ประวัติการเปลี่ยนแปลง</div>
            <div className="card-subtitle">{history.length} รายการ</div>
          </div>
          <History size={18} style={{ color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
          {[...history].reverse().map((entry, idx) => {
            const reverseIdx = history.length - 1 - idx;
            const isCurrent = reverseIdx === historyIndex;
            return (
              <div
                key={entry.timestamp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: isCurrent ? 'var(--accent-glow)' : 'transparent',
                  border: isCurrent ? '1px solid var(--border-accent)' : '1px solid transparent',
                  fontSize: 13,
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: isCurrent ? 'var(--accent)' : 'var(--bg-elevated)',
                  flexShrink: 0,
                }} />
                <span style={{ flex: 1, color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {entry.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                  {new Date(entry.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Config Preview */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="card-title">JSON คอนฟิกปัจจุบัน</div>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(config, null, 2));
          }}>
            <Copy size={14} />
            คัดลอก
          </button>
        </div>
        <pre style={{
          background: 'var(--bg-primary)',
          padding: 16,
          borderRadius: 'var(--radius-md)',
          fontSize: 11,
          color: 'var(--text-secondary)',
          maxHeight: 300,
          overflow: 'auto',
          fontFamily: "'Fira Code', monospace",
          lineHeight: 1.6,
        }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      {/* Save Theme Modal */}
      {saveModalOpen && (
        <div className="modal-overlay" onClick={() => setSaveModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">บันทึกธีม</h3>
              <button className="btn btn-ghost btn-icon" onClick={() => setSaveModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">ชื่อธีม</label>
                <input
                  className="form-input"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  placeholder="ชื่อธีมใหม่..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTheme()}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSaveModalOpen(false)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={handleSaveTheme} disabled={!newThemeName.trim()}>
                <Save size={14} />
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
