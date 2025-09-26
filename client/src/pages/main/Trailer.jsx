import React from "react";
import style from "./trailer.module.scss";
import _1kanal from "../../assets/icons/logos/1kanal-2.svg";
import kinopoisk from "../../assets/icons/logos/kinopoisk-2.svg";
import { Link } from "react-router-dom";
import Video from "../../components/video/Video";
import { partners2 } from "../../data/partners-2";
import bridge from "@vkontakte/vk-bridge";

const TrailerBottom = React.memo(({ src }) => {
  return (
    <div className={style.trailer}>
      <h3>«Август». Уже в кино</h3>

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
        onClick={async () => {
          bridge.send("VKWebAppSendCustomEvent", {
            type: "type_click",
            event: "ticket_transition",
            screen: "main",
            timezone: "3gtm",
            json: {
              screen: "Трейлер",
            },
          });
        }}
        to="https://www.kinopoisk.ru/film/1234808"
        target="_blank"
      >
        КУПИТЬ БИЛЕТЫ
      </Link>

      {/* <div className={style.trailer__socials}>
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
      </div> */}

      <div className={style.trailer__footer}>
        <p>© АО "Дирекция Кино", 16+. Все права защищены.</p>
        <p>
          ООО "Централ Партнершип Сейлз Хаус", 121357, г. Москва, ОГРН
          1077746147940.
        </p>
        <p>
          Сервис Яндекс Афиша предоставляется ООО "Яндекс Музыка". Адрес:
          115035, г. Москва, ул. Садовническая, д. 82, стр. 2. ОГРН:
          1187746644920
        </p>
      </div>
    </div>
  );
});

export default TrailerBottom;
