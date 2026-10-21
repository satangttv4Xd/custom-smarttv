import { useEditorStore } from '../store/editor';
import {
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';
import { TVPreview } from '../components/TVPreview';

export function SectionEditorPage() {
  const { config, updateSection, reorderSections } = useEditorStore();
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragFrom === null || dragFrom === index) return;
    const newSections = [...sortedSections];
    const [moved] = newSections.splice(dragFrom, 1);
    newSections.splice(index, 0, moved);
    reorderSections(newSections);
    setDragFrom(index);
  };

  const sectionTypeLabels: Record<string, string> = {
    header: 'ส่วนหัว — โลโก้ เวลา สถานะ',
    connect: 'เชื่อมต่อแลปท็อป — การ์ดแชร์หน้าจอ',
    favorites: 'แอปโปรด — กริดแอป',
    quickSettings: 'การตั้งค่าด่วน — ลิงก์ตั้งค่าระบบ',
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">ตั้งค่าระบบ</h2>
        <p className="page-subtitle">จัดลำดับและแสดง/ซ่อนส่วนต่างๆ ของหน้าจอ TV</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="card">
            <div className="card-header">
              <div className="card-title">ลำดับส่วน</div>
              <div className="card-subtitle">ลากเพื่อจัดลำดับ</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sortedSections.map((section, idx) => (
                <div
                  key={section.id}
                  className="drag-item"
                  draggable
                  onDragStart={() => setDragFrom(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={() => setDragFrom(null)}
                  style={{ opacity: section.visible ? 1 : 0.5 }}
                >
                  <div className="drag-handle">
                    <GripVertical size={16} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>
                      {section.label || section.id}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {sectionTypeLabels[section.type] || section.type}
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => updateSection(section.id, { visible: !section.visible })}
                  >
                    {section.visible ?
                      <Eye size={16} style={{ color: 'var(--success)' }} /> :
                      <EyeOff size={16} style={{ color: 'var(--text-dim)' }} />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{
            position: 'sticky',
            top: 'calc(var(--header-height) + 24px)',
          }}>
            <div style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              marginBottom: 12,
              textAlign: 'center',
            }}>
              ตัวอย่างสดหน้าจอ TV
            </div>
            <TVPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
