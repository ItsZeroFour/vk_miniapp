import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import style from "./header.module.scss";
import logo from "../../assets/logo.svg";
import volumeOn from "../../assets/icons/volume_on.svg";
import volumeOff from "../../assets/icons/volume_off.svg";
import { Link } from "react-router-dom";
import kinopoisk from "../../assets/icons/logos/kinopoisk-black.svg";
import _1kanal from "../../assets/icons/logos/1kanal-black.svg";

const Header = () => {
  const [isVolumeOn, setIsVolumeOn] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [showOtherLinks, setShowOtherLinks] = useState(false);

  const toggleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };

  // Анимация для меню
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: 1,
      },
    },
  };

  // Анимация для пунктов меню
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className={style.header}>
      <div className="container">
        <div
          className={`${style.header__wrapper} ${openMenu ? style.active : ""}`}
        >
          <div className={style.header__menu}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className={openMenu ? style.active : ""}
              aria-label={openMenu ? "Close menu" : "Open menu"}
            >
              <motion.span
                animate={{ rotate: openMenu ? 45 : 0, y: openMenu ? 7 : 0 }}
              />
              <motion.span animate={{ opacity: openMenu ? 0 : 1 }} />
              <motion.span
                animate={{ rotate: openMenu ? -45 : 0, y: openMenu ? -7 : 0 }}
              />
            </button>
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
            aria-label={isVolumeOn ? "Mute" : "Unmute"}
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

      <AnimatePresence>
        {openMenu && (
          <motion.div
            className={style.header__menu__container}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
          >
            {showOtherLinks ? (
              <nav>
                <motion.ul>
                  {[
                    "ГЛАВНАЯ",
                    "РОЗЫГРЫШ",
                    "РАСПОЗНАВАНИЕ ЛИЦ",
                    "СВОЙ-ЧУЖОЙ",
                    "ТОЧКИ КОНТАКТА",
                    "О ФИЛЬМЕ",
                  ].map((text, i) => (
                    <motion.li key={i} variants={itemVariants}>
                      <Link
                        onClick={() => {
                          setShowOtherLinks(false);
                          setOpenMenu(false);
                        }}
                        to="/"
                      >
                        {text}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            ) : (
              <nav>
                <motion.ul>
                  {[
                    "КОДЕКС СМЕРШ",
                    "ПРОЙТИ КУРС РАЗВЕДЧИКА",
                    "КОМАНДА",
                    "МИССИЯ",
                    "СЕКРЕТНЫЕ МАТЕРИАЛЫ",
                    "КУПИТЬ БИЛЕТЫ",
                  ].map((text, i) => (
                    <motion.li key={i} variants={itemVariants}>
                      {i === 1 ? (
                        <button onClick={() => setShowOtherLinks(true)}>
                          {text}
                        </button>
                      ) : (
                        <Link onClick={() => setOpenMenu(false)} to="/">
                          {text}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            )}

            <motion.div
              className={style.header__bottom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3>СЛЕДИТЕ ЗА НАМИ</h3>

              <motion.ul>
                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/">
                    <img src={kinopoisk} alt="kinopoisk" />
                    КИНОПОИСК
                  </Link>
                </motion.li>

                <motion.li
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/">
                    <img src={_1kanal} alt="1 канал" />1 КАНАЛ
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
