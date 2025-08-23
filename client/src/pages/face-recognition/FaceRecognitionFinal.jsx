import React, { useEffect } from "react";
import style from "./FaceRecognitionFinal.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Video from "../../components/video/Video";
import {
  containerVariants,
  titleVariants,
  textVariants,
  videoVariants,
  buttonVariants,
  spanVariants,
  animationDelays,
} from "../../animations/face-recognition-final";
import { motion } from "framer-motion";

const FaceRecognitionFinal = ({ finalUserId }) => {
  const location = useLocation();
  const { isWon, correct_item_count } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof isWon !== "boolean") {
      navigate("/face-recognition");
    }
  }, [isWon, navigate]);

  useEffect(() => {
    const completeGame = async () => {
      try {
        await axios.post("/user/complete-game", {
          userId: finalUserId,
          gameName: "first_game",
        });

        return;
      } catch (err) {
        console.log(err);
      }
    };

    completeGame();
  }, []);

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

          <motion.div
            className={style.final__container}
            variants={videoVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: animationDelays.video }}
          >
            <Video />
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

            <Link className={style.final__buttons__last} to="/">
              Другие игры
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default FaceRecognitionFinal;
