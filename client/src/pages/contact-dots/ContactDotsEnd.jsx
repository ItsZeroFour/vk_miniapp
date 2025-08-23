import React, { useEffect } from "react";
import style from "./ContactDotsEnd.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Video from "../../components/video/Video";
import axios from "../../utils/axios";

const ContactDotsEnd = ({ finalUserId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCompleted = location?.state?.isCompleted;

  useEffect(() => {
    if (isCompleted === undefined || (isCompleted === null && !isCompleted)) {
      return navigate("/");
    }
  }, []);

  useEffect(() => {
    const completeGame = async () => {
      try {
        await axios.post("/user/complete-game", {
          userId: finalUserId,
          gameName: "third_game",
        });

        return;
      } catch (err) {
        console.log(err);
      }
    };

    completeGame();
  }, []);

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

          <div className={style.contact_dots_end__video}>
            <Video />
          </div>

          <div className={style.contact_dots_end__buttons}>
            <Link to="/contact-dots">НАЧАТЬ ИГРУ ЗАНОВО</Link>
            <Link to="/">ДРУГИЕ ИГРЫ</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactDotsEnd;
