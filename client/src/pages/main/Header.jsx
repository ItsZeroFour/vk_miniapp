import React from "react";
import style from "./header.module.scss";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import ToggleVolume from "../../components/toggle_volume/ToggleVolume";

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.header__wrapper}>
        <div className={style.header__volume}>
          <ToggleVolume />
        </div>

        <Link className={style.header__logo} to="/">
          <img src={logo} alt="logo" />
          <p>в кино с 25 сентября</p>
        </Link>

        <nav className={style.header__nav}>
          <ul>
            <li>
              <Link to="/">СЕРГЕЙ БЕЗРУКОВ</Link>
            </li>

            <li>
              <Link to="/">НИКИТА КОЛОГРИВЫЙ</Link>
            </li>

            <li>
              <Link to="/">ПАВЕЛ ТАБАКОВ</Link>
            </li>
          </ul>
        </nav>

        <div className={style.header__buttons}>
          <button>КУПИТЬ БИЛЕТЫ</button>

          <button></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
