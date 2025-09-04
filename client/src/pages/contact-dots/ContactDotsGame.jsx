import React, {
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import style from "./ContactDotsGame.module.scss";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { OBJECTS } from "../../data/contact-dots";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(Draggable);

// ---------- Вспомогательные функции ----------
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function polyPath(pts) {
  return pts.length ? `M ${pts.map((p) => `${p.x},${p.y}`).join(" L ")} Z` : "";
}

const MAX_SNAP = 20;

// Радиус "ручки" точки — держим её ПОЛНОСТЬЮ в пределах вьюпорта
const HANDLE_R = window.innerWidth <= 768 ? 15 : 10;

const ContactDotsGame = React.memo(() => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return parseInt(localStorage.getItem("progress") || "1", 10) - 1;
  });

  const getNextObject = useCallback(() => {
    if (currentIndex < OBJECTS.length) {
      const next = OBJECTS[currentIndex];
      setCurrentIndex((i) => i + 1);
      return next;
    }
    return null;
  }, [currentIndex]);

  const [current, setCurrent] = useState(() => getNextObject());
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("progress");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [completed, setCompleted] = useState(false);
  const [showFill, setShowFill] = useState(false);
  const [zoomed, setZoomed] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isDraggingRef = useRef(false);
  const svgRef = useRef(null);
  const gRef = useRef(null);
  const draggingIdxRef = useRef(-1);
  const initialRender = useRef(true);

  const navigate = useNavigate();

  const bgPoints = useMemo(
    () => current.points.map((p) => ({ ...p })),
    [current]
  );

  const N = bgPoints.length;

  const [locks, setLocks] = useState(() => Array(N).fill(-1));
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

  const clientToLocal = (clientX, clientY) => {
    const svg = svgRef.current;
    const g = gRef.current;
    if (!svg || !g) return null;

    const m = g.getScreenCTM && g.getScreenCTM();
    if (!m) return null;

    const invM = m.inverse();
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const localPt = pt.matrixTransform(invM);
    return { x: localPt.x, y: localPt.y };
  };

  useLayoutEffect(() => {
    localStorage.setItem("progress", progress);
  }, [progress]);

  useLayoutEffect(() => {
    initialRender.current = false;
  }, []);

  // Кламп точки: работаем в экранных координатах, чтобы гарантированно держать "ручку" в пределах видимой области SVG
  const clampLocalWithCTM = (local) => {
    if (!local || typeof local.x !== "number" || typeof local.y !== "number") {
      return { x: 0, y: 0 }; // дефолтная точка (или можно вернуть local как есть)
    }

    const svg = svgRef.current;
    const g = gRef.current;
    if (!svg || !g) return local;

    const m = g.getScreenCTM && g.getScreenCTM();
    if (!m) return local;

    const invM = m.inverse();
    const rect = svg.getBoundingClientRect();

    const toScreen = svg.createSVGPoint();
    toScreen.x = local.x;
    toScreen.y = local.y;
    const screenPt = toScreen.matrixTransform(m);

    const clampedScreenX = clamp(
      screenPt.x,
      rect.left + HANDLE_R,
      rect.right - HANDLE_R
    );
    const clampedScreenY = clamp(
      screenPt.y,
      rect.top + HANDLE_R,
      rect.bottom - HANDLE_R
    );

    const back = svg.createSVGPoint();
    back.x = clampedScreenX;
    back.y = clampedScreenY;
    const localPt = back.matrixTransform(invM);

    return { x: localPt.x, y: localPt.y };
  };

  const waitForCTMStableAnd = useCallback((fn) => {
    const g = gRef.current;
    if (!g || !g.getScreenCTM) {
      requestAnimationFrame(() => waitForCTMStableAnd(fn));
      return;
    }

    let last = null;
    let tries = 0;
    const MAX_TRIES = 30; // ~0.5 сек @ 60fps

    const tick = () => {
      const m = g.getScreenCTM();
      if (!m) {
        tries++;
        if (tries < MAX_TRIES) requestAnimationFrame(tick);
        else fn();
        return;
      }

      const cur = [m.a, m.b, m.c, m.d, m.e, m.f];
      if (last && cur.every((v, i) => Math.abs(v - last[i]) < 1e-3)) {
        // матрица стабилизировалась на двух соседних кадрах
        fn();
      } else {
        last = cur;
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(tick));
  }, []);

  const reclampAllPoints = useCallback(() => {
    setContactPoints((prev) => prev.map((p) => (p ? clampLocalWithCTM(p) : p)));
  }, [setContactPoints]);

  function initPointsForObject(obj) {
    console.log(obj);

    let freeCount = 1;
    if (obj.id === 2) freeCount = 3;
    if (obj.id === 3) freeCount = 4;
    if (obj.id === 4) freeCount = 3;
    if (obj.id === 5) freeCount = 4;

    const total = obj.points.length;
    const indices = [...Array(total).keys()];

    const shuffled = indices.sort(() => Math.random() - 0.5);
    const freeIndices = new Set(shuffled.slice(0, freeCount));

    const nextLocks = Array(total).fill(-1);
    const nextContacts = obj.points.map((target, i) => {
      if (freeIndices.has(i)) {
        const angle = Math.random() * Math.PI * 2;
        const r = 35 + Math.random() * 35;
        const rawLocal = {
          x: target.x + Math.cos(angle) * r,
          y: target.y + Math.sin(angle) * r,
        };
        return clampLocalWithCTM(rawLocal);
      } else {
        nextLocks[i] = i;
        return clampLocalWithCTM({ x: target.x, y: target.y });
      }
    });

    setContactPoints(nextContacts);
    setLocks(nextLocks);
  }

  useLayoutEffect(() => {
    let cancelled = false;

    waitForCTMStableAnd(() => {
      if (cancelled) return;
      // Если точки уже есть — просто поджимаем их к актуальным границам
      reclampAllPoints();
    });

    // Рекламп после окончания CSS-анимации transform
    const g = gRef.current;
    const onTransitionEnd = (e) => {
      if (e.propertyName === "transform") {
        waitForCTMStableAnd(() => {
          if (cancelled) return;
          reclampAllPoints();
        });
      }
    };
    if (g) g.addEventListener("transitionend", onTransitionEnd);

    // Рекламп при ресайзе
    const onResize = () => {
      waitForCTMStableAnd(() => {
        if (cancelled) return;
        reclampAllPoints();
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      if (g) g.removeEventListener("transitionend", onTransitionEnd);
      window.removeEventListener("resize", onResize);
    };
  }, [current, zoomed, completed, reclampAllPoints, waitForCTMStableAnd]);

  function getTouchPoint(e) {
    if (e.touches && e.touches[0]) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  useLayoutEffect(() => {
    let raf1 = 0;
    let raf2 = 0;

    setShowFill(false);
    setZoomed(true);
    draggingIdxRef.current = -1;
    isDraggingRef.current = false;

    raf1 = requestAnimationFrame(() => {
      if (gRef.current && gRef.current.getCTM) gRef.current.getCTM();

      raf2 = requestAnimationFrame(() => {
        initPointsForObject(current);
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
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

  const handleNext = () => {
    if (completed) {
      const next = getNextObject();

      if (!next) {
        localStorage.removeItem("progress");
        navigate("/contact-dots/end", { state: { isCompleted: true } });
        return;
      }

      setCurrent(next);
      setProgress((p) => p + 1);
      setCompleted(false);
      setShowFill(false);
      setZoomed(true);
      draggingIdxRef.current = -1;
      isDraggingRef.current = false;

      waitForCTMStableAnd(() => {
        initPointsForObject(next);
      });
    }
  };

  useLayoutEffect(() => {
    waitForCTMStableAnd(() => {
      reclampAllPoints();
    });
  }, [reclampAllPoints, waitForCTMStableAnd]);

  console.log(completed, current);

  return (
    <section className={style.game}>
      <div className="container">
        <div className={style.game__wrapper}>
          <div className={style.game__top}>
            <h1>ТОЧКИ КОНТАКТА</h1>
            <p>{completed ? current.text : "Соберите объект по точкам"}</p>
          </div>

          <div className={style.game__content}>
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
                          transition: initialRender.current
                            ? "none"
                            : "transform 0.6s ease",
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
                        {bgPoints.map((p, i) =>
                          p ? (
                            <circle
                              key={`bg-${i}`}
                              cx={p.x}
                              cy={p.y}
                              r={2}
                              fill="#ffffff"
                              opacity="0.9"
                            />
                          ) : null
                        )}

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

                        {contactPoints.map((p, i) => {
                          const bg = bgPoints[i];
                          if (!p || !bg) return null;

                          return (
                            <line
                              key={`line-${i}`}
                              x1={p.x}
                              y1={p.y}
                              x2={bg.x}
                              y2={bg.y}
                              stroke="#f4a623"
                              strokeWidth="1"
                            />
                          );
                        })}

                        {/* Контактные точки (перетаскиваемые) */}
                        {contactPoints.map((p, i) => {
                          const bg = bgPoints[i];
                          if (!p || !bg) return null;

                          // Логика цвета
                          let fillColor = "#1A1A1A";
                          if (locks[i] >= 0) {
                            fillColor = locks[i] === i ? "#f4a623" : "#FFFFFF";
                          }

                          return (
                            <g key={`c-${i}`}>
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={HANDLE_R}
                                fill={fillColor}
                                stroke="#f4a623"
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
                            <stop
                              offset="200%"
                              stopColor="rgba(175,125,44,1)"
                            />
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
              {progress === 3 ? "Завершить" : "Следующий объект"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactDotsGame;
