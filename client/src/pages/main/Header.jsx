import React, { useState } from "react";
import style from "./header.module.scss";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import volumeOn from "../../assets/icons/volume_on.svg";
import volumeOff from "../../assets/icons/volume_off.svg";

const Header = () => {
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);

  const toggleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };

  return (
    <header className={style.header}>
      <div className={style.header__wrapper}>
        <button
          className={`${style.header__volume} ${
            isVolumeOn ? style.on : style.off
          }`}
          onClick={toggleVolume}
          aria-label={isVolumeOn ? "Mute" : "Unmute"}
        >
          <div className={style.header__volume__item}>
            <img
              src={isVolumeOn ? volumeOn : volumeOff}
              alt={isVolumeOn ? "volume On" : "volume Off"}
            />
          </div>
        </button>

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
