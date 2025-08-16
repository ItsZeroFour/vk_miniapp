import React from "react";
import style from "./FriendOrFoeEnd.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { items } from "../../data/friend-or-foe";
import Video from "../../components/video/Video";

const FriendOrFoeEnd = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { answers, isEnd } = location.state;

  if (!isEnd) {
    // return navigate("/");
  }

  const friendCount = answers.filter(
    (answer) => answer.isFriend === true
  ).length;

  console.log(answers);

  return (
    <section className={style.end}>
      <div className="container">
        <div className={style.end__wrapper}>
          <div className={style.end__top}>
            <h1>
              {friendCount < items.length ? "Вы ошиблись!" : "Вы справились!"}
            </h1>

            {friendCount < items.length ? (
              <p>
                Вы отгадали <span>{friendCount} из 7</span> человек. Проверьте
                себя в кино с 25 сентября!
              </p>
            ) : (
              <p>
                <span>7 из 7!</span> <br /> Враг не пройдёт!
              </p>
            )}
          </div>

          <div className={style.end__video}>
            <Video />
          </div>

          <div className={style.end__buttons}>
            <Link to="/friend-or-foe/start">Начать игру заново</Link>
            <Link to="/">Вернуться в главное меню</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FriendOrFoeEnd;
