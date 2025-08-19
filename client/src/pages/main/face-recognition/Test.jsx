import React from "react";
import style from "./test.module.scss";

const Test = () => {
  return (
    <section className={style.test}>
      <div className="container">
        <div className={style.test__wrappe}>
          <div className={style.test__top}>
            <h1>Распознование лиц</h1>
            <p>Смотрите и запоминайте</p>
          </div>

          <div className={style.test__img}>
            <div className={style.test__img__top}>
              <p>2 / 3</p>
              <p>00:03</p>
            </div>

            <img src="/images/face-recognition/1.jpg" alt="face" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Test;
