import React, { useEffect, useRef, useState } from "react";
import style from "./main.module.scss";
import Header from "../../components/header/Header";
import Head from "./Head";
import Task from "./Task";
import About from "./About";
import Trailer from "./Trailer";
import trailer from "../../assets/videos/trailer.mp4";
import useDisableScroll from "../../hooks/useDisableScroll";
import { motion, AnimatePresence } from "framer-motion";
import Drawing from "./Drawing";
import { useLocation, useNavigate } from "react-router-dom";
import {
  videoVariants,
  buttonVariants,
  contentVariants,
  pageVariants,
  navButtonVariants,
} from "../../animations/main";

function textToBoolean(text) {
  return text.toLowerCase().trim() === "true";
}

const Main = React.memo(
  ({ isSubscribe, isCommented, isShared, user, finalUserId }) => {
    const [showVideo, setShowVideo] = useState(() => {
      const savedValue = localStorage.getItem("showVideo");
      return savedValue !== null ? JSON.parse(savedValue) : true;
    });
    const [isClosing, setIsClosing] = useState(false);
    const [showPage, setShowPage] = useState("main");
    const [hideButton, setHideButton] = useState(false);

    const videoRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    useEffect(() => {
      if (location.state?.hiddenVideo) {
        setShowVideo(false);

        if (location.state) {
          navigate(location.pathname + location.search, {
            replace: true,
            state: {},
          });
        }
      }
    }, [location, navigate]);

    useEffect(() => {
      if (
        searchParams.get("hide_video") &&
        searchParams.get("hide_video") === "true"
      ) {
        setShowVideo(false);

        navigate(location.pathname, { replace: true });
      }
    }, [searchParams]);

    useEffect(() => {
      if (
        (location.state && location.state?.page_type !== undefined) ||
        location.state?.page_type
      ) {
        setShowPage(location.state.page_type);
      } else {
        setShowPage("main");
      }
    }, [location]);

    useEffect(() => {
      localStorage.setItem("showVideo", "false");
    }, []);

    useDisableScroll(showVideo);

    const handleSkipTrailer = () => {
      setIsClosing(true);
      setTimeout(() => {
        setShowVideo(false);
        setIsClosing(false);
      }, 800);
    };

    useEffect(() => {
      if (user) {
        setHideButton(true);
      } else {
        setHideButton(false);
      }
    }, [user]);

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
              <Head hideButton={hideButton} />
              <Task
                isSubscribe={isSubscribe}
                isCommented={isCommented}
                isShared={isShared}
                user={user}
                finalUserId={finalUserId}
              />
              <Trailer src="https://vkvideo.ru/video-217350474_456243968" />
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
              <About />
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

    useEffect(() => {
      const video = videoRef.current;
      if (video) {
        video.muted = true;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay failed, user interaction required:", error);
          });
        }
      }
    }, []);

    return (
      <main className={!showVideo ? style.main : ""}>
        <Header finalUserId={finalUserId} user={user} />

        <AnimatePresence mode="wait">
          {showVideo ? (
            <div className={style.main__video__container}>
              <motion.div
                key="video-block"
                className={style.main__video}
                variants={videoVariants}
                initial="initial"
                animate={isClosing ? "exit" : "animate"}
                exit="exit"
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={style.video}
                >
                  <source src={trailer} type="video/mp4" />
                </video>
              </motion.div>

              <motion.button
                // variants={buttonVariants}
                // initial="initial"
                // animate="animate"
                whileHover="hover"
                whileTap="tap"
                onClick={handleSkipTrailer}
                className={style.skipButton}
              >
                пропустить заставку
              </motion.button>
            </div>
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
  }
);

export default Main;
