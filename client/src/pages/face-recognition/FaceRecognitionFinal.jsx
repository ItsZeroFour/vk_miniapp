import React from "react";
import style from "./FaceRecognitionFinal.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";

const FaceRecognitionFinal = () => {
  const location = useLocation();
  const { isWon, correct_item_count } = location.state;
  const navigate = useNavigate();

  if (typeof isWon !== "boolean") {
    return navigate("/face-recognition");
  }

  return (
    <section className={style.final}>
      <div className="container">
        <div className={style.final__wrapper}>
          <h1>{isWon ? "Вы справились!" : "Вы ошиблись!"}</h1>
          <p>
            <span>{correct_item_count} из 3!</span> <br /> Это была лишь
            тренировка. В настоящем деле всё намного сложнее. Смотри «Август» в
            кино с 25 сентября.
          </p>

          <div className={style.final__container}>
            <iframe
              src="https://vkvideo.ru/video_ext.php?oid=-211437014&id=456246667&hd=2&autoplay=1"
              width="100%"
              height="192"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>

          <div className={style.final__buttons}>
            <Link
              className={style.final__buttons__first}
              to="/face-recognition"
            >
              Начать игру заново
            </Link>
            <Link className={style.final__buttons__last} to="/">
              Другие игры
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaceRecognitionFinal;
