import React, { useState } from "react";
import style from "./header.module.scss";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import ToggleVolume from "../toggle_volume/ToggleVolume";
import { motion, AnimatePresence } from "framer-motion";
import useDisableScroll from "../../hooks/useDisableScroll";
import partners from "../../assets/icons/partners.svg";
import { menuVariants, itemVariants } from "../../animations/header";

const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showOtherLinks, setShowOtherLinks] = useState(false);

  useDisableScroll(openMenu);

  return (
    <header className={style.header}>
      <div
        className={
          openMenu
            ? `${style.header__wrapper} ${style.active}`
            : style.header__wrapper
        }
      >
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

          <button onClick={() => setOpenMenu(!openMenu)}></button>
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
                    {
                      title: "ГЛАВНАЯ",
                      path: "/",
                      page_type: "main",
                    },

                    {
                      title: "РОЗЫГРЫШ",
                      path: "/",
                      page_type: "drawing",
                    },

                    {
                      title: "РАСПОЗНАВАНИЕ ЛИЦ",
                      path: "/face-recognition",
                      page_type: "",
                    },

                    {
                      title: "СВОЙ-ЧУЖОЙ",
                      path: "/friend-or-foe",
                      page_type: "",
                    },

                    {
                      title: "ТОЧКИ КОНТАКТА",
                      path: "/contact-dots",
                      page_type: "",
                    },

                    {
                      title: "О ФИЛЬМЕ",
                      path: "/",
                      page_type: "trailer",
                    },
                  ].map(({ title, path, page_type }, index) => (
                    <motion.li key={index} variants={itemVariants}>
                      <Link
                        onClick={() => {
                          setShowOtherLinks(false);
                          setOpenMenu(false);
                        }}
                        to={path}
                        state={{ page_type }}
                      >
                        {title}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            ) : (
              <nav>
                <motion.ul>
                  {[
                    {
                      title: "КОДЕКС СМЕРШ",
                      path: "/",
                    },

                    {
                      title: "ПРОЙТИ КУРС РАЗВЕДЧИКА",
                      path: "/",
                    },

                    {
                      title: "КОМАНДА",
                      path: "/",
                    },

                    {
                      title: "МИССИЯ",
                      path: "/",
                    },

                    {
                      title: "СЕКРЕТНЫЕ МАТЕРИАЛЫ",
                      path: "/",
                    },

                    {
                      title: "КУПИТЬ БИЛЕТЫ",
                      path: "/",
                    },
                  ].map(({ title, path }, index) => (
                    <motion.li key={index} variants={itemVariants}>
                      {index === 1 ? (
                        <button onClick={() => setShowOtherLinks(true)}>
                          {title}
                        </button>
                      ) : (
                        <Link onClick={() => setOpenMenu(false)} to={path}>
                          {title}
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
              <img src={partners} alt="Партнеры" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
