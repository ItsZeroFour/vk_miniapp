import React, { useState } from "react";
import style from "./header.module.scss";
import logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import ToggleVolume from "../toggle_volume/ToggleVolume";
import { motion, AnimatePresence } from "framer-motion";
import useDisableScroll from "../../hooks/useDisableScroll";
import partners from "../../assets/icons/partners.svg";
import { menuVariants, itemVariants } from "../../animations/header";
import TaskPopup from "../task-popup/TaskPopup";
import useUser from "../../hooks/useUser";
import useVKAuth from "../../hooks/useVKAuth";
import { menuItems } from "../../data/menu";

const Header = ({ finalUserId, user }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [showOtherLinks, setShowOtherLinks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [navigateItemClick, setNavigateItemClick] = useState("");

  const navigate = useNavigate();

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

  console.log(user);

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
              <img src={partners} alt="Партнеры" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
