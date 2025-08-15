import React from "react";
import style from "./header.module.scss";
import logo from "../../assets/logo.svg";
import dots from "../../assets/icons/dots.svg";
import close from "../../assets/icons/close.svg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.header__wrapper}>
        <Link className={style.header__logo} to="/">
          <img src={logo} alt="logo" />
          <p>в кино с 25 сентября</p>
        </Link>

        <nav className={style.header__nav}>
          <ul>
            <li>
              <Link to="/">Задания</Link>
            </li>

            <li>
              <Link to="/">О фильме</Link>
            </li>

            <li>
              <Link to="/">Розыгрыш</Link>
            </li>
          </ul>
        </nav>

        <div className={style.header__buttons}>
          <button>
            <img src={dots} alt="dots" />
          </button>

          <button>
            <img src={close} alt="close" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
