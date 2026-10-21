import { useState } from 'react';
import { useEditorStore } from '../store/editor';
import type { AppShortcut } from '../types/config';
import {
  GripVertical,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
} from 'lucide-react';

export function AppsManagerPage() {
  const { config, updateApp, addApp, removeApp, reorderApps } = useEditorStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const sortedApps = [...config.apps].sort((a, b) => a.order - b.order);

  const handleDragStart = (index: number) => setDragFrom(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragFrom === null || dragFrom === index) return;
    const newApps = [...sortedApps];
    const [moved] = newApps.splice(dragFrom, 1);
    newApps.splice(index, 0, moved);
    reorderApps(newApps);
    setDragFrom(index);
  };

  const startEdit = (app: AppShortcut) => {
    setEditingId(app.id);
    setEditName(app.displayName);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateApp(editingId, { displayName: editName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">จัดการแอป</h2>
        <p className="page-subtitle">เพิ่ม ลบ ซ่อน และจัดลำดับแอปที่จะแสดงบนหน้าจอ TV</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-info">
            ทั้งหมด: {config.apps.length} แอป
          </span>
          <span className="badge badge-success">
            แสดง: {config.apps.filter(a => a.visible).length}
          </span>
          <span className="badge badge-warning">
            ซ่อน: {config.apps.filter(a => !a.visible).length}
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} />
          เพิ่มแอป
        </button>
      </div>

      {/* App List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sortedApps.map((app, idx) => (
          <div
            key={app.id}
            className={`drag-item ${!app.visible ? 'hidden-app' : ''}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={() => setDragFrom(null)}
            style={{
              opacity: app.visible ? 1 : 0.5,
            }}
          >
            <div className="drag-handle">
              <GripVertical size={16} />
            </div>

            {/* Icon */}
            <div style={{
              width: 40,
              height: 40,
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              flexShrink: 0,
            }}>
              {app.icon || '📱'}
            </div>

            {/* Name / Edit */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {editingId === app.id ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    className="form-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    autoFocus
                    style={{ flex: 1, fontSize: 13 }}
                  />
                  <button className="btn btn-ghost btn-icon" onClick={saveEdit}>
                    <Check size={14} style={{ color: 'var(--success)' }} />
                  </button>
                  <button className="btn btn-ghost btn-icon" onClick={() => setEditingId(null)}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{app.displayName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {app.packageName}
                  </div>
                </>
              )}
            </div>

            {/* Category */}
            {app.category && (
              <span className="badge badge-info" style={{ fontSize: 10 }}>
                {app.category}
              </span>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => updateApp(app.id, { visible: !app.visible })}
                title={app.visible ? 'ซ่อน' : 'แสดง'}
              >
                {app.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => startEdit(app)}
                title="แก้ไขชื่อ"
              >
                <Pencil size={14} />
              </button>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => removeApp(app.id)}
                title="ลบ"
                style={{ color: 'var(--error)' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add App Modal */}
      {showAddModal && <AddAppModal onClose={() => setShowAddModal(false)} onAdd={addApp} />}
    </div>
  );
}

function AddAppModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (app: AppShortcut) => void;
}) {
  const [name, setName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [category, setCategory] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !packageName.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      packageName: packageName.trim(),
      displayName: name.trim(),
      icon: '📱',
      visible: true,
      order: 999,
      category: category || undefined,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">เพิ่มแอปใหม่</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">ชื่อที่แสดง</label>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น YouTube"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Package Name</label>
            <input
              className="form-input"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="เช่น com.google.android.youtube.tv"
            />
          </div>
          <div className="form-group">
            <label className="form-label">หมวดหมู่ (ไม่บังคับ)</label>
            <input
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="เช่น streaming, media, utility"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!name.trim() || !packageName.trim()}>
            <Plus size={14} />
            เพิ่มแอป
          </button>
        </div>
      </div>
    </div>
  );
}
