import React from "react";
import style from "./footer.module.scss";
import { Link } from "react-router-dom";
import kinopoisk from "../../assets/icons/logos/kinopoisk.svg";
import _1kanal from "../../assets/icons/logos/1kanal.svg";
import support from "../../assets/icons/logos/support.png";

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footer__wrappe}>
        <Link className={style.footer__link} to="/">
          КУПИТЬ БИЛЕТЫ
        </Link>

        <div className={style.footer__watch}>
          <h3>Следите за нами</h3>

          <ul>
            <li>
              <Link to="/">
                <img src={kinopoisk} alt="Кинопоиск" />
              </Link>
            </li>

            <li>
              <Link to="/">
                <img src={_1kanal} alt="1 канал" />
              </Link>
            </li>
          </ul>
        </div>

        <img className={style.footer__support} src={support} alt="support" />
      </div>
    </footer>
  );
};

export default Footer;
