import React from "react";
import style from "./trailer.module.scss";
import _1kanal from "../../assets/icons/logos/1kanal-2.svg";
import kinopoisk from "../../assets/icons/logos/kinopoisk-2.svg";
import { Link } from "react-router-dom";
import Video from "../../components/video/Video";
import { partners2 } from "../../data/partners-2";

const TrailerBottom = React.memo(({ src }) => {
  return (
    <div className={style.trailer}>
      <h3>«Август» в кино с 25 сентября</h3>

      <div className={style.trailer__video}>
        <Video
          src={
            src ||
            "https://vkvideo.ru/video_ext.php?oid=-217350474&id=456243968&hd=2&autoplay=1"
          }
        />
      </div>

      <Link
        className={style.trailer__tickets}
        to="https://www.kinopoisk.ru/film/1234808"
        target="_blank"
      >
        КУПИТЬ БИЛЕТЫ
      </Link>

      <div className={style.trailer__socials}>
        <p>Следите за нами</p>

        <ul>
          {partners2.map(({ link, logo, title }) => (
            <li>
              <Link to={link} target="_blank">
                <img src={logo} alt={title} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default TrailerBottom;
