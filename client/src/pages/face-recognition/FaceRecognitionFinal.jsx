import React, { useEffect } from "react";
import style from "./FaceRecognitionFinal.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Video from "../../components/video/Video";
import {
  containerVariants,
  titleVariants,
  textVariants,
  videoVariants,
  spanVariants,
  animationDelays,
} from "../../animations/face-recognition-final";
import { motion } from "framer-motion";
import axios from "../../utils/axios";
import bridge from "@vkontakte/vk-bridge";
import useVkEnvironment from "../../hooks/useVkEnvironment";

const FaceRecognitionFinal = React.memo(({ finalUserId }) => {
  const location = useLocation();
  const correct_item_count = location.state?.correct_item_count;
  const isWon = location.state?.isWon;

  const navigate = useNavigate();

  const { isMiniApp } = useVkEnvironment();

  useEffect(() => {
    if (typeof isWon !== "boolean") {
      navigate("/face-recognition");
    }
  }, [isWon, navigate]);

  useEffect(() => {
    const markGameAsComplete = async () => {
      if (isWon) {
        if (isMiniApp) {
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");

          const gameResults = {
            isWon: isWon,
            current_item_count: correct_item_count,
          };

          axios
            .post("/user/complete-first-game", gameResults, {
              params: launchParams,
            })
            .then((response) => {
              if (response.data.success) {
                console.log("Победа засчитана");
              } else {
                console.log("Вы еще не победили");
              }
            });
        } else {
          const gameResults = {
            isWon: isWon,
            current_item_count: correct_item_count,
          };

          axios
            .post("/user/complete-first-game", gameResults)
            .then((response) => {
              if (response.data.success) {
                console.log("Победа засчитана");
              } else {
                console.log("Вы еще не победили");
              }
            });
        }
      }
    };

    markGameAsComplete();
  }, [finalUserId, isMiniApp]);

  // YM
  useEffect(() => {
    if (isWon) {
      bridge.send("VKWebAppSendCustomEvent", {
        type: "type_action",
        event: "task_done",
        screen: "main",
        timezone: "3gtm",
        json: {
          task: 1,
        },
      });

      if (window.ym) {
        window.ym(103806192, "reachGoal", "game1_success");
      }
    } else {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game1_fail");
      }
    }
  }, []);

  const videoSrc = isWon
    ? "https://vkvideo.ru/video_ext.php?oid=-232235882&id=456239018&hd=2&autoplay=1"
    : "https://vkvideo.ru/video_ext.php?oid=-232235882&id=456239020&hd=2&autoplay=1";

  return (
    <motion.section
      className={style.final}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container">
        <div className={style.final__wrapper}>
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: animationDelays.title }}
          >
            {isWon ? "Вы справились!" : "Вы ошиблись!"}
          </motion.h1>

          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: animationDelays.text }}
          >
            <motion.span
              variants={spanVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: animationDelays.span }}
            >
              {correct_item_count} из 3!
            </motion.span>{" "}
            <br /> Это была лишь тренировка. В настоящем деле всё намного
            сложнее. Смотри «Август». Уже в кино
          </motion.p>

          <div className={style.final__main}>
            <motion.div
              className={style.final__container}
              variants={videoVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: animationDelays.video }}
            >
              <Video src={videoSrc} />
            </motion.div>

            <motion.div
              className={style.final__buttons}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: animationDelays.buttons }}
            >
              <Link
                className={style.final__buttons__first}
                to="/face-recognition"
                onClick={async () => {
                  await bridge.send("VKWebAppSendCustomEvent", {
                    type: "type_click",
                    event: "task_repeat",
                    screen: "main",
                    timezone: "3gtm",
                    json: {
                      task: 1,
                    },
                  });

                  if (window.ym) {
                    await window.ym(103806192, "reachGoal", "game1_replay");
                  }
                }}
              >
                Начать игру заново
              </Link>

              <Link
                className={style.final__buttons__last}
                to="/"
                onClick={async () => {
                  bridge.send("VKWebAppSendCustomEvent", {
                    type: "type_click",
                    event: "task_other",
                    screen: "main",
                    timezone: "3gtm",
                    json: {
                      task: 1,
                    },
                  });
                }}
                state={{ hiddenVideo: true }}
              >
                Другие игры
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default FaceRecognitionFinal;
