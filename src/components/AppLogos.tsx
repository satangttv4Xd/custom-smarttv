export function YouTubeLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 68 48" fill="none">
      <path
        d="M66.52 7.74C65.74 4.8 63.46 2.5 60.54 1.72C55.26 0.3 34 0.3 34 0.3C34 0.3 12.74 0.3 7.46 1.72C4.54 2.5 2.26 4.8 1.48 7.74C0.06 13.06 0 24.15 0 24.15C0 24.15 0.06 35.24 1.48 40.56C2.26 43.5 4.54 45.8 7.46 46.58C12.74 48 34 48 34 48C34 48 55.26 48 60.54 46.58C63.46 45.8 65.74 43.5 66.52 40.56C67.94 35.24 68 24.15 68 24.15C68 24.15 67.94 13.06 66.52 7.74Z"
        fill="#FF0000"
      />
      <path d="M45 24.15L27 13.8V34.5L45 24.15Z" fill="white" />
    </svg>
  );
}

export function NetflixLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#000000',
        borderRadius: size * 0.22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      <svg width={size * 0.55} height={size * 0.75} viewBox="0 0 38 68" fill="none">
        <path d="M0 0H11V68H0V0Z" fill="#E50914" />
        <path d="M27 0H38V68H27V0Z" fill="#E50914" />
        <path d="M0 0L28 68H38L10 0H0Z" fill="#B81D24" />
        <path d="M10 0L38 68H27L0 2.5V0H10Z" fill="#E50914" />
      </svg>
    </div>
  );
}

export function PrimeVideoLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #00A8E1, #007EB9)',
        borderRadius: size * 0.22,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 800,
        fontSize: size * 0.28,
        lineHeight: 1,
        fontFamily: 'sans-serif',
        boxShadow: '0 2px 6px rgba(0, 168, 225, 0.3)',
      }}
    >
      <div style={{ fontSize: size * 0.24, letterSpacing: -0.5 }}>prime</div>
      <div style={{ fontSize: size * 0.22, marginTop: -1 }}>video</div>
      <svg width={size * 0.6} height={size * 0.16} viewBox="0 0 30 8" fill="none" style={{ marginTop: 1 }}>
        <path
          d="M1 5.5C8 9 22 9 29 2"
          stroke="#FF9900"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M27 2L29 2L29 4" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function DisneyLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #091338, #113CCF)',
        borderRadius: size * 0.22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 800,
        fontSize: size * 0.36,
        fontFamily: 'serif',
        boxShadow: '0 2px 6px rgba(17, 60, 207, 0.3)',
      }}
    >
      <span style={{ fontStyle: 'italic', marginRight: -2 }}>Disney</span>
      <span style={{ color: '#56E6F5', fontSize: size * 0.45, fontWeight: 300, marginLeft: 1 }}>+</span>
    </div>
  );
}

export function SpotifyLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#1ED760',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(30, 215, 96, 0.3)',
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="#000000">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    </div>
  );
}

export function PlayStoreLogo({ size = 28 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#FFFFFF',
        borderRadius: size * 0.22,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24">
        <path d="M3.609 1.814L13.792 12 3.61 22.186A2.43 2.43 0 0 1 3 20.485V3.515c0-.687.228-1.307.609-1.701z" fill="#00C1A6" />
        <path d="M17.556 8.235L13.792 12 3.609 1.814a2.27 2.27 0 0 1 1.701-.064l12.246 6.485z" fill="#FFD400" />
        <path d="M17.556 15.765l-12.246 6.485a2.27 2.27 0 0 1-1.701-.064L13.792 12l3.764 3.765z" fill="#FF334B" />
        <path d="M21.572 10.334l-4.016-2.099L13.792 12l3.764 3.765 4.016-2.099a1.92 1.92 0 0 0 0-3.332z" fill="#00A2FF" />
      </svg>
    </div>
  );
}

export function MyMelodyBunnyFace({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Left Ear */}
      <ellipse cx="28" cy="28" rx="14" ry="26" fill="#F497B0" transform="rotate(-15 28 28)" />
      <ellipse cx="28" cy="28" rx="8" ry="18" fill="#FCD7E2" transform="rotate(-15 28 28)" />
      {/* Right Ear */}
      <ellipse cx="72" cy="28" rx="14" ry="26" fill="#F497B0" transform="rotate(15 72 28)" />
      <ellipse cx="72" cy="28" rx="8" ry="18" fill="#FCD7E2" transform="rotate(15 72 28)" />
      {/* Hood Head */}
      <circle cx="50" cy="62" r="34" fill="#F497B0" />
      {/* White Face */}
      <ellipse cx="50" cy="68" rx="24" ry="19" fill="#FFFFFF" />
      {/* Eyes */}
      <ellipse cx="40" cy="67" rx="3.5" ry="4.5" fill="#4A2E3D" />
      <ellipse cx="60" cy="67" rx="3.5" ry="4.5" fill="#4A2E3D" />
      {/* Yellow Nose */}
      <ellipse cx="50" cy="72" rx="3.5" ry="2.5" fill="#FBBF24" />
      {/* Smile */}
      <path d="M46 75.5 Q50 78.5 54 75.5" stroke="#4A2E3D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Flower on Left Ear */}
      <g transform="translate(32, 40)">
        <circle cx="0" cy="-6" r="4.5" fill="#FFFFFF" />
        <circle cx="6" cy="-2" r="4.5" fill="#FFFFFF" />
        <circle cx="4" cy="5" r="4.5" fill="#FFFFFF" />
        <circle cx="-4" cy="5" r="4.5" fill="#FFFFFF" />
        <circle cx="-6" cy="-2" r="4.5" fill="#FFFFFF" />
        <circle cx="0" cy="0" r="3.5" fill="#FBBF24" />
      </g>
    </svg>
  );
}

export function CuteRibbon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 60 40" fill="none">
      {/* Left loop */}
      <path d="M30 20 C18 6 4 10 6 22 C8 32 24 24 30 20 Z" fill="#F497B0" stroke="#E27B97" strokeWidth="1.5" />
      {/* Right loop */}
      <path d="M30 20 C42 6 56 10 54 22 C52 32 36 24 30 20 Z" fill="#F497B0" stroke="#E27B97" strokeWidth="1.5" />
      {/* Knot Center */}
      <ellipse cx="30" cy="20" rx="6" ry="5.5" fill="#F8B4C6" stroke="#E27B97" strokeWidth="1.5" />
      {/* Left tail */}
      <path d="M27 24 C22 34 16 38 12 36 C16 32 20 28 26 23" fill="#F497B0" stroke="#E27B97" strokeWidth="1.2" />
      {/* Right tail */}
      <path d="M33 24 C38 34 44 38 48 36 C44 32 40 28 34 23" fill="#F497B0" stroke="#E27B97" strokeWidth="1.2" />
    </svg>
  );
}
