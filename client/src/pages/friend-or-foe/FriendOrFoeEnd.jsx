import React, { useEffect } from "react";
import style from "./FriendOrFoeEnd.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { items } from "../../data/friend-or-foe";
import Video from "../../components/video/Video";
import useCompleteGame from "../../hooks/useCompleteGame";

const FriendOrFoeEnd = React.memo(({ finalUserId }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const completeGame = useCompleteGame();

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
    const markGameAsComplete = async () => {
      const result = await completeGame(finalUserId, "second_game");

      if (!result.success) {
        console.error("Failed to complete game:", result.error);
      }
    };

    markGameAsComplete();
  }, [finalUserId, completeGame]);

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
});

export default FriendOrFoeEnd;
