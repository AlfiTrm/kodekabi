export function MissingFileStamp() {
  return (
    <svg viewBox="0 0 250 106" role="img" aria-label="Cap file tidak ditemukan" className="h-auto w-40 sm:w-52">
      <defs>
        <mask id="worn-stamp-mask">
          <rect width="250" height="106" fill="white" />
          <path d="M9 14h31M65 8h18M101 16h42M177 9h29M218 19h20M3 89h47M73 96h36M136 88h22M185 97h54" stroke="black" strokeWidth="5" />
          <path d="M29 37h9M53 62h18M86 32h12M116 72h21M154 43h10M192 67h24M226 38h9" stroke="black" strokeWidth="3" />
          <circle cx="21" cy="69" r="3" fill="black" />
          <circle cx="146" cy="23" r="2.5" fill="black" />
          <circle cx="232" cy="76" r="4" fill="black" />
        </mask>
      </defs>
      <g mask="url(#worn-stamp-mask)" fill="none" stroke="currentColor">
        <path d="M8 9 241 5l3 91L11 101Z" strokeWidth="5" />
        <path d="M15 17 234 13l2 75L18 93Z" strokeWidth="2" />
        <path d="M18 70 237 67M18 25l218-4" strokeWidth="2" />
      </g>
      <g mask="url(#worn-stamp-mask)" fill="currentColor" fontFamily="monospace" textAnchor="middle">
        <text x="125" y="60" fontSize="25" fontWeight="900" letterSpacing="1">FILE NOT LOCATED</text>
        <text x="125" y="84" fontSize="13" fontWeight="700" letterSpacing="3">SERIAL 404</text>
      </g>
    </svg>
  );
}
