import React, { useState, useEffect } from "react";
import style from "./game.module.scss";
import { items } from "../../data/friend-or-foe";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  popupAnimation,
  wrapperAnimation,
  buttonAnimation,
  contentAnimation,
  DELAYS,
} from "../../animations/popup";
import { usePreloadNextImages } from "../../hooks/usePreloadNextImages";

const FriendOrFoeGame = React.memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const navigate = useNavigate();

  const handleSelect = (choice) => {
    setSelected(choice);
  };

  // YM
  useEffect(() => {
    if (currentIndex === 0) {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game3_step1");
      }
    } else if (currentIndex === 1) {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game3_step2");
      }
    } else if (currentIndex === 2) {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game3_step3");
      }
    } else if (currentIndex === 3) {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game3_step4");
      }
    } else if (currentIndex === 4) {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game3_step5");
      }
    } else {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game3_step6");
      }
    }
  }, [currentIndex]);

  const handleSubmit = () => {
    if (selected === null) return;

    const currentPair = items[currentIndex];
    const chosenCard = currentPair[selected];

    setIsCorrect(chosenCard.isFriend);

    setAnswers((prev) => {
      const updatedAnswers = [
        ...prev,
        {
          round: currentIndex + 1,
          chosenImg: chosenCard.img,
          isFriend: chosenCard.isFriend,
        },
      ];

      if (currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        navigate("/friend-or-foe/end", {
          state: { answers: updatedAnswers, isEnd: true },
        });
      }

      return updatedAnswers;
    });

    if (currentIndex !== 6) setShowPopup(true);
    setSelected(null);
  };

  const getCorrectWordForm = (number) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return "пар";
    }

    if (lastDigit === 1) {
      return "пара";
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return "пары";
    }

    return "пар";
  };

  const currentPair = items[currentIndex];

  const closePopup = () => {
    setShowPopup(false);
  };

  /* PRELOAD IMAGES */
  usePreloadNextImages(items, currentIndex);

  return (
    <section className={style.game}>
      <AnimatePresence>
        {currentIndex <= 1 && showPopup && (
          <motion.div className={style.task__popup} {...popupAnimation}>
            <motion.div
              className={style.task__popup__wrapper}
              {...wrapperAnimation}
            >
              <motion.button
                className={style.task__popup__close}
                onClick={closePopup}
              ></motion.button>
              {/* <motion.p className={style.task__popup__text__main}>
                {isCorrect ? "Верно!" : "Неверно"}
              </motion.p> */}
              <motion.p className={style.task__popup__text}>
                Осталось {items.length - answers.length}{" "}
                {getCorrectWordForm(items.length - answers.length)}
              </motion.p>
              <motion.button
                className={style.task__popup__check}
                onClick={() => setShowPopup(false)}
                whileTap={{ scale: 0.95 }}
              >
                Продолжить
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        <div className={style.game__wrapper}>
          <div className={style.game__top}>
            <h1>СВОЙ-ЧУЖОЙ</h1>
            <p>Выберите и отметьте, кто из этих двоих - свой</p>
          </div>

          <div className={style.game__content}>
            <div className={style.game__main}>
              <p>
                {answers.length + 1} / {items.length}
              </p>

              <div className={style.game__main__cards}>
                {currentPair.map((card, index) => (
                  <div
                    key={index}
                    className={`${style.card} ${
                      selected === index ? style.active : ""
                    }`}
                    onClick={() => handleSelect(index)}
                  >
                    <img src={card.img} alt="" />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={selected !== null ? handleSubmit : () => {}}
              disabled={selected === null}
            >
              Отправить запрос в картотеку
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default FriendOrFoeGame;
