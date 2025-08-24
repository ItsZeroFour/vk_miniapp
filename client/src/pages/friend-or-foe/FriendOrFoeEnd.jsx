import React, { useEffect } from "react";
import style from "./FriendOrFoeEnd.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { items } from "../../data/friend-or-foe";
import Video from "../../components/video/Video";
import axios from "../../utils/axios";

const FriendOrFoeEnd = ({ finalUserId }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const answers = location.state?.answers;
  const isEnd = location.state?.isEnd;

  useEffect(() => {
    if (!isEnd) {
      return navigate("/");
    }
  }, [isEnd, navigate]);

  const friendCount =
    answers && answers.filter((answer) => answer.isFriend === true).length;

  useEffect(() => {
    const completeGame = async () => {
      try {
        await axios.post("/user/complete-game", {
          userId: finalUserId,
          gameName: "second_game",
        });

        return;
      } catch (err) {
        console.log(err);
      }
    };

    completeGame();
  }, [finalUserId]);

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
