import React from "react";
import style from "./FaceRecognitionHome.module.scss";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  titleVariants,
  textVariants,
  scrollerVariants,
  buttonVariants,
  itemVariants,
  animationDelays,
} from "../../animations/face-recognition-home";

const FaceRecognitionHome = React.memo(() => {
  const images = [
    {
      path: "/images/face-recognition/1.jpg",
    },

    {
      path: "/images/face-recognition/2.jpg",
    },

    {
      path: "/images/face-recognition/3.jpg",
    },

    {
      path: "/images/face-recognition/4.jpg",
    },

    {
      path: "/images/face-recognition/5.jpg",
    },

    {
      path: "/images/face-recognition/6.jpg",
    },

    {
      path: "/images/face-recognition/7.jpg",
    },
  ];

  const doubledImages = [...images, ...images, ...images, ...images];

  return (
    <section className={style.home}>
      <div className="containe">
        <div className={style.home__wrapper}>
          <motion.h1
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: animationDelays.title }}
          >
            Распознавание ЛИЦ
          </motion.h1>
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: animationDelays.firstText }}
          >
            Каждый оперативник СМЕРШ хранил в голове целую картотеку. Лица.
            Глаза. Брови. Носы. Губы. Уши. Особые приметы.
          </motion.p>

          <div className={style.scroller}>
            <motion.ul variants={scrollerVariants} animate="animate">
              {doubledImages.map(({ path }, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    delay: animationDelays.scroller + index * 0.05,
                  }}
                >
                  <img src={path} alt="face" />
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            className={style.home__text}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: animationDelays.secondText }}
          >
            <p>
              Они тренировались запоминать лица, которые видели лишь мельком, и
              безошибочно узнавать их среди множества других. Теперь вы тоже
              можете пройти такой курс. <br />
              Вы увидите несколько портретов, каждый по 3 секунды: найдите и
              отметьте их среди других лиц.
            </p>
          </motion.div>

          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: animationDelays.button }}
            className={style.home__link}
          >
            <Link
              to="/face-recognition/game"
              onClick={async () => {
                if (window.ym) {
                  await window.ym(103806192, "reachGoal", "game1_start");
                }
              }}
            >
              Начать игру
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default FaceRecognitionHome;
