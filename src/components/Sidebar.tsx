import { useEditorStore } from '../store/editor';
import {
  LayoutDashboard,
  Palette,
  AppWindow,
  Laptop,
  Database,
  MonitorPlay,
  Settings,
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'ภาพรวม', icon: LayoutDashboard },
  { id: 'editor', label: 'ตัวแก้ไขธีม', icon: Palette },
  { id: 'apps', label: 'จัดการแอป', icon: AppWindow },
  { id: 'connect', label: 'เชื่อมต่อแลปท็อป', icon: Laptop },
  { id: 'config', label: 'จัดการคอนฟิก', icon: Database },
  { id: 'preview', label: 'ตัวอย่างหน้าจอ TV', icon: MonitorPlay },
];

export function Sidebar() {
  const { activeTab, setActiveTab, deviceStatus } = useEditorStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">N</div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-title">NOVA TV</span>
          <span className="sidebar-brand-subtitle">ระบบจัดการ</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">เมนูหลัก</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon />
              {item.label}
            </button>
          );
        })}

        <div className="sidebar-section-title">ตั้งค่า</div>
        <button
          className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings />
          ตั้งค่าระบบ
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className={`status-dot ${deviceStatus}`} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
            {deviceStatus === 'connected' ? 'TV เชื่อมต่อแล้ว' :
             deviceStatus === 'disconnected' ? 'TV ไม่ได้เชื่อมต่อ' :
             'สถานะไม่ทราบ'}
          </span>
        </div>
      </div>
    </aside>
  );
}
