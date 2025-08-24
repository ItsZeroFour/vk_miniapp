import React, { useState } from "react";
import style from "./task.module.scss";
import { useNavigate } from "react-router-dom";
import useDisableScroll from "../../hooks/useDisableScroll";
import useUser from "../../hooks/useUser";
import useVKAuth from "../../hooks/useVKAuth";
import TaskPopup from "../../components/task-popup/TaskPopup";

const Task = ({ isSubscribe, isCommented, isShared, user, finalUserId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [navigateItemClick, setNavigateItemClick] = useState("");
  const navigate = useNavigate();

  const { userId, userData } = useUser();
  const { accessToken } = useVKAuth(userId);

  const items = [
    {
      bg: "/images/main/tasks/bg/bg-1.png",
      img: "/images/main/tasks/task-1.png",
      isDone: user?.gamesComplete.first_game,
      title: "игра \\ «распознавание лиц»",
      path: "/face-recognition",
    },
    {
      bg: "/images/main/tasks/bg/bg-2.png",
      img: "/images/main/tasks/task-2.png",
      isDone: user?.gamesComplete.second_game,
      title: "игра \\ «СВОЙ-ЧУЖОЙ»",
      path: "/friend-or-foe",
    },
    {
      bg: "/images/main/tasks/bg/bg-3.png",
      img: "/images/main/tasks/task-3.png",
      isDone: user?.gamesComplete.third_game,
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

  const continueOnClick = () => {
    navigate(navigateItemClick);
  };

  return (
    <section className={style.task}>
      <TaskPopup
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
        finalUserId={finalUserId}
        userId={userId}
        accessToken={accessToken}
        userData={userData}
        continueOnClick={continueOnClick}
      />

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
                  setNavigateItemClick(path);
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
