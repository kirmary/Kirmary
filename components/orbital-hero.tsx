'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import Link from 'next/link';
import { orbitalItems } from '../lib/site-content';

export function OrbitalHero({
  locale
}: {
  locale: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const rotation = useRef(0);
  const velocity = useRef(0.018);

  const drag = useRef({
    active: false,
    x: 0,
    lastX: 0,
    lastTime: 0
  });

  const pointer = useRef({
    x: 0,
    y: 0
  });

  const raf = useRef<number | null>(null);

  const [visualMode, setVisualMode] =
    useState<'glass' | 'image'>('glass');

  const [zoomed, setZoomed] = useState(false);
  const [spacing, setSpacing] = useState(1);
  const [active, setActive] = useState(0);

  const activeRef = useRef(0);

  const radius = useMemo(() => {
    return [340, 420, 500][spacing];
  }, [spacing]);

  /* =========================
     ORBIT ANIMATION
  ========================= */

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;

    if (!stage || !ring) return;

    let currentTiltX = 0;
    let currentTiltY = 0;

    const tick = () => {
      if (!drag.current.active) {
        rotation.current += velocity.current;
        velocity.current *= 0.993;

        if (Math.abs(velocity.current) < 0.012) {
          velocity.current +=
            velocity.current < 0
              ? -0.00035
              : 0.00035;
        }
      }

      const targetTiltY = pointer.current.x * 8;
      const targetTiltX = pointer.current.y * -5;

      currentTiltX +=
        (targetTiltX - currentTiltX) * 0.06;

      currentTiltY +=
        (targetTiltY - currentTiltY) * 0.06;

      ring.style.setProperty(
        '--ring-rotation',
        `${rotation.current}deg`
      );

      stage.style.setProperty(
        '--tilt-x',
        `${currentTiltX}deg`
      );

      stage.style.setProperty(
        '--tilt-y',
        `${currentTiltY}deg`
      );

      const normalized =
        ((-rotation.current % 360) + 360) % 360;

      const nextActive =
        Math.round(
          normalized /
            (360 / orbitalItems.length)
        ) % orbitalItems.length;

      if (nextActive !== activeRef.current) {
        activeRef.current = nextActive;
        setActive(nextActive);
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, []);

  /* =========================
     POINTER / DRAG EVENTS
  ========================= */

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();

      pointer.current.x =
        ((event.clientX - rect.left) /
          rect.width -
          0.5) *
        2;

      pointer.current.y =
        ((event.clientY - rect.top) /
          rect.height -
          0.5) *
        2;

      if (drag.current.active) {
        const now = performance.now();

        const dx =
          event.clientX -
          drag.current.lastX;

        const dt = Math.max(
          8,
          now - drag.current.lastTime
        );

        rotation.current += dx * 0.32;
        velocity.current = (dx / dt) * 10;

        drag.current.lastX =
          event.clientX;

        drag.current.lastTime = now;
      }
    };

    const onDown = (
      event: PointerEvent
    ) => {
      const target =
        event.target as HTMLElement;

      /*
       * لو الضغط على كارت:
       * لا نبدأ السحب، ونترك الرابط يفتح.
       */
      if (target.closest('.orbit-card')) {
        return;
      }

      drag.current = {
        active: true,
        x: event.clientX,
        lastX: event.clientX,
        lastTime: performance.now()
      };

      stage.setPointerCapture?.(
        event.pointerId
      );

      stage.classList.add(
        'is-grabbing'
      );
    };

    const onUp = (
      event: PointerEvent
    ) => {
      if (!drag.current.active) return;

      drag.current.active = false;

      if (
        stage.hasPointerCapture?.(
          event.pointerId
        )
      ) {
        stage.releasePointerCapture(
          event.pointerId
        );
      }

      stage.classList.remove(
        'is-grabbing'
      );
    };

    const onWheel = (
      event: WheelEvent
    ) => {
      const wheelValue =
        event.deltaX || event.deltaY;

      if (
        Math.abs(event.deltaX) >
          Math.abs(event.deltaY) ||
        Math.abs(event.deltaY) < 80
      ) {
        rotation.current -=
          wheelValue * 0.08;

        velocity.current =
          -wheelValue * 0.008;
      }
    };

    const onPointerLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    stage.addEventListener(
      'pointermove',
      onMove
    );

    stage.addEventListener(
      'pointerdown',
      onDown
    );

    stage.addEventListener(
      'pointerup',
      onUp
    );

    stage.addEventListener(
      'pointercancel',
      onUp
    );

    stage.addEventListener(
      'pointerleave',
      onPointerLeave
    );

    stage.addEventListener(
      'wheel',
      onWheel,
      {
        passive: true
      }
    );

    return () => {
      stage.removeEventListener(
        'pointermove',
        onMove
      );

      stage.removeEventListener(
        'pointerdown',
        onDown
      );

      stage.removeEventListener(
        'pointerup',
        onUp
      );

      stage.removeEventListener(
        'pointercancel',
        onUp
      );

      stage.removeEventListener(
        'pointerleave',
        onPointerLeave
      );

      stage.removeEventListener(
        'wheel',
        onWheel
      );
    };
  }, []);

  /* =========================
     LINK BUILDER
  ========================= */

  const getItemHref = (
    href: string
  ) => {
    // رابط داخل نفس الصفحة
    if (href.startsWith('#')) {
      return href;
    }

    // رابط خارجي
    if (
      href.startsWith('http://') ||
      href.startsWith('https://')
    ) {
      return href;
    }

    // يمنع تكرار اللغة في الرابط
    if (
      href.startsWith(`/${locale}/`) ||
      href === `/${locale}`
    ) {
      return href;
    }

    const cleanHref = href.startsWith('/')
      ? href
      : `/${href}`;

    return `/${locale}${cleanHref}`;
  };

  return (
    <section
      id="home"
      className="orbital-hero"
      aria-label="KIRMARY product universe"
    >
      <div className="orbital-nebula orbital-nebula-a" />
      <div className="orbital-nebula orbital-nebula-b" />

      <div
        className="orbital-stars"
        aria-hidden="true"
      />

      <div className="orbital-topline">
        <span>
          KIRMARY // ENGINEERING SUPPLIES
        </span>

        <span>
          CAIRO · EGYPT
        </span>
      </div>

      <div
        ref={stageRef}
        className={[
          'orbital-stage',
          `mode-${visualMode}`,
          zoomed ? 'is-zoomed' : ''
        ]
          .filter(Boolean)
          .join(' ')}
        style={
          {
            '--orbit-radius': `${radius}px`
          } as React.CSSProperties
        }
      >
        <div className="orbital-perspective">
          <div
            ref={ringRef}
            className="orbital-ring"
          >
            {orbitalItems.map(
              (item, index) => {
                const angle =
                  (360 /
                    orbitalItems.length) *
                  index;

                const itemHref =
                  getItemHref(item.href);

                const isExternal =
                  itemHref.startsWith(
                    'http://'
                  ) ||
                  itemHref.startsWith(
                    'https://'
                  );

                const cardContent = (
                  <>
                    <span className="orbit-card-index">
                      {item.index}
                    </span>

                    <span className="orbit-card-eyebrow">
                      {item.eyebrow}
                    </span>

                    <span
                      className={[
                        'orbit-card-media',
                        item.id === 'kirmary-hydrant'
                          ? 'orbit-card-media--hydrant'
                          : ''
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {item.image ? (
                        <img
                          className={
                            item.id === 'kirmary-hydrant'
                              ? 'orbit-card-hydrant-image'
                              : undefined
                          }
                          src={item.image}
                          alt={item.title}
                          draggable={false}
                        />
                      ) : (
                        <span
                          className="hydrant-mark"
                          aria-hidden="true"
                        >
                          <i />
                          <b />
                          <em />
                        </span>
                      )}
                    </span>

                    <span className="orbit-card-copy">
                      <strong>
                        {item.title}
                      </strong>

                      <small>
                        {item.subtitle}
                      </small>
                    </span>

                    <span
                      className="orbit-card-open"
                      aria-hidden="true"
                    >
                      OPEN ↗
                    </span>
                  </>
                );

                const commonProps = {
                  className: [
                    'orbit-card',
                    active === index
                      ? 'is-active'
                      : '',
                    item.id === 'kirmary-hydrant'
                      ? 'is-hydrant-card'
                      : ''
                  ]
                    .filter(Boolean)
                    .join(' '),
                  style: {
                    '--card-angle': `${angle}deg`
                  } as React.CSSProperties,
                  'aria-label': `Open ${item.title}`
                };

                if (isExternal) {
                  return (
                    <a
                      key={item.id}
                      href={itemHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...commonProps}
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={itemHref}
                    {...commonProps}
                  >
                    {cardContent}
                  </Link>
                );
              }
            )}
          </div>

          <div
            className="orbital-core"
            aria-hidden="true"
          >
            <span className="core-line core-line-one" />
            <span className="core-line core-line-two" />

            <img
              src="/brand/logos/Kirmary-white-Logo-02-copy.png"
              alt=""
            />

            <b>
              INTERNATIONAL
              <br />
              ENGINEERING SUPPLIES
            </b>
          </div>
        </div>
      </div>

    </section>
  );
}