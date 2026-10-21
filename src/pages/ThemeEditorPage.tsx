import { useEditorStore } from '../store/editor';
import { TVPreview } from '../components/TVPreview';

export function ThemeEditorPage() {
  const { config, updateTheme, savedThemes, loadTheme } = useEditorStore();
  const { theme } = config;

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">ตัวแก้ไขธีม</h2>
        <p className="page-subtitle">ปรับแต่งสี ฟอนต์ ระยะห่าง และรูปแบบการ์ดของหน้าจอ TV</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
        {/* Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Preset Themes */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">เลือกธีมสำเร็จรูป</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {savedThemes.map((t) => {
                const isSelected = theme.name === t.name;
                return (
                  <button
                    key={t.name}
                    className="btn btn-secondary"
                    onClick={() => loadTheme(t.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      background: isSelected ? 'var(--accent-glow)' : 'var(--bg-surface)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: t.accentColor,
                          border: '1px solid rgba(255,255,255,0.2)',
                          boxShadow: isSelected ? '0 0 8px var(--accent)' : 'none',
                        }}
                      />
                      <span style={{ fontWeight: isSelected ? 600 : 400 }}>{t.name}</span>
                    </div>
                    {t.name === 'My Melody' && <span style={{ fontSize: 11 }}>🌸 ธีมตามรูป</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticker & Deco Mixer Studio for My Melody */}
          {theme.name === 'My Melody' && (
            <div className="card" style={{ border: '1.5px solid #EE98AE', background: 'rgba(254, 242, 245, 0.5)' }}>
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ color: '#DE728E', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🌸 สตูดิโอสติกเกอร์ & ของตกแต่งผสม
                  </div>
                  <div className="card-subtitle">
                    เลือกสติกเกอร์ตัวละครหลัก ผสมกับโบว์ริบบิ้นและดอกไม้ตกแต่งบนหน้าจอ TV
                  </div>
                </div>
              </div>

              {/* 1. Main Character Pose Selector (1-13) */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#5C3A4D', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>1. ท่าทางตัวละครหลัก (13 ท่า)</span>
                  <span style={{ fontSize: 11, color: '#DE728E' }}>
                    {theme.stickerIndex === 13 ? '✨ ท่านั่งคู่หนู Flat (ตามรูป)' : `ท่าที่ #${theme.stickerIndex || 13}`}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                  }}
                >
                  {Array.from({ length: 13 }, (_, i) => i + 1).map((idx) => {
                    const isCurrent = (theme.stickerIndex || 13) === idx;
                    const isNewPose = idx === 13;
                    return (
                      <button
                        key={idx}
                        onClick={() => updateTheme({ stickerIndex: idx })}
                        style={{
                          padding: 6,
                          background: isCurrent ? 'rgba(238, 152, 174, 0.3)' : 'var(--bg-surface)',
                          border: isCurrent ? '2px solid #DE728E' : isNewPose ? '1.5px dashed #EE98AE' : '1px solid var(--border)',
                          borderRadius: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          transition: 'all 150ms ease',
                          transform: isCurrent ? 'scale(1.04)' : 'none',
                        }}
                        title={isNewPose ? 'ใหม่! ท่านั่งคู่หนู Flat (ตามรูป)' : `สติกเกอร์ท่าที่ ${idx}`}
                      >
                        {isNewPose && (
                          <span
                            style={{
                              position: 'absolute',
                              top: -4,
                              right: -4,
                              background: '#DE728E',
                              color: '#FFF',
                              fontSize: 7.5,
                              fontWeight: 700,
                              padding: '1px 4px',
                              borderRadius: 6,
                            }}
                          >
                            ใหม่
                          </span>
                        )}
                        <img
                          src={`/themes/stickers/sticker-${idx}.png`}
                          alt={`Sticker ${idx}`}
                          style={{
                            width: '100%',
                            height: 48,
                            objectFit: 'contain',
                          }}
                        />
                        <span
                          style={{
                            fontSize: 9,
                            marginTop: 2,
                            color: isCurrent ? '#DE728E' : 'var(--text-dim)',
                            fontWeight: isCurrent ? 700 : 400,
                          }}
                        >
                          {isNewPose ? '★ #13' : `#${idx}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Secondary / Decorative Sticker Selector */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#5C3A4D', marginBottom: 8 }}>
                  2. เลือกของตกแต่งมาใส่ผสมรวมกัน
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                  {[
                    { id: 'deco-set', label: '🌸 ชุดตกแต่งรวม', desc: 'โบว์ + ดอกไม้ + หัวใจ', file: 'sticker-deco-set.png' },
                    { id: 'ribbon', label: '🎀 โบว์ริบบิ้นชมพู', desc: 'โบว์หวานๆ ลอยประดับ', file: 'sticker-ribbon.png' },
                    { id: 'flowers', label: '🌷 ช่อดอกทิวลิป', desc: 'ดอกไม้สีพาสเทล', file: 'sticker-flowers.png' },
                    { id: 'none', label: '❌ ไม่ใส่ของตกแต่ง', desc: 'แสดงเฉพาะตัวละคร', file: null },
                  ].map((deco) => {
                    const isSelected = (theme.secondarySticker || 'deco-set') === deco.id;
                    return (
                      <button
                        key={deco.id}
                        onClick={() => updateTheme({ secondarySticker: deco.id })}
                        style={{
                          padding: '8px 10px',
                          background: isSelected ? 'rgba(238, 152, 174, 0.28)' : 'var(--bg-surface)',
                          border: isSelected ? '2px solid #DE728E' : '1px solid var(--border)',
                          borderRadius: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          textAlign: 'left',
                          transition: 'all 150ms ease',
                        }}
                      >
                        {deco.file ? (
                          <img
                            src={`/themes/stickers/${deco.file}`}
                            alt={deco.label}
                            style={{ width: 34, height: 34, objectFit: 'contain' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 16,
                              background: 'rgba(0,0,0,0.04)',
                              borderRadius: 8,
                            }}
                          >
                            ✖
                          </div>
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: isSelected ? '#DE728E' : 'inherit' }}>
                            {deco.label}
                          </div>
                          <div style={{ fontSize: 9.5, color: 'var(--text-dim)' }}>
                            {deco.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Composition Mode */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#5C3A4D', marginBottom: 8 }}>
                  3. รูปแบบการจัดวางผสม (Composition Style)
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { id: 'cluster', label: '🌟 รวมคลัสเตอร์' },
                    { id: 'duo', label: '👭 เคียงคู่กัน' },
                    { id: 'single', label: '👤 สติกเกอร์เดี่ยว' },
                  ].map((comp) => {
                    const isSelected = (theme.stickerComposition || 'cluster') === comp.id;
                    return (
                      <button
                        key={comp.id}
                        onClick={() => updateTheme({ stickerComposition: comp.id as 'cluster' | 'duo' | 'single' })}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                        style={{
                          flex: 1,
                          fontSize: 11,
                          padding: '6px 8px',
                          background: isSelected ? '#DE728E' : undefined,
                          borderColor: isSelected ? '#DE728E' : undefined,
                        }}
                      >
                        {comp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Extra Sweet Accents Toggles */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#5C3A4D', marginBottom: 8 }}>
                  4. เครื่องประดับเพิ่มเติมบนการ์ดและหน้าจอ
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface)',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                      🎀 ติดโบว์ริบบิ้นที่มุมการ์ด Connect Laptop
                    </span>
                    <input
                      type="checkbox"
                      checked={theme.showRibbonBadge !== false}
                      onChange={(e) => updateTheme({ showRibbonBadge: e.target.checked })}
                    />
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--bg-surface)',
                      padding: '8px 12px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                      🌷 ช่อดอกทิวลิปประดับมุมล่าง
                    </span>
                    <input
                      type="checkbox"
                      checked={theme.showFloralDeco !== false}
                      onChange={(e) => updateTheme({ showFloralDeco: e.target.checked })}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Colors */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">สีธีม</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <ColorControl
                label="พื้นหลัง"
                value={theme.backgroundColor}
                onChange={(v) => updateTheme({ backgroundColor: v })}
              />
              <ColorControl
                label="พื้นผิว"
                value={theme.surfaceColor}
                onChange={(v) => updateTheme({ surfaceColor: v })}
              />
              <ColorControl
                label="สีหลัก"
                value={theme.accentColor}
                onChange={(v) => updateTheme({ accentColor: v })}
              />
              <ColorControl
                label="สีรอง"
                value={theme.accentSecondary}
                onChange={(v) => updateTheme({ accentSecondary: v })}
              />
              <ColorControl
                label="ตัวอักษร"
                value={theme.textColor}
                onChange={(v) => updateTheme({ textColor: v })}
              />
              <ColorControl
                label="ตัวอักษรรอง"
                value={theme.textMuted}
                onChange={(v) => updateTheme({ textMuted: v })}
              />
            </div>
          </div>

          {/* Typography & Spacing */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">ตัวอักษรและระยะห่าง</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <RangeControl
                label="ขนาดฟอนต์"
                value={theme.fontScale}
                min={0.8}
                max={1.5}
                step={0.05}
                unit="x"
                onChange={(v) => updateTheme({ fontScale: v })}
              />
              <RangeControl
                label="ระยะห่าง"
                value={theme.spacing}
                min={4}
                max={32}
                step={2}
                unit="px"
                onChange={(v) => updateTheme({ spacing: v })}
              />
              <RangeControl
                label="มุมโค้งการ์ด"
                value={theme.cardRadius}
                min={0}
                max={32}
                step={2}
                unit="px"
                onChange={(v) => updateTheme({ cardRadius: v })}
              />
            </div>
          </div>

          {/* Card Size */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">ขนาดการ์ด</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  className={`btn ${theme.cardSize === size ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                  onClick={() => updateTheme({ cardSize: size })}
                >
                  {size === 'small' ? 'เล็ก' : size === 'medium' ? 'กลาง' : 'ใหญ่'}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Name */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">ชื่อธีม</div>
            </div>
            <input
              type="text"
              className="form-input"
              value={theme.name}
              onChange={(e) => updateTheme({ name: e.target.value })}
              placeholder="ชื่อธีม..."
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Live Preview */}
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
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              ตัวอย่างสดหน้าจอ TV · 720p
            </div>
            <TVPreview />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorControl({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="color-input-group">
        <div className="color-swatch">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <input
          type="text"
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, fontFamily: 'monospace', fontSize: 12 }}
        />
      </div>
    </div>
  );
}

function RangeControl({ label, value, min, max, step, unit, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="form-label">{label}</label>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--accent)',
          fontFamily: 'monospace',
        }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        className="form-range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}
