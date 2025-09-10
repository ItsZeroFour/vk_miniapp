import React, { useEffect, useRef } from "react";
import style from "./home.module.scss";
import { Link } from "react-router-dom";
import video from "../../assets/videos/friend-or-foe.mp4";

const FriendOrFoe = React.memo(() => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay failed, user interaction required:", error);
        });
      }
    }
  }, []);

  return (
    <section className={style.friend_or_foe}>
      <div className="container">
        <div className={style.friend_or_foe__wrapper}>
          <div className={style.friend_or_foe__top}>
            <h1>СВОЙ-ЧУЖОЙ</h1>
            <p>Задача СМЕРШа – делать неочевидное очевидным</p>
          </div>

          <div className={style.friend_or_foe__main}>
            <video
              className={style.friend_or_foe__img}
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={video} type="video/mp4" />
            </video>

            <p>
              А вы сможете определить, кто здесь – свой, а кто – чужой?
              Полагайтесь на интуицию! Прошли вы тест или нет – узнаете в конце.
            </p>

            <Link
              className={style.friend_or_foe__start}
              to="/friend-or-foe/start"
              onClick={async () => {
                if (window.ym) {
                  await window.ym(103806192, "reachGoal", "game3_start");
                }
              }}
            >
              Начать игру
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

export default FriendOrFoe;
