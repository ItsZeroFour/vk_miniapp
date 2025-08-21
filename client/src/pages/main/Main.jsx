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

const Main = () => {
  const [showVideo, setShowVideo] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [showPage, setShowPage] = useState("main");

  useDisableScroll(showVideo);

  const handleSkipTrailer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowVideo(false);
      setIsClosing(false);
    }, 800); // Длительность анимации закрытия
  };

  // Анимация появления видео-блока
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

  // Анимация основного контента
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
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className={!showVideo ? style.main : ""}>
      <AnimatePresence mode="wait">
        <Header />

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
              <nav>
                <ul>
                  <li>
                    <button onClick={() => setShowPage("main")}>Задания</button>
                  </li>

                  <li>
                    <button onClick={() => setShowPage("trailer")}>
                      О фильме
                    </button>
                  </li>

                  <li>
                    <button onClick={() => setShowPage("drawing")}>
                      Розыгрыш
                    </button>
                  </li>
                </ul>
              </nav>

              {showPage === "main" ? (
                <>
                  <Head /> <Task />
                </>
              ) : showPage === "trailer" ? (
                <Trailer />
              ) : (
                <Drawing />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Main;
