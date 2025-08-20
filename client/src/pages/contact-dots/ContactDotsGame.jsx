import React, { useEffect, useRef, useState, useMemo } from "react";
import style from "./ContactDotsGame.module.scss";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { OBJECTS } from "../../data/contact-dots";

gsap.registerPlugin(Draggable);

// ---------- Вспомогательные функции ----------
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function getRandomObject(excludeId = null) {
  const pool = excludeId ? OBJECTS.filter((o) => o.id !== excludeId) : OBJECTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function polyPath(pts) {
  return pts.length ? `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")} Z` : "";
}

const MIN_SNAP = 15;
const MAX_SNAP = 20;

const ContactDotsGame = () => {
  const [current, setCurrent] = useState(getRandomObject());
  const [progress, setProgress] = useState(1);
  const [completed, setCompleted] = useState(false); // 1

  const bgPoints = useMemo(
    () => current.points.map((p) => ({ ...p })),
    [current]
  );
  const N = bgPoints.length;

  const [contactPoints, setContactPoints] = useState(() =>
    bgPoints.map((target) => {
      const angle = Math.random() * Math.PI * 0.5;
      const r = 1;
      return {
        x: target.x + Math.cos(angle) * r,
        y: target.y + Math.sin(angle) * r,
      };
    })
  );

  const [locks, setLocks] = useState(() => Array(N).fill(-1));
  const [showFill, setShowFill] = useState(false); // 2
  const [zoomed, setZoomed] = useState(true); // 3
  const isDraggingRef = useRef(false);

  const svgRef = useRef(null);
  const draggingIdxRef = useRef(-1);

  function svgClientPoint(svgEl, clientX, clientY) {
    const pt = svgEl.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const inv = svgEl.getScreenCTM().inverse();
    const sp = pt.matrixTransform(inv);
    return {
      x: clamp(sp.x, 0, current.svg_params.proportions.width),
      y: clamp(sp.y, 0, current.svg_params.proportions.height),
    };
  }

  function getTouchPoint(e) {
    if (e.touches && e.touches[0]) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  useEffect(() => {
    const nextContacts = current.points.map((target) => {
      const angle = Math.random() * Math.PI * 2;
      const r = 35 + Math.random() * 35;
      return {
        x: target.x + Math.cos(angle) * r,
        y: target.y + Math.sin(angle) * r,
      };
    });
    setContactPoints(nextContacts);
    setLocks(Array(current.points.length).fill(-1));
    setShowFill(false);
    setZoomed(true);
    draggingIdxRef.current = -1;
    isDraggingRef.current = false;
  }, [current]);

  const onPointerDown = (idx) => (e) => {
    // Предотвращаем срабатывание для правой кнопки мыши
    if (e.pointerType === "mouse" && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    draggingIdxRef.current = idx;
    isDraggingRef.current = true; // Используем ref

    // снимаем «замок» чтобы можно было перетаскивать от прилипа
    setLocks((prev) => {
      const next = [...prev];
      next[idx] = -1;
      return next;
    });

    // Обрабатываем первое перемещение сразу
    const point = getTouchPoint(e);
    if (svgRef.current) {
      const p = svgClientPoint(svgRef.current, point.clientX, point.clientY);
      handlePointMove(idx, p);
    }

    // подключаем слушатели на документ
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("touchmove", onPointerMove);
    document.addEventListener("touchend", onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;

    const idx = draggingIdxRef.current;
    if (idx < 0 || !svgRef.current) return;

    const point = getTouchPoint(e);
    const p = svgClientPoint(svgRef.current, point.clientX, point.clientY);
    handlePointMove(idx, p);
  };

  const handlePointMove = (idx, p) => {
    const SNAP_R = 10; // радиус прилипания
    let snapTo = null;

    // список занятых таргетов другими точками
    const occupied = new Set(locks.filter((t, j) => j !== idx && t >= 0));

    for (let t = 0; t < N; t++) {
      if (occupied.has(t)) continue;
      const dx = bgPoints[t].x - p.x;
      const dy = bgPoints[t].y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= SNAP_R) {
        snapTo = t;
        break;
      }
    }

    setContactPoints((prev) => {
      const next = [...prev];
      if (snapTo !== null) {
        next[idx] = { x: bgPoints[snapTo].x, y: bgPoints[snapTo].y };
      } else {
        next[idx] = { x: p.x, y: p.y };
      }
      return next;
    });

    setLocks((prev) => {
      const next = [...prev];
      next[idx] = snapTo !== null ? snapTo : -1;
      return next;
    });
  };

  const onPointerUp = (e) => {
    if (!isDraggingRef.current) return;

    const idx = draggingIdxRef.current;
    draggingIdxRef.current = -1;
    isDraggingRef.current = false;

    // Убираем все слушатели
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("touchmove", onPointerMove);
    document.removeEventListener("touchend", onPointerUp);

    if (!svgRef.current || idx < 0) return;

    const p = contactPoints[idx];

    const occupied = new Set(locks.filter((t, j) => j !== idx && t >= 0));

    let bestTarget = -1;
    let bestDist = Infinity;
    for (let t = 0; t < N; t++) {
      if (occupied.has(t)) continue;
      const dx = bgPoints[t].x - p.x;
      const dy = bgPoints[t].y - p.y;
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        bestTarget = t;
      }
    }

    if (bestTarget >= 0 && bestDist >= MIN_SNAP && bestDist <= MAX_SNAP) {
      setContactPoints((prev) => {
        const next = [...prev];
        next[idx] = { x: bgPoints[bestTarget].x, y: bgPoints[bestTarget].y };
        return next;
      });
      setLocks((prev) => {
        const next = [...prev];
        next[idx] = bestTarget;
        return next;
      });
    }

    setTimeout(checkCompletion, 0);
  };

  useEffect(() => {
    checkCompletion();
  }, [locks]);

  const checkCompletion = () => {
    const allLocked = locks.every((t) => t >= 0);
    if (!allLocked) return;

    const setSize = new Set(locks).size;
    if (setSize !== N) return;

    setShowFill(true);
    setTimeout(() => {
      setZoomed(false);
      setCompleted(true);
    }, 250);
  };

  const pathString = useMemo(() => polyPath(contactPoints), [contactPoints]);

  const { cx, cy } = useMemo(
    () => ({ cx: current.cx, cy: current.cy }),
    [current]
  );

  const total = OBJECTS.length;

  const handleNext = () => {
    const next = getRandomObject(current.id);
    setCurrent(next);
    setProgress((p) => (p < total ? p + 1 : 1));
  };

  const drawProgress = useMemo(() => {
    const arr = Array(N).fill(0);
    for (let i = 0; i < N; i++) {
      arr[i] = locks[i] >= 0 ? 1 : 0;
    }
    return arr;
  }, [locks, N]);

  return (
    <section className={style.game}>
      <div className="container">
        <div className={style.game__wrapper}>
          <div className={style.game__top}>
            <h1>ТОЧКИ КОНТАКТА</h1>
            <p>Соберите объект по точкам</p>
          </div>

          <div className={style.game__main}>
            <p>
              {progress} / {OBJECTS.length}
            </p>

            <div
              className={style.game__canvas}
              // style={{
              //   width: current.svg_params.proportions.width,
              //   height: current.svg_params.proportions.height,
              // }}
            >
              <div className={style.game__img__container}>
                <img
                  className={style.game__image}
                  src={current.img}
                  alt={`Объект ${current.id}`}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transform: zoomed ? `scale(${current.zoom})` : "scale(1)",
                  }}
                />
              </div>

              {current && current.points && (
                <svg
                  ref={svgRef}
                  className={style.svg}
                  viewBox={`0 0 ${current.svg_params.proportions.width} ${current.svg_params.proportions.height}`}
                  preserveAspectRatio="xMidYMid meet"
                  style={{
                    position: "absolute",
                    width: current.svg_params.proportions.width,
                    height: current.svg_params.proportions.height,
                    transform: `
                    translate(${
                      completed
                        ? current.svg_params.final.position.left
                        : current.svg_params.position.left
                    }px,
                               ${
                                 completed
                                   ? current.svg_params.final.position.top
                                   : current.svg_params.position.top
                               }px)
                    scale(${
                      completed
                        ? current.svg_params.final.scale
                        : current.svg_params.scale
                    })
                    rotate(${
                      completed
                        ? current.svg_params.final.rotate
                        : current.svg_params.rotate
                    }deg)
                  `,
                    transformOrigin: "center center",
                    transition: "all 0.6s ease",
                    touchAction: "none",
                  }}
                >
                  {/* Мелкие фоновые точки (цели) */}
                  {bgPoints.map((p, i) => (
                    <circle
                      key={`bg-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={2}
                      fill="#ffffff"
                      opacity="0.9"
                    />
                  ))}

                  {/* Текущая «нить» между контактными точками */}
                  <path
                    d={pathString}
                    fill="none"
                    stroke="#f4a623"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                  />

                  {/* Контактные точки (перетаскиваемые) */}
                  {contactPoints.map((p, i) => {
                    const bg = bgPoints[i];
                    const dx = bg.x - p.x;
                    const dy = bg.y - p.y;
                    const len = Math.hypot(dx, dy) || 1;
                    const dashOffset = len * (1 - (drawProgress[i] ?? 0));

                    return (
                      <g key={`c-${i}`}>
                        <line
                          x1={p.x}
                          y1={p.y}
                          x2={bg.x}
                          y2={bg.y}
                          stroke="#f4a623"
                          strokeWidth="1.2"
                          strokeDasharray={len}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          className={style.spring}
                        />
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={7}
                          fill="#f4a623"
                          stroke="#111"
                          strokeWidth="1"
                          className={style.handle}
                          onPointerDown={onPointerDown(i)}
                        />
                      </g>
                    );
                  })}

                  {/* Итоговая заливка (как в StarAnimation) */}
                  <defs>
                    <linearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="30%" stopColor="rgba(39,39,39,0)" />
                      <stop offset="200%" stopColor="rgba(175,125,44,1)" />
                    </linearGradient>
                  </defs>

                  {showFill && (
                    <path
                      d={polyPath(bgPoints)}
                      fill="url(#starGrad)"
                      stroke="none"
                      className={style.fillFadeIn}
                    />
                  )}
                </svg>
              )}
            </div>
          </div>

          <button className={style.nextBtn} onClick={handleNext}>
            Следующий объект
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactDotsGame;
