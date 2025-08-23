import React from "react";
import style from "./FaceRecognitionHome.module.scss";
import { Link } from "react-router-dom";

const FaceRecognitionHome = () => {
  const images = [
    {
      path: "/images/face-recognition/1.jpg",
    },

    {
      path: "/images/face-recognition/2.jpg",
    },

    {
      path: "/images/face-recognition/3.jpg",
    },

    {
      path: "/images/face-recognition/4.jpg",
    },

    {
      path: "/images/face-recognition/5.jpg",
    },

    {
      path: "/images/face-recognition/6.jpg",
    },

    {
      path: "/images/face-recognition/7.jpg",
    },
  ];

  const doubledImages = [...images, ...images, ...images, ...images];

  return (
    <section className={style.home}>
      <div className="containe">
        <div className={style.home__wrapper}>
          <h1>Распознавание ЛИЦ</h1>
          <p>
            Каждый оперативник СМЕРШ хранил в голове целую картотеку. Лица.
            Глаза. Брови. Носы. Губы. Уши. Особые приметы.
          </p>

          <div className={style.scroller}>
            <ul>
              {doubledImages.map(({ path }, index) => (
                <li key={index}>
                  <img src={path} alt="face" />
                </li>
              ))}
            </ul>
          </div>

          <div className={style.home__text}>
            <p>
              Они тренировались запоминать лица, которые видели лишь мельком, и
              безошибочно узнавать их среди множества других. Теперь вы тоже
              можете пройти такой курс. <br />
              Вы увидите несколько портретов, каждый по 3 секунды: найдите и
              отметьте их среди других лиц.
            </p>
          </div>

          <Link to="/face-recognition/game">Начать игру</Link>
        </div>
      </div>
    </section>
  );
};

export default FaceRecognitionHome;
