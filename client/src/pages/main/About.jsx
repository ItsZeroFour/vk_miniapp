import React from "react";
import style from "./about.module.scss";
import { Link } from "react-router-dom";
import _1kanal from "../../assets/icons/logos/1kanal-2.svg";
import kinopoisk from "../../assets/icons/logos/kinopoisk-2.svg";
import Video from "../../components/video/Video";
import { partners2 } from "../../data/partners-2";

const About = React.memo(() => {
  return (
    <section className={style.about}>
      <div className={style.about__wrapper}>
        <p className={style.about__desc}>
          Август 1944 года. Глухие леса Западной Белоруссии. Средиземье, недавно
          освобождённая территория — особая зона, где действуют оставленные в
          советском тылу вражеские разведывательно-диверсионные группы.
          Советские войска переходят государственную границу, война поворачивает
          вспять. Помешать этому может удар в спину наступающей армии.
          Предотвратить нападение могут только контрразведчики СМЕРШ.
        </p>

        <h3>«Август» в кино с 25 сентября</h3>

        <div className={style.about__video}>
          <Video src="https://vkvideo.ru/video_ext.php?oid=-217350474&id=456243968&hd=2&autoplay=1" />
        </div>

        <Link
          className={style.about__tickets}
          to="https://www.kinopoisk.ru/film/1234808"
          target="_blank"
        >
          КУПИТЬ БИЛЕТЫ
        </Link>

        <div className={style.about__socials}>
          <p>Следите за нами</p>

          <ul>
            {partners2.map(({ title, logo, link }) => (
              <li>
                <Link to={link} target="_blank">
                  <img src={logo} alt={title} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
});

export default About;
