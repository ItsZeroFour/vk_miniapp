import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import success from "../../assets/icons/success.svg";
import unsuccess from "../../assets/icons/unsuccess.svg";
import vklogo from "../../assets/icons/vk.svg";
import { motion, AnimatePresence } from "framer-motion";
import {
  popupAnimation,
  wrapperAnimation,
  buttonAnimation,
  contentAnimation,
  iconAnimation,
  DELAYS,
} from "../../animations/popup";
import { Link } from "react-router-dom";
import useSubscriptionStatus from "../../hooks/useSubscriptionStatus";

const TaskPopup = ({
  showPopup,
  onClose,
  finalUserId,
  userId,
  accessToken,
  userData,
  continueOnClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [completeSubscribe, setCompleteSubscribe] = useState(null);

  const subscriptionStatusHook = useSubscriptionStatus();
  const wrapperRef = useRef(null);

  const checkSubscibe = async () => {
    setLoading(true);
    try {
      const isSubscribed = await subscriptionStatusHook.checkSubscription(
        accessToken,
        userId,
        userData
      );

      if (isSubscribed) {
        setCompleteSubscribe(true);
      } else {
        setCompleteSubscribe(false);
      }
    } catch (error) {
      console.error("Ошибка проверки подписки:", error);
      setCompleteSubscribe(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/vk`;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showPopup, onClose]);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div className={style.task__popup} {...popupAnimation}>
          <motion.div
            ref={wrapperRef}
            className={style.task__popup__wrapper}
            {...wrapperAnimation}
          >
            {finalUserId ? (
              <>
                <motion.button
                  className={style.task__popup__close}
                  onClick={() => {
                    setCompleteSubscribe(null);
                    onClose();
                  }}
                  // {...buttonAnimation}
                ></motion.button>

                <motion.p
                  className={style.task__popup__text}
                  // {...contentAnimation}
                  // transition={{
                  // ...contentAnimation.transition,
                  // delay: DELAYS.TEXT,
                  // }}
                >
                  Для выполнения задачи подпишитесь на{" "}
                  <Link to="/">Central Partnership</Link> в VK
                </motion.p>

                {typeof completeSubscribe === "boolean" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {completeSubscribe ? (
                      <p className={style.task__popup__success}>
                        <motion.img
                          src={success}
                          alt="success"
                          // {...iconAnimation}
                        />
                        Задание выполнено
                      </p>
                    ) : (
                      <p className={style.task__popup__unsuccess}>
                        <motion.img
                          src={unsuccess}
                          alt="unsuccess"
                          // {...iconAnimation}
                        />
                        Задание не выполнено
                      </p>
                    )}
                  </motion.div>
                )}

                <motion.button
                  className={style.task__popup__check}
                  onClick={
                    typeof completeSubscribe === "boolean"
                      ? () => {
                          setCompleteSubscribe(null);
                          onClose();
                        }
                      : checkSubscibe
                  }
                  style={loading ? { opacity: 0.5 } : { opacity: 1 }}
                  // whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // {...contentAnimation}
                  // transition={{
                  //   ...contentAnimation.transition,
                  //   delay: DELAYS.CHECK_BUTTON,
                  // }}
                >
                  {typeof completeSubscribe === "boolean"
                    ? "Закрыть"
                    : loading
                    ? "Проверяется..."
                    : "проверить подписку"}
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  className={style.task__popup__close}
                  onClick={onClose}
                  // {...buttonAnimation}
                ></motion.button>

                <motion.p
                  className={style.task__popup__text}
                  {...contentAnimation}
                  transition={{
                    ...contentAnimation.transition,
                    delay: DELAYS.TEXT,
                  }}
                >
                  войДИТЕ для участия в конкурсе
                </motion.p>

                <motion.button
                  className={style.task__popup__auth}
                  onClick={handleRedirect}
                  // whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // {...contentAnimation}
                  // transition={{
                  //   ...contentAnimation.transition,
                  //   delay: DELAYS.BUTTONS,
                  // }}
                >
                  <img src={vklogo} alt="vklogo" /> Войти через VK
                </motion.button>

                <motion.button
                  className={style.task__popup__continue}
                  onClick={continueOnClick}
                  // whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  // {...contentAnimation}
                  // transition={{
                  //   ...contentAnimation.transition,
                  //   delay: DELAYS.CHECK_BUTTON,
                  // }}
                >
                  Играть без призов
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskPopup;
