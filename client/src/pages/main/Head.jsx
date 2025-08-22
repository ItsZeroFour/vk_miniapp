import React from "react";
import style from "./head.module.scss";
import { motion } from "framer-motion";
import vklogo from "../../assets/icons/vk.svg";
import { isVkMiniApp } from "../../utils/isVkMiniApp";

const Head = () => {
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3 } },
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
  };

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
          <motion.p initial="hidden" animate="visible" variants={textVariants}>
            Каждое выполненное задание приближает героев к цели, а вас к
            заслуженной награде!
          </motion.p>
        </div>

        {!isVkMiniApp() && (
          <div className={style.head__auth}>
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              войДИТЕ для участия в конкурсе
            </motion.h4>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleRedirect}
            >
              <img src={vklogo} alt="vklogo" />
              Войти через VK
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Head;
