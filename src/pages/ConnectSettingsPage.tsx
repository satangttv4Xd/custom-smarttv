import { useEditorStore } from '../store/editor';
import { Monitor, AlertCircle, Info } from 'lucide-react';

export function ConnectSettingsPage() {
  const { config, updateConnectLaptop } = useEditorStore();
  const { connectLaptop } = config;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">ตั้งค่าการเชื่อมต่อแลปท็อป</h2>
        <p className="page-subtitle">ปรับแต่งการ์ดเชื่อมต่อ คำแนะนำ และกลยุทธ์การเปิดตัวรับสัญญาณ</p>
      </div>

      <div className="grid grid-2">
        {/* Card Configuration */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">ตั้งค่าการ์ด</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">ข้อความหลัก</label>
              <input
                className="form-input"
                value={connectLaptop.label}
                onChange={(e) => updateConnectLaptop({ label: e.target.value })}
                placeholder="เชื่อมต่อแลปท็อป"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ข้อความรอง</label>
              <input
                className="form-input"
                value={connectLaptop.subtitle}
                onChange={(e) => updateConnectLaptop({ subtitle: e.target.value })}
                placeholder="แชร์หน้าจอแบบไร้สาย"
              />
            </div>

            <div className="form-group">
              <label className="form-label">กลยุทธ์การเปิด</label>
              <select
                className="form-select"
                value={connectLaptop.launchStrategy}
                onChange={(e) => updateConnectLaptop({
                  launchStrategy: e.target.value as 'intent' | 'manual' | 'auto',
                })}
              >
                <option value="manual">เปิดด้วยตนเอง — แสดงคำแนะนำ</option>
                <option value="intent">Intent อัตโนมัติ — เปิดตัวรับสัญญาณ</option>
                <option value="auto">อัตโนมัติ — ตรวจจับและเปิดเอง</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">แสดงสถานะ</label>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={connectLaptop.showStatus}
                  onChange={(e) => updateConnectLaptop({ showStatus: e.target.checked })}
                />
                <div className="toggle-track" />
                <div className="toggle-thumb" />
              </label>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">คำแนะนำการเชื่อมต่อ</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">ข้อความคำแนะนำ</label>
              <textarea
                className="form-input"
                value={connectLaptop.instructions}
                onChange={(e) => updateConnectLaptop({ instructions: e.target.value })}
                rows={3}
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="คำแนะนำสำหรับผู้ใช้..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Package ตัวรับ (ไม่บังคับ)</label>
              <input
                className="form-input"
                value={connectLaptop.receiverPackage || ''}
                onChange={(e) => updateConnectLaptop({
                  receiverPackage: e.target.value || undefined,
                })}
                placeholder="เช่น com.hisense.odinbrowser"
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Activity ตัวรับ (ไม่บังคับ)</label>
              <input
                className="form-input"
                value={connectLaptop.receiverActivity || ''}
                onChange={(e) => updateConnectLaptop({
                  receiverActivity: e.target.value || undefined,
                })}
                placeholder="เช่น .MiracastReceiverActivity"
                style={{ fontFamily: 'monospace', fontSize: 12 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <div className="card" style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Info size={20} style={{ color: 'var(--accent-secondary)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>ขั้นตอนการเชื่อมต่อ</div>
              <ol style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 16 }}>
                <li>เลือก "เชื่อมต่อแลปท็อป" บนหน้าจอ TV</li>
                <li>Launcher จะเปิดตัวรับสัญญาณหรือแสดงคำแนะนำ</li>
                <li>กด <strong>Win + K</strong> บน Windows 11</li>
                <li>เลือก TV จากรายการอุปกรณ์</li>
                <li>ยืนยันการเชื่อมต่อเมื่อมีข้อความปรากฏ</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <AlertCircle size={20} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>ข้อควรระวัง</div>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 16 }}>
                <li>Chromecast, Miracast และ DLNA เป็นคนละโปรโตคอล</li>
                <li>ต้องตรวจสอบ Package ตัวรับบน TV จริง ก่อนตั้งค่า Intent</li>
                <li>หากตัวรับไม่รองรับ Miracast ให้ใช้ fallback แบบ Manual</li>
                <li>อย่าสมอ้างว่าฟีเจอร์ทำงานได้ก่อนทดสอบบน TV จริง</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="card-title">ตัวอย่างการ์ด</div>
        </div>
        <div style={{
          background: config.theme.surfaceColor,
          borderRadius: config.theme.cardRadius,
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          border: `2px solid ${config.theme.accentColor}33`,
        }}>
          <div style={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${config.theme.accentColor}33, ${config.theme.accentSecondary}33)`,
            borderRadius: config.theme.cardRadius * 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Monitor size={28} style={{ color: config.theme.accentSecondary }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, color: config.theme.textColor }}>
              {connectLaptop.label}
            </div>
            <div style={{ fontSize: 13, color: config.theme.textMuted }}>
              {connectLaptop.subtitle}
            </div>
          </div>
          {connectLaptop.showStatus && (
            <div style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--success)',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
              }} />
              <span style={{ fontSize: 12, color: config.theme.textMuted }}>พร้อม</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
