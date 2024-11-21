import { getCSP, NONE, SELF, UNSAFE_EVAL, UNSAFE_INLINE } from 'csp-header'

export function generateSecurityHeaders() {
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
      ],
      'style-src': [SELF, UNSAFE_INLINE],
      'img-src': [SELF, 'data:', 'cdn.sanity.io', '*'],
      'connect-src': [SELF, 'api.sanity.io', 'plausible.io'],
      'frame-src': [SELF, '*.youtube.com', '*.codesandbox.io', 'player.vimeo.com'],
      'font-src': [SELF],
      'object-src': [NONE],
      'media-src': [SELF],
      'child-src': [SELF, '*.youtube.com'],
    },
  })
  return {
    'Content-Security-Policy': process.env.NODE_ENV === 'development' ? csp.replace(/;/g, '; report-only') : csp,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
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
      'interest-cohort=()',
    ].join(', '),
    'X-XSS-Protection': '1; mode=block',
  }
}
