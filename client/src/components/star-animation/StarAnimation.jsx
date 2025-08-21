import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const width = 400;
const height = 400;

const bgPoints = [
  { x: 200, y: 50 },
  { x: 240, y: 150 },
  { x: 350, y: 150 },
  { x: 260, y: 220 },
  { x: 300, y: 350 },
  { x: 200, y: 270 },
  { x: 100, y: 350 },
  { x: 140, y: 220 },
  { x: 50, y: 150 },
  { x: 160, y: 150 },
];

const starPoints = [...bgPoints];
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const StarAnimation = () => {
  const N = starPoints.length;
  const [cycleKey, setCycleKey] = useState(0);

  const initialRandom = useMemo(
    () =>
      starPoints.map((target) => {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 30 + Math.random() * 30;
        return {
          x: target.x + Math.cos(angle) * radius,
          y: target.y + Math.sin(angle) * radius,
        };
      }),
    [cycleKey]
  );

  const contactRef = useRef(initialRandom);
  const [contactPoints, setContactPointsState] = useState(initialRandom);
  const [drawProgress, setDrawProgressState] = useState(Array(N).fill(0));
  const [showContacts, setShowContacts] = useState(false);
  const [showGradient, setShowGradient] = useState(false);

  const timeoutsRef = useRef([]);
  const rafsRef = useRef([]);

  const updateContactPoints = (next) => {
    contactRef.current = next;
    setContactPointsState(next);
  };

  useEffect(() => {
    const startDelay = 2000;
    const moveDuration = 600;
    const interval = 500;

    // Показ точек
    const showTimeout = setTimeout(() => setShowContacts(true), startDelay);
    timeoutsRef.current.push(showTimeout);

    // Анимация каждой точки
    for (let i = 0; i < N; i++) {
      ((index) => {
        const tId = setTimeout(() => {
          const startPos = contactRef.current[index];
          const endPos = starPoints[index];
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const tNorm = Math.min(1, elapsed / moveDuration);
            const eased = easeOutCubic(tNorm);

            const nextPos = {
              x: lerp(startPos.x, endPos.x, eased),
              y: lerp(startPos.y, endPos.y, eased),
            };
            const nextArr = contactRef.current.map((p, j) =>
              j === index ? nextPos : p
            );
            updateContactPoints(nextArr);

            const dpNext = [...drawProgress];
            dpNext[index] = tNorm;
            setDrawProgressState(dpNext);

            if (tNorm < 1) {
              rafsRef.current[index] = requestAnimationFrame(animate);
            }
          };

          rafsRef.current[index] = requestAnimationFrame(animate);
        }, startDelay + (index + 1) * interval);
        timeoutsRef.current.push(tId);
      })(i);
    }

    // Включение градиента
    const gradientTimeout = setTimeout(
      () => setShowGradient(true),
      startDelay + N * interval + 800
    );
    timeoutsRef.current.push(gradientTimeout);

    // Перезапуск цикла
    const resetTimeout = setTimeout(() => {
      setShowContacts(false);
      setShowGradient(false);
      setDrawProgressState(Array(N).fill(0));

      const newRandom = starPoints.map((target) => {
        const angle = Math.random() * 2 * Math.PI;
        const radius = 30 + Math.random() * 30;
        return {
          x: target.x + Math.cos(angle) * radius,
          y: target.y + Math.sin(angle) * radius,
        };
      });

      // Синхронизация состояния и ref
      contactRef.current = newRandom;
      setContactPointsState(newRandom);

      setCycleKey((k) => k + 1);
    }, startDelay + N * interval + 4000);
    timeoutsRef.current.push(resetTimeout);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      rafsRef.current.forEach((id) => id && cancelAnimationFrame(id));
      timeoutsRef.current = [];
      rafsRef.current = [];
    };
  }, [cycleKey]);

  const polyPath = (pts) =>
    pts.length ? `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")} Z` : "";

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <motion.rect
        width="100%"
        height="100%"
        rx="2"
        fill="url(#grad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {bgPoints.map((p, i) => (
        <circle
          key={`bg-${i}`}
          cx={p.x}
          cy={p.y}
          r={2}
          fill="#fff"
          opacity={0.9}
        />
      ))}

      {showContacts && (
        <path
          d={polyPath(contactPoints)}
          fill="none"
          stroke="#f4a623"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.95}
          style={{ transition: "opacity 0.6s ease" }}
        />
      )}

      <AnimatePresence>
        {showContacts &&
          contactPoints.map((p, i) => {
            const bg = starPoints[i];
            const dx = bg.x - p.x;
            const dy = bg.y - p.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const offset = len * (1 - (drawProgress[i] ?? 0));

            return (
              <g key={`contact-${i}`}>
                {/* <line
                  x1={p.x}
                  y1={p.y}
                  x2={bg.x}
                  y2={bg.y}
                  stroke="#f4a623"
                  strokeWidth={2}
                  strokeDasharray={len}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dashoffset 0.4s ease-out",
                  }}
                /> */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={6}
                  fill="#f4a623"
                  stroke="#111"
                  strokeWidth={1}
                  style={{
                    opacity: showGradient ? 0 : 1,
                    transition: "opacity 0.6s ease",
                  }}
                />
              </g>
            );
          })}

        {showGradient && (
          <motion.path
            d={polyPath(starPoints)}
            fill="url(#starGrad)"
            stroke="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        )}

        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>

          <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="30%" stopColor="rgba(39, 39, 39, 0)" />
            <stop offset="200%" stopColor="rgba(175,125,44,1)" />
          </linearGradient>
        </defs>
      </AnimatePresence>
    </svg>
  );
};

export default StarAnimation;
