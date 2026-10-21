import { useEditorStore } from '../store/editor';
import {
  Wifi,
  Settings,
  Clock,
  Monitor,
  ChevronRight,
  Home,
  LayoutGrid,
  Laptop,
  Plus,
  Tv,
  Palette,
  RotateCcw,
  Info,
} from 'lucide-react';
import {
  YouTubeLogo,
  NetflixLogo,
  PrimeVideoLogo,
  DisneyLogo,
  SpotifyLogo,
  PlayStoreLogo,
  CuteRibbon,
} from './AppLogos';
import './TVPreview.css';

export function TVPreview() {
  const { config, previewFocusIndex, simulateRemote } = useEditorStore();
  const { theme, apps, connectLaptop, sections } = config;
  const isMelodyTheme =
    theme.name.toLowerCase().includes('melody') ||
    theme.backgroundColor === '#FCEEF2' ||
    Boolean(theme.backgroundImage);

  const visibleApps = apps.filter((a) => a.visible).sort((a, b) => a.order - b.order);
  const visibleSections = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const getAppLogo = (app: { id: string; displayName: string }) => {
    const key = (app.displayName || app.id).toLowerCase();
    if (key.includes('youtube')) return <YouTubeLogo size={32} />;
    if (key.includes('netflix')) return <NetflixLogo size={30} />;
    if (key.includes('prime')) return <PrimeVideoLogo size={30} />;
    if (key.includes('disney')) return <DisneyLogo size={30} />;
    if (key.includes('spotify')) return <SpotifyLogo size={30} />;
    if (key.includes('play')) return <PlayStoreLogo size={30} />;
    return <Tv size={26} color={theme.accentColor} />;
  };

  // If My Melody theme is active, render the faithful full-fidelity layout matching the user's image!
  if (isMelodyTheme) {
    return (
      <div
        className="tv-preview-frame mymelody-theme"
        style={{
          background: `radial-gradient(circle at 80% 20%, #FFF5F7 0%, ${theme.backgroundColor} 70%, #F8E2E9 100%)`,
          color: theme.textColor,
        }}
      >
        <div className="mymelody-container">
          {/* Left Navigation Sidebar */}
          <aside className="mymelody-sidebar">
            <div className="mymelody-brand">
              <div className="mymelody-logo-wrap">
                <img
                  src="/themes/sticker-avatar.png"
                  alt="My Melody"
                  style={{ width: 34, height: 34, objectFit: 'contain' }}
                />
              </div>
              <div className="mymelody-brand-text">
                <div className="mymelody-brand-title">NOVA TV</div>
                <div className="mymelody-brand-sub">My Melody Theme</div>
              </div>
            </div>

            <nav className="mymelody-nav">
              <button className="mymelody-nav-item active">
                <Home size={15} />
                <span>Home</span>
              </button>
              <button className="mymelody-nav-item">
                <LayoutGrid size={15} />
                <span>Apps</span>
              </button>
              <button
                className="mymelody-nav-item"
                onClick={() => simulateRemote('up')}
              >
                <Laptop size={15} />
                <span>Connect Laptop</span>
              </button>
              <button className="mymelody-nav-item">
                <Settings size={15} />
                <span>Settings</span>
              </button>
            </nav>

            <div className="mymelody-footer">
              <CuteRibbon size={32} />
              <div className="mymelody-footer-quote">
                Small steps<br />to a happier day 💕
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="mymelody-main">
            {/* Top Bar Header */}
            <header className="mymelody-header">
              <div className="mymelody-status-right">
                <Wifi size={16} className="mymelody-header-icon" />
                <div className="mymelody-clock-wrap">
                  <div className="mymelody-clock">{timeStr}</div>
                  <div className="mymelody-date">{dateStr}</div>
                </div>
                <Settings size={16} className="mymelody-header-icon" />
              </div>
            </header>

            {/* Top Hero Section: Connect Card + My Melody Art */}
            <div className="mymelody-hero-row">
              {/* Connect Laptop Card */}
              <div
                className={`mymelody-connect-card ${
                  previewFocusIndex === 0 ? 'focused' : ''
                }`}
                style={{
                  background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentSecondary})`,
                  borderRadius: theme.cardRadius,
                }}
              >
                {/* Optional Cute Ribbon Badge Pin on Card */}
                {theme.showRibbonBadge && (
                  <img
                    src="/themes/stickers/sticker-ribbon.png"
                    alt="Ribbon Badge"
                    className="mymelody-card-ribbon-badge"
                  />
                )}
                <div className="mymelody-connect-iconbox">
                  <Monitor size={28} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <div className="mymelody-connect-details">
                  <div className="mymelody-connect-title">{connectLaptop.label || 'Connect Laptop'}</div>
                  <div className="mymelody-connect-subtitle">
                    {connectLaptop.subtitle || 'Wireless Screen Sharing'}
                  </div>
                  <div className="mymelody-connect-status-pill">
                    <span className="mymelody-status-dot ready" />
                    <span>Ready to connect</span>
                  </div>
                </div>
                <div className="mymelody-connect-arrow">
                  <ChevronRight size={18} color="#E5829C" strokeWidth={3} />
                </div>
              </div>

              {/* My Melody Character Mascot Art & Mixed Stickers */}
              <div className={`mymelody-mascot-container composition-${theme.stickerComposition || 'cluster'}`}>
                {theme.showFloralDeco && (
                  <img
                    src="/themes/stickers/sticker-flowers.png"
                    alt="Floral Bouquet"
                    className="mymelody-corner-flowers"
                  />
                )}
                <div className="mymelody-floating-heart h1">♥</div>
                <div className="mymelody-floating-heart h2">♥</div>
                <div className="mymelody-floating-heart h3">♥</div>
                <div className="mymelody-script-title">My Melody 💕</div>

                <div className="mymelody-sticker-cluster-wrap">
                  {/* Main Character Mascot */}
                  <img
                    src={`/themes/stickers/sticker-${theme.stickerIndex || 13}.png`}
                    alt="My Melody Mascot"
                    className="mymelody-sticker-mascot-img"
                  />

                  {/* Secondary / Mixed Decorative Accent */}
                  {theme.secondarySticker && theme.secondarySticker !== 'none' && (
                    <img
                      src={`/themes/stickers/sticker-${theme.secondarySticker}.png`}
                      alt="Decorative Sticker"
                      className={`mymelody-sticker-secondary-img type-${theme.secondarySticker}`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Favorite Apps Section */}
            {visibleSections.some((s) => s.type === 'favorites') && (
              <div className="mymelody-section">
                <div className="mymelody-section-title">Favorite Apps</div>
                <div className="mymelody-apps-row">
                  {visibleApps.map((app, idx) => {
                    const focusIdx = idx + 1;
                    const isFocused = previewFocusIndex === focusIdx;
                    return (
                      <div
                        key={app.id}
                        className={`mymelody-app-card ${isFocused ? 'focused' : ''}`}
                        style={{
                          borderRadius: theme.cardRadius * 0.8,
                          boxShadow: isFocused
                            ? '0 8px 24px rgba(238, 152, 174, 0.5)'
                            : '0 4px 14px rgba(220, 160, 180, 0.16)',
                        }}
                      >
                        <div className="mymelody-app-icon-wrap">
                          {getAppLogo(app)}
                        </div>
                        <div className="mymelody-app-name">{app.displayName}</div>
                      </div>
                    );
                  })}

                  {/* Add App Button */}
                  <div
                    className={`mymelody-app-card add-app ${
                      previewFocusIndex === visibleApps.length + 1 ? 'focused' : ''
                    }`}
                    style={{
                      borderRadius: theme.cardRadius * 0.8,
                    }}
                  >
                    <div className="mymelody-add-icon">
                      <Plus size={22} color="#D8728D" />
                    </div>
                    <div className="mymelody-app-name" style={{ color: '#B07485' }}>
                      Add App
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Settings Section */}
            {visibleSections.some((s) => s.type === 'quickSettings') && (
              <div className="mymelody-section">
                <div className="mymelody-section-title">Quick Settings</div>
                <div className="mymelody-quick-row">
                  <div className="mymelody-quick-card">
                    <Wifi size={16} color="#834055" />
                    <div className="mymelody-quick-title">Network</div>
                    <div className="mymelody-quick-sub">Connected</div>
                  </div>

                  <div className="mymelody-quick-card">
                    <Monitor size={16} color="#834055" />
                    <div className="mymelody-quick-title">Display</div>
                    <div className="mymelody-quick-sub">Picture & Sound</div>
                  </div>

                  <div className="mymelody-quick-card active-theme">
                    <Palette size={16} color="#DE728E" />
                    <div className="mymelody-quick-title" style={{ color: '#DE728E' }}>
                      Theme
                    </div>
                    <div className="mymelody-quick-sub" style={{ color: '#E5829C' }}>
                      My Melody
                    </div>
                  </div>

                  <div className="mymelody-quick-card">
                    <RotateCcw size={16} color="#834055" />
                    <div className="mymelody-quick-title">Restart Launcher</div>
                    <div className="mymelody-quick-sub">Refresh</div>
                  </div>

                  <div className="mymelody-quick-card">
                    <Info size={16} color="#834055" />
                    <div className="mymelody-quick-title">About</div>
                    <div className="mymelody-quick-sub">Version 1.0.0</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback to standard Leanback TV preview layout for dark OLED themes
  return (
    <div
      className="tv-preview-frame standard-theme"
      style={{
        background: theme.backgroundColor,
        fontSize: `${11 * (theme.fontScale || 1)}px`,
        color: theme.textColor,
      }}
    >
      <div className="tv-screen">
        {/* Header Section */}
        {visibleSections.some((s) => s.type === 'header') && (
          <div className="tv-header">
            <div className="tv-header-left">
              <div
                className="tv-logo"
                style={{
                  background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.accentSecondary})`,
                }}
              >
                N
              </div>
              <div>
                <div className="tv-brand-name">NOVA TV</div>
                <div className="tv-date" style={{ color: theme.textMuted }}>
                  {dateStr}
                </div>
              </div>
            </div>
            <div className="tv-header-right">
              <div
                className="tv-header-pill"
                style={{
                  background: `${theme.surfaceColor}cc`,
                  borderRadius: theme.cardRadius * 0.6,
                }}
              >
                <Clock size={10} style={{ color: theme.textMuted }} />
                <span>{timeStr}</span>
              </div>
              <div
                className="tv-header-pill"
                style={{
                  background: `${theme.surfaceColor}cc`,
                  borderRadius: theme.cardRadius * 0.6,
                }}
              >
                <Wifi size={10} style={{ color: theme.accentSecondary }} />
                <span>Wi-Fi</span>
              </div>
              <div
                className="tv-header-pill"
                style={{
                  background: `${theme.surfaceColor}cc`,
                  borderRadius: theme.cardRadius * 0.6,
                }}
              >
                <Settings size={10} style={{ color: theme.textMuted }} />
              </div>
            </div>
          </div>
        )}

        {/* Connect Laptop Section */}
        {visibleSections.some((s) => s.type === 'connect') && (
          <div
            className={`tv-connect-card ${previewFocusIndex === 0 ? 'focused' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${theme.surfaceColor}, ${theme.surfaceColor}dd)`,
              borderRadius: theme.cardRadius,
              borderColor: previewFocusIndex === 0 ? theme.accentColor : 'transparent',
            }}
          >
            <div
              className="tv-connect-icon"
              style={{
                background: `linear-gradient(135deg, ${theme.accentColor}33, ${theme.accentSecondary}33)`,
                borderRadius: theme.cardRadius * 0.6,
              }}
            >
              <Monitor size={20} style={{ color: theme.accentSecondary }} />
            </div>
            <div className="tv-connect-info">
              <div className="tv-connect-title">{connectLaptop.label}</div>
              <div className="tv-connect-subtitle" style={{ color: theme.textMuted }}>
                {connectLaptop.subtitle}
              </div>
            </div>
            <div className="tv-connect-status">
              <div className="tv-status-dot ready" />
              <span style={{ fontSize: 8, color: theme.textMuted }}>พร้อม</span>
            </div>
            <ChevronRight size={14} style={{ color: theme.textMuted }} />
          </div>
        )}

        {/* Favorite Apps Section */}
        {visibleSections.some((s) => s.type === 'favorites') && (
          <div className="tv-apps-section">
            <div className="tv-section-title" style={{ color: theme.textMuted }}>
              แอปโปรด
            </div>
            <div className="tv-apps-grid" style={{ gap: theme.spacing * 0.4 }}>
              {visibleApps.map((app, idx) => {
                const focusIdx = idx + 1;
                const isFocused = previewFocusIndex === focusIdx;
                return (
                  <div
                    key={app.id}
                    className={`tv-app-card ${isFocused ? 'focused' : ''}`}
                    style={{
                      width: 90,
                      height: 60,
                      background: isFocused
                        ? `linear-gradient(135deg, ${theme.accentColor}25, ${theme.accentSecondary}15)`
                        : theme.surfaceColor,
                      borderRadius: theme.cardRadius * 0.6,
                      borderColor: isFocused ? theme.accentColor : 'transparent',
                    }}
                  >
                    <div>{getAppLogo(app)}</div>
                    <div
                      className="tv-app-label"
                      style={{
                        fontSize: 9,
                        color: isFocused ? theme.textColor : theme.textMuted,
                      }}
                    >
                      {app.displayName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Settings */}
        {visibleSections.some((s) => s.type === 'quickSettings') && (
          <div className="tv-quick-settings">
            <div className="tv-section-title" style={{ color: theme.textMuted }}>
              การตั้งค่าด่วน
            </div>
            <div className="tv-quick-grid" style={{ gap: theme.spacing * 0.3 }}>
              {['เครือข่าย', 'จอแสดงผล', 'เสียง', 'รีสตาร์ท', 'เกี่ยวกับ'].map((label) => (
                <div
                  key={label}
                  className="tv-quick-item"
                  style={{
                    background: `${theme.surfaceColor}aa`,
                    borderRadius: theme.cardRadius * 0.5,
                  }}
                >
                  <Settings size={8} style={{ color: theme.textMuted }} />
                  <span style={{ fontSize: 7, color: theme.textMuted }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
