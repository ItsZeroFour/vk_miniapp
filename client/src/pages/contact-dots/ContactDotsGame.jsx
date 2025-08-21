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

// const MIN_SNAP = 15;
const MAX_SNAP = 20;

// Радиус "ручки" точки — держим её ПОЛНОСТЬЮ в пределах вьюпорта
const HANDLE_R = window.innerWidth <= 768 ? 15 : 10;

const ContactDotsGame = () => {
  const [current, setCurrent] = useState(getRandomObject());
  const [progress, setProgress] = useState(1);
  const [completed, setCompleted] = useState(false);

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
  const [showFill, setShowFill] = useState(false);
  const [zoomed, setZoomed] = useState(true);
  const isDraggingRef = useRef(false);

  const svgRef = useRef(null);
  const gRef = useRef(null);
  const draggingIdxRef = useRef(-1);

  // --- Геометрия: перевод координат между системами с учётом transform у <g> ---
  const getGeom = () => {
    const svg = svgRef.current;
    const g = gRef.current;
    if (!svg || !g) return null;

    const svgCTM = svg.getScreenCTM(); // SVG -> screen
    if (!svgCTM) return null;

    const ctm = g.getCTM(); // group-local -> SVG
    if (!ctm) return null;

    const invCTM = ctm.inverse(); // SVG -> group-local
    const invSvgCTM = svgCTM.inverse(); // screen -> SVG
    const vb = svg.viewBox.baseVal; // видимые границы в SVG-координатах

    return { svg, g, ctm, invCTM, invSvgCTM, vb };
  };

  // Клиентские координаты -> локальные координаты группы <g>
  const clientToLocal = (clientX, clientY) => {
    const geom = getGeom();
    if (!geom) return null;
    const { svg, invSvgCTM, invCTM } = geom;

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    // client -> SVG
    const svgPt = pt.matrixTransform(invSvgCTM);
    // SVG -> group-local
    const localPt = svgPt.matrixTransform(invCTM);
    return { x: localPt.x, y: localPt.y };
  };

  // Кламп точки: берём локальную, переводим в SVG, зажимаем в видимом прямоугольнике,
  // затем обратно в локальные координаты группы
  const clampLocalWithCTM = (local) => {
    const geom = getGeom();
    if (!geom) return local;
    const { svg, ctm, invCTM, vb } = geom;

    // group-local -> SVG
    const toSvgPt = svg.createSVGPoint();
    toSvgPt.x = local.x;
    toSvgPt.y = local.y;
    const svgPt = toSvgPt.matrixTransform(ctm);

    const clampedSvgX = clamp(svgPt.x, HANDLE_R, vb.width - HANDLE_R);
    const clampedSvgY = clamp(svgPt.y, HANDLE_R, vb.height - HANDLE_R);

    // SVG -> group-local
    const backPt = svg.createSVGPoint();
    backPt.x = clampedSvgX;
    backPt.y = clampedSvgY;
    const localPt = backPt.matrixTransform(invCTM);

    return { x: localPt.x, y: localPt.y };
  };

  function getTouchPoint(e) {
    if (e.touches && e.touches[0]) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  useEffect(() => {
    // Новые стартовые точки + кламп через матрицы (на случай transform у <g>)
    const nextContacts = current.points.map((target) => {
      const angle = Math.random() * Math.PI * 2;
      const r = 35 + Math.random() * 35;
      const rawLocal = {
        x: target.x + Math.cos(angle) * r,
        y: target.y + Math.sin(angle) * r,
      };
      return clampLocalWithCTM(rawLocal);
    });

    setContactPoints(nextContacts);
    setLocks(Array(current.points.length).fill(-1));
    setShowFill(false);
    setZoomed(true);
    draggingIdxRef.current = -1;
    isDraggingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const onPointerDown = (idx) => (e) => {
    if (completed) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const isCorrectlyAssembled = locks.every((t, i) => t === i);

    if (isCorrectlyAssembled) return;

    e.preventDefault();
    e.stopPropagation();

    draggingIdxRef.current = idx;
    isDraggingRef.current = true;

    setLocks((prev) => {
      const next = [...prev];
      next[idx] = -1;
      return next;
    });

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const { clientX, clientY } = getTouchPoint(e);
    const local = clientToLocal(clientX, clientY);
    if (local)
      handlePointMove(draggingIdxRef.current, clampLocalWithCTM(local));
  };

  // Движение точки в ЛОКАЛЬНЫХ координатах группы <g>
  const handlePointMove = (idx, pLocal) => {
    const SNAP_R = 10;
    let snapTo = null;

    // список занятых таргетов другими точками
    const occupied = new Set(locks.filter((t, j) => j !== idx && t >= 0));

    for (let t = 0; t < N; t++) {
      if (occupied.has(t)) continue;
      const dx = bgPoints[t].x - pLocal.x;
      const dy = bgPoints[t].y - pLocal.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= SNAP_R) {
        snapTo = t;
        break;
      }
    }

    setContactPoints((prev) => {
      const next = [...prev];
      if (snapTo !== null) {
        // Дополнительно страхуемся и клампим таргет через матрицу
        next[idx] = clampLocalWithCTM({
          x: bgPoints[snapTo].x,
          y: bgPoints[snapTo].y,
        });
      } else {
        next[idx] = clampLocalWithCTM(pLocal);
      }
      return next;
    });

    setLocks((prev) => {
      const next = [...prev];
      next[idx] = snapTo !== null ? snapTo : -1;
      return next;
    });
  };

  const onPointerUp = () => {
    if (!isDraggingRef.current) return;

    const idx = draggingIdxRef.current;
    draggingIdxRef.current = -1;
    isDraggingRef.current = false;

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);

    if (idx < 0) return;

    // Берём текущую локальную позицию, клампим с учётом CTM и делаем снап
    setContactPoints((prevPts) => {
      const pLocal = clampLocalWithCTM(prevPts[idx]);

      const occupied = new Set(locks.filter((t, j) => j !== idx && t >= 0));
      let bestTarget = -1;
      let bestDist = Infinity;

      for (let t = 0; t < N; t++) {
        if (occupied.has(t)) continue;
        const dx = bgPoints[t].x - pLocal.x;
        const dy = bgPoints[t].y - pLocal.y;
        const d = Math.hypot(dx, dy);
        if (d < bestDist) {
          bestDist = d;
          bestTarget = t;
        }
      }

      const next = [...prevPts];

      if (bestTarget >= 0 && bestDist <= MAX_SNAP) {
        next[idx] = clampLocalWithCTM({
          x: bgPoints[bestTarget].x,
          y: bgPoints[bestTarget].y,
        });
        setLocks((prev) => {
          const L = [...prev];
          L[idx] = bestTarget;

          const correct = L.every((t, i) => t === i);
          if (correct) {
            setShowFill(true);
            setTimeout(() => {
              setZoomed(false);
              setCompleted(true);
            }, 250);
          }

          return L;
        });
      } else {
        next[idx] = pLocal;
        setLocks((prev) => {
          const L = [...prev];
          L[idx] = -1;
          return L;
        });
      }

      // ✅ Только здесь вызываем проверку завершения
      setTimeout(checkCompletion, 0);

      return next;
    });
  };

  const checkCompletion = () => {
    const correct = locks.every((t, i) => t === i);
    if (!correct) return;

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

            <div className={style.game__canvas}>
              <div className={style.responsiveWrapper}>
                <div className={style.game__img__container}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      className={style.game__image}
                      src={current.img}
                      alt={`Объект ${current.id}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        transform: zoomed
                          ? `scale(${current.zoom})`
                          : "scale(1)",
                        transformOrigin: `${
                          (cx / current.svg_params.proportions.width) * 100
                        }% ${
                          (cy / current.svg_params.proportions.height) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {current && current.points && (
                  <svg
                    ref={svgRef}
                    className={style.svg}
                    viewBox={`0 0 ${current.svg_params.proportions.width} ${current.svg_params.proportions.height}`}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ position: "absolute", top: 0 }}
                  >
                    <g
                      ref={gRef}
                      style={{
                        width: "100%",
                        height: "100%",
                        transform: `
                          translate(${
                            completed
                              ? (current.svg_params.final.position.left / 445) *
                                100
                              : (current.svg_params.position.left / 445) * 100
                          }px,
                                   ${
                                     completed
                                       ? (current.svg_params.final.position
                                           .top /
                                           445) *
                                         100
                                       : (current.svg_params.position.top /
                                           445) *
                                         100
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
                              r={HANDLE_R}
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
                        <linearGradient
                          id="starGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
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
                    </g>
                  </svg>
                )}
              </div>
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
