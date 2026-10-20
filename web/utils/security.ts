import { getCSP, NONE, SELF, UNSAFE_EVAL, UNSAFE_INLINE } from 'csp-header'

/**
 * Verter vi tillater innebygd i iframes. Brukes både i CSP-en og av `IframeBlock`,
 * så de alltid er enige. Andre verter vises som en lenke.
 */
export const EMBED_FRAME_HOSTS = [
  '*.youtube.com',
  'www.youtube-nocookie.com',
  'codesandbox.io',
  'codepen.io',
  'player.vimeo.com',
  'embed.ted.com',
  'anchor.fm',
  '*.spotify.com',
  // Twitter/X-innbygginger rendres i en iframe fra platform.twitter.com
  'platform.twitter.com',
  'syndication.twitter.com',
]

export function isAllowedEmbedHost(hostname: string) {
  return EMBED_FRAME_HOSTS.some((host) =>
    host.startsWith('*.') ? hostname.endsWith(host.slice(1)) : hostname === host
  )
}

// Om CSP-en:
// - `unsafe-eval` trengs fordi @opengraphninja/react (lenkeforhåndsvisninger) har en
//   gammel regenerator-runtime som kaller `Function(...)`. Uten den kaster alle
//   artikkelsider en feil. Kan fjernes når den avhengigheten er byttet ut.
// - `unsafe-inline` trengs for React Router sine inline-skript. Nonce hjelper lite så
//   lenge HTML-en caches i CDN-en, siden samme nonce da gjenbrukes.
// - `img-src *` trengs fordi lenkeforhåndsvisninger viser bilder fra vilkårlige nettsteder.
// - `studio` gir Sanity Studio på /studio tilgang til API-et (inkludert websockets for
//   sanntidsoppdateringer), uten at resten av siden får det samme.
// YouTube-forhåndsvisningen i Studioet (react-youtube) laster IFrame-API-et fra youtube.com
const STUDIO_SCRIPT_HOSTS = ['www.youtube.com']

export function generateSecurityHeaders({ studio = false }: { studio?: boolean } = {}) {
  const csp = getCSP({
    directives: {
      'default-src': [SELF],
      'script-src': [
        SELF,
        UNSAFE_INLINE,
        UNSAFE_EVAL,
        '*.codepen.io',
        '*.twitter.com',
        '*.x.com',
        'cdn.syndication.twimg.com',
        'plausible.io',
        'vercel.live',
        '*.vercel-scripts.com',
        ...(studio ? STUDIO_SCRIPT_HOSTS : []),
      ],
      'script-src-elem': [
        SELF,
        UNSAFE_INLINE,
        UNSAFE_EVAL,
        '*.codepen.io',
        '*.twitter.com',
        '*.x.com',
        'cdn.syndication.twimg.com',
        'plausible.io',
        'vercel.live',
        '*.vercel-scripts.com',
        'cdn.jsdelivr.net',
        ...(studio ? STUDIO_SCRIPT_HOSTS : []),
      ],
      'style-src': [SELF, UNSAFE_INLINE],
      'img-src': [SELF, UNSAFE_INLINE, 'data:', 'cdn.sanity.io', '*'],
      'connect-src': [
        SELF,
        'api.sanity.io',
        'plausible.io',
        'opengraph.ninja',
        '*.algolia.net',
        'ws-us3.pusher.com',
        '*.algolia.io',
        '*.algolianet.com',
        ...(studio ? ['*.api.sanity.io', 'wss://*.api.sanity.io', '*.apicdn.sanity.io'] : []),
      ],
      'frame-src': [SELF, ...EMBED_FRAME_HOSTS, 'vercel.live'],
      'font-src': [SELF, ...(studio ? ['design-system-static.sanity.io'] : [])],
      'object-src': [NONE],
      'media-src': [SELF, 'cdn.sanity.io'],
      'child-src': [SELF, '*.youtube.com'],
      // Lar Presentation-verktøyet i /studio vise siden i en iframe, og lar Sanity sitt
      // dashboard på sanity.io vise Studioet i en iframe
      'frame-ancestors': [SELF, ...(studio ? ['https://www.sanity.io'] : [])],
    },
  })

  return {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()',
    ].join(', '),
  }
}
