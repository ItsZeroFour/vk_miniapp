import React from "react";
import style from "./home.module.scss";
import { Link } from "react-router-dom";

const Home = ({ isCommented, isSubscribe, isShared }) => {
  return (
    <section className={style.home}>
      <div className="container">
        <div className={style.home__wrapper}>
          <Link to="/face-recognition/game">Игра 1</Link>
        </div>
        {/* <div className={style.home__wrapper}>
          <Link
            style={
              isCommented ? { background: "red" } : { background: "#0084ff" }
            }
            to={
              !isCommented && "https://vk.com/club231935383?w=wall-231935383_1"
            }
            target="_blank"
          >
            Оставить комментарий под постом
          </Link>
          <Link
            style={
              isSubscribe ? { background: "red" } : { background: "#0084ff" }
            }
            to={!isSubscribe && "https://vk.com/club231935383"}
            target="_blank"
          >
            Подписаться на группу
          </Link>
          <Link
            style={
              isShared ? { background: "red" } : { background: "#0084ff" }
            }
            to={
              !isShared && "https://vk.com/club231935383?w=wall-231935383_1"
            }
            target="_blank"
          >
            Репост поста
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default Home;
