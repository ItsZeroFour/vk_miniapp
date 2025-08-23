import React, { useState } from "react";
import style from "./game.module.scss";
import { items } from "../../data/friend-or-foe";
import { useNavigate } from "react-router-dom";

const FriendOrFoeGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isEnd, setIsEnd] = useState(false);

  const navigate = useNavigate();

  const handleSelect = (choice) => {
    setSelected(choice);
  };

  const handleSubmit = () => {
    if (selected === null) return;

    const currentPair = items[currentIndex];
    const chosenCard = currentPair[selected];

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
        setIsEnd(true);
        navigate("/friend-or-foe/end", {
          state: { answers: updatedAnswers, isEnd: true },
        });
      }

      return updatedAnswers;
    });

    setSelected(null);
  };

  const currentPair = items[currentIndex];

  return (
    <section className={style.game}>
      <div className="container">
        <div className={style.game__wrapper}>
          <div className={style.game__top}>
            <h1>СВОЙ-ЧУЖОЙ</h1>
            <p>Выберите и отметьте, кто из этих двоих - свой</p>
          </div>

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
    </section>
  );
};

export default FriendOrFoeGame;
