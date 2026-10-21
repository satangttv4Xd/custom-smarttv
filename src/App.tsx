import { useEffect } from 'react';
import { useEditorStore } from './store/editor';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewPage } from './pages/OverviewPage';
import { ThemeEditorPage } from './pages/ThemeEditorPage';
import { AppsManagerPage } from './pages/AppsManagerPage';
import { ConnectSettingsPage } from './pages/ConnectSettingsPage';
import { ConfigManagerPage } from './pages/ConfigManagerPage';
import { PreviewPage } from './pages/PreviewPage';
import { SectionEditorPage } from './pages/SectionEditorPage';
import { TVPreview } from './components/TVPreview';
import { X, CheckCircle } from 'lucide-react';

export default function App() {
  const {
    activeTab,
    previewMode,
    togglePreview,
    undo,
    redo,
    canUndo,
    canRedo,
    lastPublished,
    isPublishing,
  } = useEditorStore();

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs/textareas
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement)?.tagName
        )
      ) {
        return;
      }

      // Ctrl+Z or Cmd+Z -> Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }
      // Ctrl+Y or Ctrl+Shift+Z -> Redo
      else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        if (canRedo) redo();
      }
      // Ctrl+P -> Toggle quick TV preview modal
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        togglePreview();
      }
      // Escape -> close preview modal if open
      else if (e.key === 'Escape' && previewMode) {
        e.preventDefault();
        togglePreview();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, previewMode, togglePreview]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'editor':
        return <ThemeEditorPage />;
      case 'apps':
        return <AppsManagerPage />;
      case 'connect':
        return <ConnectSettingsPage />;
      case 'config':
        return <ConfigManagerPage />;
      case 'preview':
        return <PreviewPage />;
      case 'settings':
        return <SectionEditorPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Area */}
      <div className="main-content">
        <TopBar />
        <main>{renderActivePage()}</main>
      </div>

      {/* Quick Preview Modal Overlay (when toggled from TopBar or Ctrl+P, and not already on preview page) */}
      {previewMode && activeTab !== 'preview' && (
        <div className="modal-overlay" onClick={togglePreview}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90vw', maxWidth: 960 }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>
                  จำลองหน้าจอ TV (Real-time Preview)
                </span>
                <span className="badge badge-success">720p HD</span>
              </div>
              <button
                className="btn btn-ghost btn-icon"
                onClick={togglePreview}
                title="ปิด (Esc)"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ width: '100%', maxWidth: 860, margin: '0 auto' }}>
                <TVPreview />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                กด <kbd style={{ padding: '2px 6px', background: 'var(--bg-surface)', borderRadius: 4 }}>Esc</kbd> เพื่อปิดหน้าต่าง หรือเลือกเมนู "ตัวอย่างหน้าจอ TV" ในแถบด้านข้างเพื่อทดสอบรีโมทคอนโทรล
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Publishing Status Toast */}
      {isPublishing && (
        <div className="toast">
          <span className="status-dot unknown" style={{ animation: 'pulse 1s infinite' }} />
          <span>กำลังส่งคอนฟิกไปยัง TV Companion Service...</span>
        </div>
      )}
      {!isPublishing && lastPublished && (
        <div className="toast" style={{ opacity: 0.9 }}>
          <CheckCircle size={16} color="var(--success)" />
          <span>คอนฟิกบันทึกล่าสุดสำเร็จ</span>
        </div>
      )}
    </div>
  );
}
