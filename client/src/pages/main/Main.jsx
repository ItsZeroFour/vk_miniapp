import React, { useState } from "react";
import style from "./main.module.scss";
import Header from "./Header";
import Head from "./Head";
import Task from "./Task";
import Trailer from "./Trailer";
import trailer from "../../assets/videos/trailer.mp4";
import useDisableScroll from "../../hooks/useDisableScroll";
import { motion, AnimatePresence } from "framer-motion";
import Drawing from "./Drawing";

const Main = ({ isSubscribe }) => {
  const [showVideo, setShowVideo] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [showPage, setShowPage] = useState("main");

  useDisableScroll(showVideo);

  const handleSkipTrailer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowVideo(false);
      setIsClosing(false);
    }, 800);
  };

  // Анимация видео-блока
  const videoVariants = {
    initial: {
      opacity: 0,
      scale: 1.1,
      filter: "blur(20px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(20px)",
      transition: {
        duration: 0.8,
        ease: "easeIn",
      },
    },
  };

  // Анимация кнопки
  const buttonVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 2,
        duration: 0.8,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "#fff",
      transition: {
        duration: 0.3,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  // Анимация основного контейнера
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Анимация переключения страниц
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 50,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  // Анимация кнопок навигации
  const navButtonVariants = {
    initial: {
      opacity: 0,
      y: -20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const renderPage = () => {
    switch (showPage) {
      case "main":
        return (
          <motion.div
            key="main-page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Head />
            <Task isSubscribe={isSubscribe} />
          </motion.div>
        );
      case "trailer":
        return (
          <motion.div
            key="trailer-page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Trailer />
          </motion.div>
        );
      case "drawing":
        return (
          <motion.div
            key="drawing-page"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Drawing />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <main className={!showVideo ? style.main : ""}>
      <Header />

      <AnimatePresence mode="wait">
        {showVideo ? (
          <motion.div
            key="video-block"
            className={style.main__video}
            variants={videoVariants}
            initial="initial"
            animate={isClosing ? "exit" : "animate"}
            exit="exit"
          >
            <video autoPlay muted loop playsInline className={style.video}>
              <source src={trailer} type="video/mp4" />
            </video>

            <motion.button
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={handleSkipTrailer}
              className={style.skipButton}
            >
              пропустить заставку
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="content-block"
            className="main__container"
            variants={contentVariants}
            initial="initial"
            animate="animate"
          >
            <div className={style.main__wrapper}>
              {/* Навигация */}
              <motion.nav
                className={style.navigation}
                initial="initial"
                animate="animate"
                transition={{ staggerChildren: 0.1 }}
              >
                <motion.ul>
                  <motion.li variants={navButtonVariants}>
                    <motion.button
                      onClick={() => setShowPage("main")}
                      whileHover="hover"
                      whileTap="tap"
                      className={showPage === "main" ? style.active : ""}
                    >
                      Задания
                    </motion.button>
                  </motion.li>

                  <motion.li variants={navButtonVariants}>
                    <motion.button
                      onClick={() => setShowPage("trailer")}
                      whileHover="hover"
                      whileTap="tap"
                      className={showPage === "trailer" ? style.active : ""}
                    >
                      О фильме
                    </motion.button>
                  </motion.li>

                  <motion.li variants={navButtonVariants}>
                    <motion.button
                      onClick={() => setShowPage("drawing")}
                      whileHover="hover"
                      whileTap="tap"
                      className={showPage === "drawing" ? style.active : ""}
                    >
                      Розыгрыш
                    </motion.button>
                  </motion.li>
                </motion.ul>
              </motion.nav>

              {/* Контент страницы с анимацией */}
              <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Main;
