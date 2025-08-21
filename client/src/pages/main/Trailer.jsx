import React from "react";
import style from "./trailer.module.scss";
import { Link } from "react-router-dom";
import _1kanal from "../../assets/icons/logos/1kanal-2.svg";
import kinopoisk from "../../assets/icons/logos/kinopoisk-2.svg";

const Trailer = () => {
  return (
    <section className={style.trailer}>
      <div className={style.trailer__wrapper}>
        <p className={style.trailer__desc}>
          Август 1944 года. Глухие леса Западной Белоруссии. Средиземье, недавно
          освобождённая территория — особая зона, где действуют оставленные в
          советском тылу вражеские разведывательно-диверсионные группы.
          Советские войска переходят государственную границу, война поворачивает
          вспять. Помешать этому может удар в спину наступающей армии.
          Предотвратить нападение могут только контрразведчики СМЕРШ.
        </p>

        <h3>«Август» в кино с 25 сентября</h3>

        <div className={style.trailer__video}>
          <iframe
            src="https://vkvideo.ru/video_ext.php?oid=-211437014&id=456246667&hd=2&autoplay=1"
            width="100%"
            height="620"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <Link className={style.trailer__tickets} to="/">
          КУПИТЬ БИЛЕТЫ
        </Link>

        <div className={style.trailer__socials}>
          <p>Следите за нами</p>

          <ul>
            <li>
              <Link to="">
                <img src={_1kanal} alt="1  канал" />
              </Link>
            </li>

            <li>
              <Link to="">
                <img src={kinopoisk} alt="Кинопоиск" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Trailer;
