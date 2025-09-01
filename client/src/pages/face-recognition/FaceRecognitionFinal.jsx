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
import useCompleteGame from "../../hooks/useCompleteGame";

const FaceRecognitionFinal = React.memo(({ finalUserId }) => {
  const location = useLocation();
  const correct_item_count = location.state?.correct_item_count;
  const isWon = location.state?.isWon;

  const completeGame = useCompleteGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof isWon !== "boolean") {
      navigate("/face-recognition");
    }
  }, [isWon, navigate]);

  useEffect(() => {
    const markGameAsComplete = async () => {
      const result = await completeGame(finalUserId, "first_game");

      if (!result.success) {
        console.error("Failed to complete game:", result.error);
      }
    };

    markGameAsComplete();
  }, [finalUserId, completeGame]);

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
            сложнее. Смотри «Август» в кино с 25 сентября.
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
              >
                Начать игру заново
              </Link>

              <Link
                className={style.final__buttons__last}
                to="/"
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
