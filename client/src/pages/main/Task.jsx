import React, { useState } from "react";
import style from "./task.module.scss";
import { Link, useNavigate } from "react-router-dom";
import useDisableScroll from "../../hooks/useDisableScroll";
import useUser from "../../hooks/useUser";
import useVKAuth from "../../hooks/useVKAuth";
import useSubscriptionStatus from "../../hooks/useSubscriptionStatus";
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

const Task = ({ isSubscribe, isCommented, isShared, user, finalUserId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { userId, userData } = useUser();
  const { accessToken } = useVKAuth(userId);
  const [loading, setLoading] = useState(false);
  const [completeSubscribe, setCompleteSubscribe] = useState(null);
  const [navigateItemClick, setNavigateItemClick] = useState("");

  const subscriptionStatusHook = useSubscriptionStatus();

  const items = [
    {
      bg: "/images/main/tasks/bg/bg-1.png",
      img: "/images/main/tasks/task-1.png",
      isDone: user.gamesComplete.first_game,
      title: "игра \\ «распознавание лиц»",
      path: "/face-recognition",
    },

    {
      bg: "/images/main/tasks/bg/bg-2.png",
      img: "/images/main/tasks/task-2.png",
      isDone: user.gamesComplete.second_game,
      title: "игра \\ «СВОЙ-ЧУЖОЙ»",
      path: "/friend-or-foe",
    },

    {
      bg: "/images/main/tasks/bg/bg-3.png",
      img: "/images/main/tasks/task-3.png",
      isDone: user.gamesComplete.third_game,
      title: "игра \\ «ТОЧКИ контакта»",
      path: "/contact-dots",
    },

    {
      bg: "/images/main/tasks/bg/bg-4.png",
      img: "/images/main/tasks/task-4.png",
      isDone: isCommented,
      title: "вопрос \\ на засыпку",
      path: "/contact-dots",
    },

    {
      bg: "/images/main/tasks/bg/bg-5.png",
      img: "/images/main/tasks/task-5.png",
      isDone: isSubscribe,
      title: "подписка на паблик",
      path: "/contact-dots",
    },

    {
      bg: "/images/main/tasks/bg/bg-6.png",
      img: "/images/main/tasks/task-6.png",
      isDone: isShared,
      title: "репост записи в группе",
      path: "/contact-dots",
    },
  ];

  const handleItemClick = (item, e) => {
    e.preventDefault();

    if (isSubscribe) {
      navigate(item.path);
    } else {
      setShowPopup(true);
    }
  };

  useDisableScroll(showPopup);

  const closePopup = () => {
    setShowPopup(false);
    setCompleteSubscribe(null);
  };

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

  const navigateItem = (itemPath) => {
    setNavigateItemClick(itemPath);
  };

  const continueOnClick = () => {
    navigate(navigateItemClick);
  };

  const handleRedirect = () => {
    window.location.href = `${process.env.REACT_APP_SERVER_URL}/auth/vk`;
  };

  return (
    <section className={style.task}>
      <AnimatePresence>
        {showPopup && (
          <motion.div className={style.task__popup} {...popupAnimation}>
            <motion.div
              className={style.task__popup__wrapper}
              {...wrapperAnimation}
            >
              {finalUserId ? (
                <>
                  <motion.button
                    className={style.task__popup__close}
                    onClick={closePopup}
                    {...buttonAnimation}
                  ></motion.button>

                  <motion.p
                    className={style.task__popup__text}
                    {...contentAnimation}
                    transition={{
                      ...contentAnimation.transition,
                      delay: DELAYS.TEXT,
                    }}
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
                            {...iconAnimation}
                          />
                          Задание выполнено
                        </p>
                      ) : (
                        <p className={style.task__popup__unsuccess}>
                          <motion.img
                            src={unsuccess}
                            alt="unsuccess"
                            {...iconAnimation}
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
                        ? closePopup
                        : checkSubscibe
                    }
                    style={loading ? { opacity: 0.5 } : { opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    {...contentAnimation}
                    transition={{
                      ...contentAnimation.transition,
                      delay: DELAYS.CHECK_BUTTON,
                    }}
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
                    onClick={closePopup}
                    {...buttonAnimation}
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    {...contentAnimation}
                    transition={{
                      ...contentAnimation.transition,
                      delay: DELAYS.BUTTONS,
                    }}
                  >
                    <img src={vklogo} alt="vklogo" /> Войти через VK
                  </motion.button>

                  <motion.button
                    className={style.task__popup__continue}
                    onClick={continueOnClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    {...contentAnimation}
                    transition={{
                      ...contentAnimation.transition,
                      delay: DELAYS.CHECK_BUTTON,
                    }}
                  >
                    Играть без призов
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        <div className={style.task__wrapper}>
          <ul>
            {items.map(({ bg, img, isDone, title, path }) => (
              <li
                key={title}
                style={{
                  background: `url(${bg})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  navigateItem(path);
                  handleItemClick({ path }, e);
                }}
              >
                <div className={style.task__top}>
                  <p
                    style={isDone ? { color: "#1BDB65" } : { color: "#A6A9A6" }}
                  >
                    {isDone ? "Выполнено" : "Не выполнено"}
                  </p>
                  <img src={img} alt={title} />
                </div>

                <h3 style={{ whiteSpace: "pre-line" }}>
                  {title.replace(/\\/g, "\n")}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Task;
