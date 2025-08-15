import React from "react";
import style from "./task.module.scss";
import { Link } from "react-router-dom";

const Task = () => {
  const items = [
    {
      bg: "/images/main/tasks/bg/bg-1.png",
      img: "/images/main/tasks/task-1.png",
      isDone: true,
      title: "игра \\ «распознавание лиц»",
    },

    {
      bg: "/images/main/tasks/bg/bg-2.png",
      img: "/images/main/tasks/task-2.png",
      isDone: false,
      title: "игра \\ «СВОЙ-ЧУЖОЙ»",
    },

    {
      bg: "/images/main/tasks/bg/bg-3.png",
      img: "/images/main/tasks/task-3.png",
      isDone: true,
      title: "игра \\ «ТОЧКИ контакта»",
    },

    {
      bg: "/images/main/tasks/bg/bg-4.png",
      img: "/images/main/tasks/task-4.png",
      isDone: true,
      title: "вопрос \\ на засыпку",
    },

    {
      bg: "/images/main/tasks/bg/bg-5.png",
      img: "/images/main/tasks/task-5.png",
      isDone: true,
      title: "подписка на паблик",
    },

    {
      bg: "/images/main/tasks/bg/bg-6.png",
      img: "/images/main/tasks/task-6.png",
      isDone: false,
      title: "репост записи в группе",
    },
  ];

  return (
    <section className={style.task}>
      <div className="container">
        <div className={style.task__wrapper}>
          <ul>
            {items.map(({ bg, img, isDone, title }) => (
              <Link to="/">
                <li
                  key={title}
                  style={{
                    background: `url(${bg})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className={style.task__top}>
                    <p
                      style={
                        isDone ? { color: "#1BDB65" } : { color: "#A6A9A6" }
                      }
                    >
                      {isDone ? "Выполнено" : "Не выполнено"}
                    </p>
                    <img src={img} alt={title} />
                  </div>

                  <h3 style={{ whiteSpace: "pre-line" }}>
                    {title.replace(/\\/g, "\n")}
                  </h3>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Task;
