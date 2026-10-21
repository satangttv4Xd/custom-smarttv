import { useEditorStore } from '../store/editor';
import { Undo2, Redo2, Eye, Upload, RotateCcw } from 'lucide-react';

const TAB_TITLES: Record<string, string> = {
  overview: 'ภาพรวม',
  editor: 'ตัวแก้ไขธีม',
  apps: 'จัดการแอป',
  connect: 'การเชื่อมต่อ',
  config: 'จัดการคอนฟิก',
  preview: 'ตัวอย่างหน้าจอ TV',
  settings: 'ตั้งค่าระบบ',
};

export function TopBar() {
  const {
    activeTab,
    canUndo,
    canRedo,
    undo,
    redo,
    isDirty,
    isPublishing,
    publish,
    togglePreview,
    resetToDefault,
  } = useEditorStore();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{TAB_TITLES[activeTab] || 'NOVA TV'}</h1>
        {isDirty && (
          <span className="badge badge-warning">มีการเปลี่ยนแปลง</span>
        )}
      </div>

      <div className="topbar-right">
        <button
          className="btn btn-ghost btn-icon"
          onClick={undo}
          disabled={!canUndo}
          title="เลิกทำ (Ctrl+Z)"
          style={{ opacity: canUndo ? 1 : 0.3 }}
        >
          <Undo2 />
        </button>
        <button
          className="btn btn-ghost btn-icon"
          onClick={redo}
          disabled={!canRedo}
          title="ทำซ้ำ (Ctrl+Y)"
          style={{ opacity: canRedo ? 1 : 0.3 }}
        >
          <Redo2 />
        </button>

        <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />

        <button className="btn btn-secondary btn-sm" onClick={togglePreview}>
          <Eye />
          ดูตัวอย่าง
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={resetToDefault}
          title="รีเซ็ตเป็นค่าเริ่มต้น"
        >
          <RotateCcw />
          รีเซ็ต
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={publish}
          disabled={isPublishing || !isDirty}
          style={{ opacity: isDirty ? 1 : 0.5 }}
        >
          <Upload />
          {isPublishing ? 'กำลังเผยแพร่...' : 'เผยแพร่ไปยัง TV'}
        </button>
      </div>
    </header>
  );
}
