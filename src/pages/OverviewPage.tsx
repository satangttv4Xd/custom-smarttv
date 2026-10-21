import { useState, useEffect } from 'react';
import { useEditorStore } from '../store/editor';
import type { ThemeConfig } from '../types/config';
import {
  Tv,
  MonitorPlay,
  AppWindow,
  Clock,
  Upload,
  Settings,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Terminal,
  HelpCircle,
} from 'lucide-react';

export function OverviewPage() {
  const {
    config,
    isDirty,
    lastPublished,
    deviceStatus,
    savedThemes,
    tvIp,
    setTvIp,
    isConnecting,
    checkDeviceStatus,
    connectDevice,
    launchScreenShare,
    runDebloat,
    runRestore,
  } = useEditorStore();

  const [inputIp, setInputIp] = useState(tvIp || '');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [showGuide, setShowGuide] = useState(false);
  const visibleApps = config.apps.filter((a) => a.visible);

  useEffect(() => {
    checkDeviceStatus();
  }, [checkDeviceStatus]);

  useEffect(() => {
    if (tvIp && !inputIp) {
      setInputIp(tvIp);
    }
  }, [tvIp, inputIp]);

  const showMsg = (msg: string, type: 'success' | 'error' | 'info') => {
    setActionFeedback(msg);
    setFeedbackType(type);
    setTimeout(() => setActionFeedback(null), 5000);
  };

  const handleConnect = async () => {
    if (!inputIp.trim()) {
      showMsg('กรุณากรอก IP Address ของ TV ก่อนเชื่อมต่อ', 'error');
      return;
    }
    setTvIp(inputIp.trim());
    showMsg(`กำลังเชื่อมต่อ ${inputIp.trim()} ทางพอร์ต 5555...`, 'info');
    const ok = await connectDevice(inputIp.trim());
    if (ok) {
      showMsg(`เชื่อมต่อกับ Hisense TV (${inputIp.trim()}) สำเร็จแล้ว!`, 'success');
    } else {
      showMsg(
        `ไม่สามารถเชื่อมต่อ ${inputIp.trim()} ได้ โปรดตรวจสอบว่า TV เปิด USB debugging แล้วและอยู่ใน Wi-Fi เดียวกัน`,
        'error'
      );
    }
  };

  const handleScreenShare = async () => {
    showMsg('กำลังส่งสัญญาณเปิดตัวรับสัญญาณ Screen Sharing บน TV...', 'info');
    const ok = await launchScreenShare();
    if (ok) {
      showMsg('เปิดตัวรับสัญญาณบน TV สำเร็จ! บนแลปท็อปให้กด Win + K แล้วเลือกชื่อ TV', 'success');
    } else {
      showMsg('ไม่สามารถเปิด Intent บน TV ได้ (โปรดตรวจสอบการเชื่อมต่อ ADB)', 'error');
    }
  };

  const handleDebloat = async () => {
    if (!confirm('ยืนยันที่จะปิดการทำงานของแอปขยะและบริการวิเคราะห์ข้อมูลบน Hisense 32A4200G หรือไม่? (ปลอดภัยและสามารถคืนค่าได้ตลอดเวลา)')) {
      return;
    }
    showMsg('กำลังดำเนินการ Debloat ปลอดภัย (ปิดแอปที่ไม่จำเป็น 15 รายการ)...', 'info');
    const ok = await runDebloat();
    if (ok) {
      showMsg('Debloat สำเร็จ! TV จะทำงานเร็วขึ้นและลดอาการหน่วง', 'success');
    } else {
      showMsg('Debloat ไม่สำเร็จ โปรดตรวจสอบการเชื่อมต่อ ADB กับ TV', 'error');
    }
  };

  const handleRestore = async () => {
    if (!confirm('ยืนยันที่จะคืนค่าแอปทั้งหมดกลับสู่ค่าเริ่มต้นหรือไม่?')) {
      return;
    }
    showMsg('กำลังเปิดใช้งานระบบและแอปที่เคยถูกปิดทั้งหมด...', 'info');
    const ok = await runRestore();
    if (ok) {
      showMsg('คืนค่าแอปทั้งหมดเรียบร้อยแล้ว', 'success');
    } else {
      showMsg('การคืนค่าไม่สำเร็จ โปรดตรวจสอบการเชื่อมต่อ ADB', 'error');
    }
  };

  const formatDate = (iso: string | null | undefined) => {
    if (!iso) return 'ยังไม่เคย';
    return new Date(iso).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">ภาพรวมระบบ NOVA TV</h2>
        <p className="page-subtitle">
          แดชบอร์ดปรับแต่งและควบคุม Hisense 32A4200G Android TV พร้อมการแชร์หน้าจอไร้สาย
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className={`stat-card-icon ${deviceStatus === 'connected' ? 'green' : 'purple'}`}>
            <Tv size={20} />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: 16 }}>
              {deviceStatus === 'connected'
                ? 'เชื่อมต่อแล้ว'
                : deviceStatus === 'disconnected'
                ? 'ไม่ได้เชื่อมต่อ'
                : 'ไม่ทราบ'}
            </div>
            <div className="stat-label">สถานะ TV (ADB)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon blue">
            <AppWindow size={20} />
          </div>
          <div>
            <div className="stat-value">{visibleApps.length}</div>
            <div className="stat-label">แอปที่แสดงบนหน้าหลัก</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon green">
            <Upload size={20} />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: 13 }}>
              {formatDate(lastPublished)}
            </div>
            <div className="stat-label">เผยแพร่คอนฟิกล่าสุด</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon orange">
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: 13 }}>
              {formatDate(config.updatedAt)}
            </div>
            <div className="stat-label">แก้ไขธีมล่าสุด</div>
          </div>
        </div>
      </div>

      {/* Action feedback notification */}
      {actionFeedback && (
        <div
          style={{
            padding: '12px 18px',
            marginBottom: 20,
            borderRadius: 'var(--radius-md)',
            background:
              feedbackType === 'success'
                ? 'rgba(34, 197, 94, 0.12)'
                : feedbackType === 'error'
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(59, 130, 246, 0.12)',
            border: `1px solid ${
              feedbackType === 'success'
                ? 'var(--success)'
                : feedbackType === 'error'
                ? 'var(--error)'
                : 'var(--accent-secondary)'
            }`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            color: 'var(--text-primary)',
          }}
        >
          {feedbackType === 'success' ? (
            <CheckCircle2 size={18} color="var(--success)" />
          ) : feedbackType === 'error' ? (
            <AlertTriangle size={18} color="var(--error)" />
          ) : (
            <Terminal size={18} color="var(--accent-secondary)" />
          )}
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* TV Connection & Controls Card */}
      <div className="card" style={{ marginBottom: 24, border: '1px solid var(--border-accent)' }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wifi size={18} style={{ color: 'var(--accent)' }} />
              การเชื่อมต่อและควบคุม TV (Hisense 32A4200G)
            </div>
            <div className="card-subtitle">
              เชื่อมต่อผ่าน Wi-Fi ADB บนพอร์ต 5555 สำหรับส่งคอนฟิกและควบคุมแบบไร้สาย
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowGuide(!showGuide)}
            style={{ color: 'var(--accent-secondary)' }}
          >
            <HelpCircle size={15} />
            {showGuide ? 'ซ่อนวิธีเปิด ADB' : 'วิธีเปิด ADB บนทีวี'}
          </button>
        </div>

        {/* Developer options helper */}
        {showGuide && (
          <div
            style={{
              padding: 16,
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 16,
              fontSize: 13,
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              ขั้นตอนเปิดโหมดนักพัฒนาบน Hisense Android TV:
            </div>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                เปิดทีวี กดรีโมทไปที่ <strong>Settings (การตั้งค่า)</strong> → <strong>Device Preferences</strong> → <strong>About</strong>
              </li>
              <li>
                เลื่อนลงไปที่ <strong>Build (หมายเลขบิลด์)</strong> แล้วกดปุ่ม OK บนรีโมท <strong>7 ครั้ง</strong> จนขึ้นข้อความว่า "คุณเป็นนักพัฒนาแล้ว"
              </li>
              <li>
                กดย้อนกลับ 1 ครั้ง จะพบเมนู <strong>Developer options (ตัวเลือกสำหรับนักพัฒนา)</strong>
              </li>
              <li>
                เข้าไปเปิดสวิตช์ <strong>USB debugging</strong> (ทีวีรุ่นนี้จะเปิด Network ADB พอร์ต 5555 อัตโนมัติทันที)
              </li>
              <li>
                ดูหมายเลข IP ของทีวีจาก <strong>Network & Internet</strong> แล้วนำมากรอกในช่องด้านล่าง
              </li>
            </ol>
          </div>
        )}

        {/* IP Input & Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px' }}>
            <input
              className="form-input"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              placeholder="กรอก IP ทีวี เช่น 192.168.1.125"
              style={{ width: '100%' }}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            <Wifi size={16} />
            {isConnecting ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อ TV'}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleScreenShare}
            title="เปิดตัวรับสัญญาณ Screen Sharing บน TV (com.mediatek.androidbox)"
          >
            <MonitorPlay size={16} />
            เปิด Screen Sharing บน TV
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleDebloat}
            title="ปิดระบบ telemetry และโฆษณาที่ทำให้ทีวีช้า"
          >
            <Play size={16} />
            Debloat (ล้างแอปขยะ)
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={handleRestore}
            title="กู้คืนแอปทั้งหมดกลับมา"
            style={{ color: 'var(--text-muted)' }}
          >
            <RotateCcw size={14} />
            คืนค่าแอป
          </button>
        </div>
      </div>

      {/* Current Theme Info & Quick Preview */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">ธีมปัจจุบัน</div>
              <div className="card-subtitle">{config.theme.name}</div>
            </div>
            {isDirty && <span className="badge badge-warning">มีการเปลี่ยนแปลง</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ThemeColorRow label="พื้นหลัง" color={config.theme.backgroundColor} />
            <ThemeColorRow label="พื้นผิว" color={config.theme.surfaceColor} />
            <ThemeColorRow label="สีหลัก" color={config.theme.accentColor} />
            <ThemeColorRow label="สีรอง" color={config.theme.accentSecondary} />
            <ThemeColorRow label="ตัวอักษร" color={config.theme.textColor} />

            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-info">มุมโค้ง: {config.theme.cardRadius}px</span>
              <span className="badge badge-info">ขนาดฟอนต์: {config.theme.fontScale}x</span>
              <span className="badge badge-info">ระยะห่าง: {config.theme.spacing}px</span>
              <span className="badge badge-info">ขนาดการ์ด: {config.theme.cardSize}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">ธีมที่บันทึกไว้</div>
              <div className="card-subtitle">{savedThemes.length} ธีม</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {savedThemes.map((theme) => (
              <ThemePreviewRow key={theme.name} theme={theme} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">การเชื่อมต่อแลปท็อป</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MonitorPlay size={22} style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{config.connectLaptop.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                กด <strong>Win + K</strong> บน Windows 11 เพื่อแคสต์หน้าจอ
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">ส่วนที่แสดงบนหน้าจอ TV</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {config.sections.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 13,
                }}
              >
                <span>{s.label || s.id}</span>
                <span className={`badge ${s.visible ? 'badge-success' : 'badge-error'}`}>
                  {s.visible ? 'แสดง' : 'ซ่อน'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">ข้อมูลสเปกและระบบ</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>รุ่นทีวี</span>
              <span style={{ fontWeight: 600 }}>Hisense 32A4200G</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ชิปประมวลผล</span>
              <span style={{ fontWeight: 600 }}>MediaTek m7322 / 1GB RAM</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ระบบปฏิบัติการ</span>
              <span style={{ fontWeight: 600 }}>Android TV 9 (Pie)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ตัวรับสัญญาณ Cast</span>
              <code style={{ fontSize: 11, color: 'var(--accent-secondary)' }}>com.mediatek.androidbox</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>เวอร์ชันคอนฟิก</span>
              <span style={{ fontWeight: 600 }}>v{config.version}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeColorRow({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: color,
          border: '1px solid var(--border)',
          flexShrink: 0,
        }}
      />
      <span style={{ color: 'var(--text-secondary)', minWidth: 60 }}>{label}</span>
      <code
        style={{
          fontSize: 11,
          color: 'var(--text-muted)',
          background: 'var(--bg-surface)',
          padding: '2px 6px',
          borderRadius: 4,
        }}
      >
        {color}
      </code>
    </div>
  );
}

function ThemePreviewRow({ theme }: { theme: ThemeConfig }) {
  const { loadTheme } = useEditorStore();

  return (
    <button
      onClick={() => loadTheme(theme.name)}
      className="drag-item"
      style={{ cursor: 'pointer', width: '100%' }}
    >
      <div
        style={{
          display: 'flex',
          gap: 4,
          flexShrink: 0,
        }}
      >
        {[theme.backgroundColor, theme.surfaceColor, theme.accentColor, theme.accentSecondary].map(
          (c, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: c,
                border: '1px solid var(--border)',
              }}
            />
          )
        )}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{theme.name}</span>
      <Settings size={14} style={{ marginLeft: 'auto', color: 'var(--text-dim)' }} />
    </button>
  );
}
