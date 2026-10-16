// Snøkanonen brukes både i web-appen og i Studioet, så modulen har ingen avhengigheter.

const SNOWFLAKES_PER_CANNON = 60
const GRAVITY = 1400
const MAX_DURATION_MS = 4000

type Snowflake = { element: HTMLSpanElement; x: number; y: number; vx: number; vy: number; spin: number; angle: number }

/** Fyrer av to kanoner med snøkrystaller fra hjørnene nederst på skjermen */
export const fireSnowCannon = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const container = document.createElement('div')
  container.setAttribute('aria-hidden', 'true')
  Object.assign(container.style, { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '999999' })
  document.body.appendChild(container)

  const { innerWidth: width, innerHeight: height } = window
  const snowflakes: Snowflake[] = []
  for (const side of [-1, 1]) {
    for (let i = 0; i < SNOWFLAKES_PER_CANNON; i++) {
      // Venstre kanon sikter opp mot høyre, høyre kanon opp mot venstre
      const angle = ((35 + Math.random() * 40) * Math.PI) / 180
      const speed = (1.1 + Math.random() * 0.8) * height
      const element = document.createElement('span')
      element.textContent = '❄️'
      element.style.position = 'absolute'
      element.style.fontSize = `${16 + Math.random() * 22}px`
      container.appendChild(element)
      snowflakes.push({
        element,
        x: side === -1 ? 0 : width,
        y: height,
        vx: -side * Math.cos(angle) * speed,
        vy: -Math.sin(angle) * speed,
        spin: (Math.random() - 0.5) * 720,
        angle: 0,
      })
    }
  }

  const start = performance.now()
  let previous = start
  const tick = (now: number) => {
    const dt = Math.min((now - previous) / 1000, 0.05)
    previous = now
    const elapsed = now - start
    for (const snowflake of snowflakes) {
      snowflake.vy += GRAVITY * dt
      // Luftmotstand, så krystallene daler mer enn de faller
      snowflake.vx *= 1 - 0.5 * dt
      snowflake.vy = Math.min(snowflake.vy, 260)
      snowflake.x += snowflake.vx * dt
      snowflake.y += snowflake.vy * dt
      snowflake.angle += snowflake.spin * dt
      snowflake.element.style.transform = `translate(${snowflake.x}px, ${snowflake.y}px) rotate(${snowflake.angle}deg)`
      snowflake.element.style.opacity = String(
        Math.max(0, 1 - Math.max(0, elapsed - MAX_DURATION_MS * 0.6) / (MAX_DURATION_MS * 0.4))
      )
    }
    if (elapsed < MAX_DURATION_MS) {
      requestAnimationFrame(tick)
    } else {
      container.remove()
    }
  }
  requestAnimationFrame(tick)
}
