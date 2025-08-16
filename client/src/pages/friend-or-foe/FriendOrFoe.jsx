import React from "react";
import style from "./home.module.scss";
import { Link } from "react-router-dom";

const FriendOrFoe = () => {
  return (
    <section className={style.friend_or_foe}>
      <div className="container">
        <div className={style.friend_or_foe__wrapper}>
          <div className={style.friend_or_foe__top}>
            <h1>СВОЙ-ЧУЖОЙ</h1>
            <p>Задача СМЕРШа – делать неочевидное очевидным</p>
          </div>

          <img
            className={style.friend_or_foe__img}
            src="/images/friend-or-foe/8.webp"
            alt="main img"
          />

          <p>
            А вы сможете определить, кто здесь – свой, а кто – шпион?
            Полагайтесь на интуицию!
          </p>

          <Link
            className={style.friend_or_foe__start}
            to="/friend-or-foe/start"
          >
            Начать игру
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FriendOrFoe;
