import React, { useState } from "react";
import style from "./task.module.scss";
import { useNavigate } from "react-router-dom";
import useDisableScroll from "../../hooks/useDisableScroll";
import useUser from "../../hooks/useUser";
import useVKAuth from "../../hooks/useVKAuth";
import TaskPopup from "../../components/task-popup/TaskPopup";
import TargetActionsPopup from "../../components/target-actions-popup/TargetActionsPopup";
import useCommentStatus from "../../hooks/useCommentStatus";
import useSubscriptionStatus from "../../hooks/useSubscriptionStatus";
import useRepostStatus from "../../hooks/useRepostStatus";

const Task = React.memo(({ user, finalUserId }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [navigateItemClick, setNavigateItemClick] = useState("");
  const [openTargetActionModel, setOpenTargetActionModel] = useState("");
  const navigate = useNavigate();

  const { userId, userData } = useUser();
  const { accessToken } = useVKAuth(userId);

  const isCommented = useCommentStatus(accessToken, finalUserId, user);
  const isSubscribe = useSubscriptionStatus(accessToken, finalUserId, user);
  const isShared = useRepostStatus(accessToken, finalUserId, user);

  const items = [
    {
      bg: "/images/main/tasks/bg/bg-1.webp",
      img: "/images/main/tasks/task-1.webp",
      isDone: user?.gamesComplete?.first_game,
      title: "игра \\ «распознавание лиц»",
      path: "/face-recognition",
    },
    {
      bg: "/images/main/tasks/bg/bg-2.webp",
      img: "/images/main/tasks/task-2.webp",
      isDone: user?.gamesComplete?.second_game,
      title: "игра \\ «СВОЙ-ЧУЖОЙ»",
      path: "/friend-or-foe",
    },
    {
      bg: "/images/main/tasks/bg/bg-3.webp",
      img: "/images/main/tasks/task-3.webp",
      isDone: user?.gamesComplete?.third_game,
      title: "игра \\ «ТОЧКИ контакта»",
      path: "/contact-dots",
    },
    {
      bg: "/images/main/tasks/bg/bg-4.webp",
      img: "/images/main/tasks/task-4.png",
      isDone: isCommented,
      title: "вопрос \\ на засыпку",
      path: "https://vk.com/club232395157?from=groups&w=wall-232395157_1",
    },
    {
      bg: "/images/main/tasks/bg/bg-5.webp",
      img: "/images/main/tasks/task-5.png",
      isDone: isSubscribe,
      title: "подписка на паблик",
      path: "https://vk.com/club232395157",
    },
    {
      bg: "/images/main/tasks/bg/bg-6.webp",
      img: "/images/main/tasks/task-6.png",
      isDone: isShared,
      title: "репост записи в группе",
      path: "https://vk.com/club232395157?from=groups&w=wall-232395157_2",
    },
  ];

  const handleItemClick = (item, e) => {
    e.preventDefault();

    if (finalUserId) {
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

      {openTargetActionModel && (
        <TargetActionsPopup
          targetAction={openTargetActionModel}
          isSubscribe={isSubscribe}
          isCommented={isCommented}
          isShared={isShared}
          finalUserId={finalUserId}
          userData={user}
          accessToken={accessToken}
          setOpenTargetActionModel={setOpenTargetActionModel}
          link={
            openTargetActionModel === "subscribe"
              ? items[4].path
              : openTargetActionModel === "comment"
              ? items[3].path
              : items[5].path
          }
        />
      )}

      <div className="container">
        <div className={style.task__wrapper}>
          <ul>
            {items.map(({ bg, img, isDone, title, path }, index) => (
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
                  if (index < 3) {
                    setNavigateItemClick(path);
                    handleItemClick({ path }, e);
                  } else {
                    setOpenTargetActionModel(
                      index === 3
                        ? "comment"
                        : index === 4
                        ? "subscribe"
                        : "share"
                    );
                  }
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
});

export default Task;
