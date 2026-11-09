import Link from 'next/link'

export function LogoEmblem({ className = 'size-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDF3D6" />
          <stop offset="30%" stopColor="#DFBA67" />
          <stop offset="70%" stopColor="#C6993B" />
          <stop offset="100%" stopColor="#8F681B" />
        </linearGradient>
      </defs>

      {/* Luxury Squircle Frame */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="22"
        fill="#141210"
        stroke="url(#logoGold)"
        strokeWidth="1.8"
      />

      {/* Saddle Stitch Rim */}
      <rect
        x="11"
        y="11"
        width="78"
        height="78"
        rx="18"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="0.8"
        strokeDasharray="2.5 2"
        strokeOpacity="0.55"
      />

      {/* Top Diamond Star */}
      <polygon
        points="50,20 52,24 56,26 52,28 50,32 48,28 44,26 48,24"
        fill="url(#logoGold)"
      />

      {/* Grand Serif Monogram "L" */}
      <path
        d="M38 36
           H52
           V39.5
           H47.5
           C45.5 39.5 45 40 45 43
           V68
           C45 70.5 45.5 71 48 71
           H61
           C66 71 68 69.5 69 65.5
           H71.5
           L70 74
           H36
           V71
           H39.5
           C41.5 71 42 70.5 42 68
           V43
           C42 40 41.5 39.5 39.5 39.5
           H38
           Z"
        fill="url(#logoGold)"
      />

      {/* Intersecting Artisan Stroke */}
      <path
        d="M54 48
           L71 65
           C72.5 66.5 74 67 75.5 67
           V64.5
           L59 48
           Z"
        fill="url(#logoGold)"
        opacity="0.8"
      />

      {/* Bottom Artisan Accent */}
      <line
        x1="38"
        y1="82"
        x2="47"
        y2="82"
        stroke="url(#logoGold)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <circle cx="50" cy="82" r="1.2" fill="url(#logoGold)" />
      <line
        x1="53"
        y1="82"
        x2="62"
        y2="82"
        stroke="url(#logoGold)"
        strokeWidth="0.8"
        opacity="0.5"
      />
    </svg>
  )
}

export function Logo({
  href = '/',
  showEmblem = true,
  className = '',
  onClick,
}: {
  href?: string
  showEmblem?: boolean
  className?: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 leading-none transition-transform hover:scale-[1.01] ${className}`}
    >
      {showEmblem && (
        <LogoEmblem className="size-8 transition-transform duration-300 group-hover:rotate-[3deg] md:size-9" />
      )}
      <div className="flex flex-col">
        <span className="font-serif text-xl font-bold tracking-[0.32em] text-foreground transition-colors group-hover:text-primary md:text-[1.45rem]">
          LEX LEATHER
        </span>
        <span className="mt-0.5 text-[0.52rem] uppercase tracking-[0.45em] text-primary/90">
          Atelier
        </span>
      </div>
    </Link>
  )
}
