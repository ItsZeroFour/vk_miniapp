import React, { useState } from "react";
import style from "./header.module.scss";
import logo from "../../assets/logo.svg";
import volumeOn from "../../assets/icons/volume_on.svg";
import volumeOff from "../../assets/icons/volume_off.svg";
import { Link } from "react-router-dom";

const Header = () => {
  const [isVolumeOn, setIsVolumeOn] = useState(true);

  const toggleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };

  return (
    <header className={style.header}>
      <div className="container">
        <div className={style.header__wrapper}>
          <div className={style.header__menu}>
            <button></button>
          </div>

          <Link to="/" className={style.header__logo}>
            <img src={logo} alt="logo" />
            <p>В кино с 25 сентября</p>
          </Link>

          <button
            className={`${style.header__volume} ${
              isVolumeOn ? style.on : style.off
            }`}
            onClick={toggleVolume}
          >
            <div className={style.header__volume__item}>
              <img
                src={isVolumeOn ? volumeOn : volumeOff}
                alt={isVolumeOn ? "volume On" : "volume Off"}
              />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
