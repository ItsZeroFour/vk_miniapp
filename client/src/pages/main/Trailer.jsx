import React from "react";
import style from "./trailer.module.scss";
import _1kanal from "../../assets/icons/logos/1kanal-2.svg";
import kinopoisk from "../../assets/icons/logos/kinopoisk-2.svg";
import { Link } from "react-router-dom";
import Video from "../../components/video/Video";

const TrailerBottom = React.memo(({ src }) => {
  console.log(src);

  return (
    <div className={style.trailer}>
      <h3>«Август» в кино с 25 сентября</h3>

      <div className={style.trailer__video}>
        <Video src={src || "https://vkvideo.ru/video-232235882_456239021"} />
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
  );
});

export default TrailerBottom;
