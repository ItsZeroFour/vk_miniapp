import React, { useState } from "react";
import style from "./header.module.scss";
import logo from "../../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ToggleVolume from "../toggle_volume/ToggleVolume";
import { motion, AnimatePresence } from "framer-motion";
import useDisableScroll from "../../hooks/useDisableScroll";
import { menuVariants, itemVariants } from "../../animations/header";
import TaskPopup from "../task-popup/TaskPopup";
import useUser from "../../hooks/useUser";
import useVKAuth from "../../hooks/useVKAuth";
import { menuItems } from "../../data/menu";
import useVkEnvironment from "../../hooks/useVkEnvironment";
import { partners } from "../../data/partners";
import close from "../../assets/icons/close-2.svg";

const Header = ({ finalUserId, user }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showOtherLinks, setShowOtherLinks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [navigateItemClick, setNavigateItemClick] = useState("");

  const { isMiniApp } = useVkEnvironment();

  const navigate = useNavigate();
  const location = useLocation();

  const { userId } = useUser();
  const { accessToken } = useVKAuth(userId);

  const continueOnClick = () => {
    navigate(navigateItemClick);
  };

  const handleProtectedClick = (path, page_type) => {
    setOpenMenu(false);

    if (user?.subscribed) {
      navigate(path, { state: { page_type: page_type } });
    } else {
      setNavigateItemClick(path);
      setShowPopup(true);
    }
  };

  useDisableScroll(openMenu);

  return (
    <header className={style.header}>
      <TaskPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
        finalUserId={finalUserId}
        userId={userId}
        accessToken={accessToken}
        userData={user}
        continueOnClick={continueOnClick}
      />

      <div
        style={isMiniApp ? { paddingTop: 35 } : { paddingTop: 0 }}
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
              <p>СЕРГЕЙ БЕЗРУКОВ</p>
            </li>

            <li>
              <p>НИКИТА КОЛОГРИВЫЙ</p>
            </li>

            <li>
              <p>ПАВЕЛ ТАБАКОВ</p>
            </li>
          </ul>
        </nav>

        <div className={style.header__buttons}>
          <button
            onClick={() =>
              (window.location.href = "https://www.kinopoisk.ru/film/1234808")
            }
          >
            КУПИТЬ БИЛЕТЫ
          </button>

          {/* <button onClick={() => setOpenMenu(!openMenu)}></button> */}
          <button
            onClick={() => {
              if (location.pathname === "/") {
                window.location.href = "https://augustmovie.ru";
              } else if (location.pathname === "/menu/hub") {
                window.location.href = "https://augustmovie.ru";
              } else {
                window.location.href = "/";
              }
            }}
          >
            <img src={close} alt="close" />
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
                  {menuItems.map(
                    (
                      { title, path, page_type, protected: isProtected },
                      index
                    ) => (
                      <motion.li key={index} variants={itemVariants}>
                        {isProtected ? (
                          <button
                            onClick={() => handleProtectedClick(path)}
                            className="text-left"
                          >
                            {title}
                          </button>
                        ) : (
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
                        )}
                      </motion.li>
                    )
                  )}
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
              {partners.map(({ title, logo, link }) => (
                <Link to={link} target="_blank">
                  <img src={logo} alt={title} />
                </Link>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
