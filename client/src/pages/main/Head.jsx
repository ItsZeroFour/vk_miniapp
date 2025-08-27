import React from "react";
import style from "./head.module.scss";
import { motion } from "framer-motion";
import vklogo from "../../assets/icons/vk.svg";
import {
  titleVariants,
  textVariants,
  buttonVariants,
} from "../../animations/main-head";
import useVkEnvironment from "../../hooks/useVkEnvironment";

const Head = React.memo(({ hideButton }) => {
  const { environment } = useVkEnvironment();

  const handleRedirect = () => {
    window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/vk`;
  };

  return (
    <section className={style.head}>
      <div className={style.head__wrapper}>
        <div className={style.head__top}>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={titleVariants}
            className={style.animatedTitle}
          >
            Курсы разведчика
          </motion.h1>
          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className={style.head__text__desctop}
          >
            Каждое выполненное задание приближает героев к цели, <br /> а вас к
            заслуженной награде!
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className={style.head__text__mobile}
          >
            Каждое выполненное задание приближает героев <br /> к цели, а вас к
            заслуженной награде!
          </motion.p>
        </div>

        {environment === "web" && (
          <div className={style.head__auth}>
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {!hideButton
                ? "войДИТЕ для участия в конкурсе"
                : "ВЫ АВТОРИЗОВАНЫ"}
            </motion.h4>
            {!hideButton && (
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleRedirect}
              >
                <img src={vklogo} alt="vklogo" />
                Войти через VK
              </motion.button>
            )}
          </div>
        )}
      </div>
    </section>
  );
});

export default Head;
