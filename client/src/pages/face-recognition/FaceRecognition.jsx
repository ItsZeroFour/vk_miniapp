import React, { useEffect, useMemo, useState } from "react";
import style from "./faceRecognition.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const FaceRecognition = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const [chosenFaces, setChosenFaces] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3);

  const navigate = useNavigate();

  const allImages = useMemo(() => {
    return Array.from(
      { length: 12 },
      (_, i) => `/images/face-recognition/${i + 1}.jpg`
    );
  }, []);

  const random12 = useMemo(() => {
    return shuffleArray(allImages).slice(0, 12);
  }, [allImages]);

  const selected3 = useMemo(() => {
    return shuffleArray(random12).slice(0, 3);
  }, [random12]);

  useEffect(() => {
    if (currentIndex >= selected3.length) {
      setShowImage(false);
      return;
    }

    setTimeLeft(3);
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [currentIndex, selected3.length]);

  const NoiseOverlay = () => (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage:
          'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABOSURBVGhD7c4xAQAgDMCw8yf9m0YQ3HdJkCRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiTpB+4BCLAAF0QxAAAAAElFTkSuQmCC")',
        opacity: 0.05,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );

  const toggleFaceSelection = (img) => {
    setChosenFaces((prev) => {
      if (prev.includes(img)) {
        return prev.filter((f) => f !== img);
      }
      if (prev.length < 3) {
        return [...prev, img];
      }
      return prev;
    });
  };

  return (
    <section className={style.face_recognition}>
      <div className="contgaine">
        <div className={style.face_recognition__wrapper}>
          <h1>РАСПОЗНАНИЕ ЛИЦ</h1>
          {currentIndex < selected3.length ? (
            <p>
              Смотрите <br /> и запоминайте
            </p>
          ) : (
            <p>
              Отметьте среди этих людей только <br />
              тех, кого вы только что видели
            </p>
          )}

          {currentIndex < selected3.length ? (
            <div className={style.face_recognition__container}>
              <AnimatePresence mode="wait">
                {showImage && (
                  <div className={style.face_recognition__content}>
                    <div className={style.face_recognition__top}>
                      <p>
                        {currentIndex + 1} / {selected3.length}
                      </p>
                      <p>00:0{timeLeft}</p>
                    </div>
                    <motion.div
                      key={currentIndex}
                      className={style.face_recognition__images}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <motion.img
                        src={selected3[currentIndex]}
                        alt={`face ${currentIndex + 1}`}
                        className={style.face_recognition__img}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: {
                            duration: 1,
                            ease: "easeInOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          transition: {
                            duration: 1,
                            ease: "easeInOut",
                          },
                        }}
                      />
                      <NoiseOverlay />
                      <div className={style.face_recognition__overlay} />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className={style.face_recognition__container}>
              <ul className={style.face_recognition__faces}>
                {random12.map((item, index) => {
                  const isSelected = chosenFaces.includes(item);
                  return (
                    <li
                      key={index}
                      onClick={() => toggleFaceSelection(item)}
                      className={isSelected && style.face_recognition__selected}
                    >
                      <img
                        className={style.face_recognition__faces__img}
                        src={item}
                        alt=""
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!showImage && (
            <button
              className={
                chosenFaces.length < 3
                  ? `${style.face_recognition__button}`
                  : `${style.face_recognition__button} ${style.active}`
              }
              disabled={chosenFaces.length < 3}
              onClick={() =>
                navigate("/face-recognition/final", {
                  state: {
                    isWon: selected3.every((item) =>
                      chosenFaces.includes(item)
                    ),
                    correct_item_count: selected3.filter((item) =>
                      chosenFaces.includes(item)
                    ).length,
                  },
                })
              }
            >
              Проверить
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaceRecognition;
