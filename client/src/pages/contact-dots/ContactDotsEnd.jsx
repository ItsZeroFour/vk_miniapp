import React, { useEffect } from "react";
import style from "./ContactDotsEnd.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Video from "../../components/video/Video";
import axios from "../../utils/axios";
import bridge from "@vkontakte/vk-bridge";
import useVkEnvironment from "../../hooks/useVkEnvironment";

const ContactDotsEnd = React.memo(({ finalUserId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isMiniApp } = useVkEnvironment();

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
      if (isCompleted) {
        bridge.send("VKWebAppSendCustomEvent", {
          type: "type_action",
          event: "task_done",
          screen: "main",
          timezone: "3gtm",
          json: {
            task: 3,
          },
        });

        if (isMiniApp) {
          const launchParams = await bridge.send("VKWebAppGetLaunchParams");

          const gameResults = {
            isCompleted: isCompleted,
          };

          axios
            .post("/user/complete-third-game", gameResults, {
              params: launchParams,
            })
            .then((response) => {
              if (response.data.success) {
                console.log("Победа засчитана");
              } else {
                console.log("Вы еще не победили");
              }
            });
        } else {
          const gameResults = {
            isCompleted: isCompleted,
          };

          axios
            .post("/user/complete-third-game", gameResults)
            .then((response) => {
              if (response.data.success) {
                console.log("Победа засчитана");
              } else {
                console.log("Вы еще не победили");
              }
            });
        }
      }
    };

    markGameAsComplete();
  }, [finalUserId, isMiniApp]);

  return (
    <section className={style.contact_dots_end}>
      <div className="container">
        <div className={style.contact_dots_end__wrapper}>
          <h1>Вы справились!</h1>

          <p>
            Поздравляем! Все кадры открыты. <br /> А увидеть всю картину можно
            будет во всех кинотеатрах страны. <br /> «Август». Уже в кино
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
                onClick={() => {
                  bridge.send("VKWebAppSendCustomEvent", {
                    type: "type_click",
                    event: "task_repeat",
                    screen: "main",
                    timezone: "3gtm",
                    json: {
                      task: 3,
                    },
                  });

                  if (window.ym) {
                    window.ym(103806192, "reachGoal", "game2_replay");
                  }

                  localStorage.removeItem("progress");
                }}
              >
                НАЧАТЬ ИГРУ ЗАНОВО
              </Link>
              <Link
                to="/"
                onClick={async () => {
                  bridge.send("VKWebAppSendCustomEvent", {
                    type: "type_click",
                    event: "task_other",
                    screen: "main",
                    timezone: "3gtm",
                    json: {
                      task: 3,
                    },
                  });
                }}
                state={{ hiddenVideo: true }}
              >
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
