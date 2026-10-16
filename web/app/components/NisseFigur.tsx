import './nisse.css'

/** En liten nisse som står med føttene nederst i midten av viewBoxen. Se `nisse.css` for animasjonene. */
export const NisseFigur = () => (
  <svg viewBox="0 0 40 52" width="100%" height="100%" aria-hidden="true" className="overflow-visible">
    {/* Bein */}
    <g className="nisse-bein-venstre">
      <rect x="13" y="40" width="5" height="9" fill="#164125" />
      <rect x="11" y="47" width="8" height="5" rx="2" fill="#1f1f1f" />
    </g>
    <g className="nisse-bein-hoyre">
      <rect x="22" y="40" width="5" height="9" fill="#164125" />
      <rect x="21" y="47" width="8" height="5" rx="2" fill="#1f1f1f" />
    </g>
    {/* Kropp og belte */}
    <rect x="10" y="28" width="20" height="14" rx="5" fill="#d0332e" />
    <rect x="10" y="35" width="20" height="3" fill="#1f1f1f" />
    <rect x="18" y="34.5" width="4" height="4" fill="#e0c190" />
    {/* Armer */}
    <g className="nisse-armer">
      <rect x="5" y="29" width="6" height="10" rx="3" fill="#a7060e" />
      <rect x="29" y="29" width="6" height="10" rx="3" fill="#a7060e" />
    </g>
    {/* Hode og skjegg */}
    <circle cx="20" cy="21" r="8" fill="#f5c9a8" />
    <path d="M12 21 Q12 32 20 32 Q28 32 28 21 Q24 25 20 25 Q16 25 12 21Z" fill="#f7f3ee" />
    <circle cx="17" cy="20" r="1.2" fill="#1f1f1f" />
    <circle cx="24" cy="20" r="1.2" fill="#1f1f1f" />
    <circle cx="21" cy="22.5" r="1.6" fill="#ed7e87" />
    {/* Lue */}
    <path d="M11 16 Q16 2 32 4 Q24 8 29 16Z" fill="#d0332e" />
    <rect x="10" y="14" width="20" height="4" rx="2" fill="#f7f3ee" />
    <circle cx="32" cy="4" r="3" fill="#f7f3ee" />
  </svg>
)
