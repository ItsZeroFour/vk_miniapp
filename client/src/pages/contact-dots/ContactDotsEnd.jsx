import React, { useEffect } from "react";
import style from "./ContactDotsEnd.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Video from "../../components/video/Video";
import useCompleteGame from "../../hooks/useCompleteGame";

const ContactDotsEnd = React.memo(({ finalUserId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const completeGame = useCompleteGame();

  const isCompleted = location.state?.isCompleted;

  useEffect(() => {
    if (isCompleted === undefined || (isCompleted === null && !isCompleted)) {
      return navigate("/");
    } else {
      if (window.ym) {
        window.ym(103806192, "reachGoal", "game2_success");
      }
    }
  }, [isCompleted, navigate]);

  useEffect(() => {
    const markGameAsComplete = async () => {
      const result = await completeGame(finalUserId, "third_game");

      if (!result.success) {
        console.error("Failed to complete game:", result.error);
      }
    };

    markGameAsComplete();
  }, [finalUserId, completeGame]);

  return (
    <section className={style.contact_dots_end}>
      <div className="container">
        <div className={style.contact_dots_end__wrapper}>
          <h1>Вы справились!</h1>

          <p>
            Поздравляем! Все кадры открыты. <br /> А увидеть всю картину можно
            будет во всех кинотеатрах страны. <br /> «Август» - в кино с 25
            сентября.
          </p>

          <div className={style.contact_dots_end__main}>
            <div className={style.contact_dots_end__video}>
              <Video
                src={
                  "https://vkvideo.ru/video_ext.php?oid=-217350474&id=456243968&hd=2&autoplay=1"
                }
              />
            </div>

            <div className={style.contact_dots_end__buttons}>
              <Link
                to="/contact-dots"
                onClick={async () => {
                  if (window.ym) {
                    await window.ym(103806192, "reachGoal", "game2_replay");
                  }

                  localStorage.removeItem("progress");
                }}
              >
                НАЧАТЬ ИГРУ ЗАНОВО
              </Link>
              <Link to="/" state={{ hiddenVideo: true }}>
                ДРУГИЕ ИГРЫ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactDotsEnd;
