import { useEffect, useCallback } from 'react';
import { useEditorStore } from '../store/editor';
import { TVPreview } from '../components/TVPreview';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MonitorPlay,
  Keyboard,
} from 'lucide-react';

export function PreviewPage() {
  const {
    config,
    previewFocusIndex,
    simulateRemote,
  } = useEditorStore();

  const visibleApps = config.apps.filter((a) => a.visible);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': e.preventDefault(); simulateRemote('up'); break;
      case 'ArrowDown': e.preventDefault(); simulateRemote('down'); break;
      case 'ArrowLeft': e.preventDefault(); simulateRemote('left'); break;
      case 'ArrowRight': e.preventDefault(); simulateRemote('right'); break;
    }
  }, [simulateRemote]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Determine what's focused
  const getFocusLabel = () => {
    if (previewFocusIndex === 0) return 'เชื่อมต่อแลปท็อป';
    const appIdx = previewFocusIndex - 1;
    if (appIdx < visibleApps.length) return visibleApps[appIdx].displayName;
    return 'การตั้งค่าด่วน';
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">ตัวอย่างหน้าจอ TV</h2>
        <p className="page-subtitle">จำลองหน้าจอ TV ที่ 720p พร้อมการนำทางด้วยรีโมท — ใช้ปุ่มลูกศรบนคีย์บอร์ด</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* Preview Label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          <MonitorPlay size={16} />
          <span>ตัวอย่าง 720p • {config.theme.name}</span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span>นี่เป็นการจำลอง ไม่ใช่หน้าจอ TV จริง</span>
        </div>

        {/* TV Screen */}
        <div style={{ width: '100%', maxWidth: 960 }}>
          <TVPreview />
        </div>

        {/* Remote Control */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: 24,
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Keyboard size={14} />
            จำลองรีโมท TV — ใช้ปุ่มลูกศรหรือกดปุ่มด้านล่าง
          </div>

          {/* D-Pad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            <div />
            <RemoteButton icon={<ArrowUp size={18} />} onClick={() => simulateRemote('up')} />
            <div />
            <RemoteButton icon={<ArrowLeft size={18} />} onClick={() => simulateRemote('left')} />
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 600,
              color: 'white',
              cursor: 'pointer',
            }}>
              OK
            </div>
            <RemoteButton icon={<ArrowRight size={18} />} onClick={() => simulateRemote('right')} />
            <div />
            <RemoteButton icon={<ArrowDown size={18} />} onClick={() => simulateRemote('down')} />
            <div />
          </div>

          {/* Focus Info */}
          <div style={{
            padding: '8px 16px',
            background: 'var(--accent-glow)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-accent)',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ color: 'var(--text-muted)' }}>โฟกัส:</span>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{getFocusLabel()}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>
              (ตำแหน่ง {previewFocusIndex})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemoteButton({ icon, onClick }: { icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
      onMouseDown={(e) => {
        (e.target as HTMLElement).style.transform = 'scale(0.92)';
      }}
      onMouseUp={(e) => {
        (e.target as HTMLElement).style.transform = '';
      }}
    >
      {icon}
    </button>
  );
}
