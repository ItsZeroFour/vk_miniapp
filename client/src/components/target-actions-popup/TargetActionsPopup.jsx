import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import useCommentStatus from "../../hooks/useCommentStatus";
import useSubscriptionStatus from "../../hooks/useSubscriptionStatus";
import useRepostStatus from "../../hooks/useRepostStatus";
import success from "../../assets/icons/success.svg";
import unsuccess from "../../assets/icons/unsuccess.svg";

const TargetActionsPopup = ({
  targetAction,
  setOpenTargetActionModel,
  link,
  accessToken,
  finalUserId,
  userData,
}) => {
  const { isCommented, refresh: refreshComments } = useCommentStatus(
    accessToken,
    finalUserId,
    userData
  );
  const { isShared, refresh: refreshRepost } = useRepostStatus(
    accessToken,
    finalUserId,
    userData
  );
  const { isSubscribe, refresh: refreshSubscribe } = useSubscriptionStatus(
    accessToken,
    finalUserId,
    userData
  );

  const [checkResult, setCheckResult] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenTargetActionModel("");
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenTargetActionModel("");
      }
    };

    if (targetAction) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [targetAction, setOpenTargetActionModel]);

  const handleCheck = () => {
    if (targetAction === "comment") refreshComments();
    if (targetAction === "subscribe") refreshSubscribe();
    if (targetAction === "share") refreshRepost();

    setCheckResult(true);
  };

  const isDone =
    (targetAction === "comment" && isCommented) ||
    (targetAction === "subscribe" && isSubscribe) ||
    (targetAction === "share" && isShared);

  return (
    <section className={style.target_actions}>
      <div className="container">
        <div className={style.target_actions__wrapper} ref={wrapperRef}>
          <button
            className={style.target_actions__close}
            onClick={() => setOpenTargetActionModel("")}
          ></button>

          {!checkResult &&
          ((targetAction === "comment" && !isCommented) ||
            (targetAction === "subscribe" && !isSubscribe) ||
            (targetAction === "share" && !isShared)) ? (
            <>
              <p className={style.target_actions__text}>
                {targetAction === "subscribe" ? (
                  <>
                    Для выполнения задачи подпишитесь на{" "}
                    <Link to={link} target="_blank">
                      Central Partnership
                    </Link>{" "}
                    в VK
                  </>
                ) : targetAction === "comment" ? (
                  <>
                    Для выполнения задачи оставьте комментарий в{" "}
                    <Link to={link} target="_blank">
                      Central Partnership
                    </Link>{" "}
                    в VK
                  </>
                ) : (
                  <>
                    Для выполнения задачи поделитесь записью{" "}
                    <Link to={link} target="_blank">
                      Central Partnership
                    </Link>{" "}
                    в VK
                  </>
                )}
              </p>

              <button
                className={style.target_actions__check}
                onClick={handleCheck}
              >
                Проверить
              </button>
            </>
          ) : (
            <>
              {checkResult && !isDone ? (
                <p className={style.target_actions__unsuccess}>
                  <img src={unsuccess} alt="unsuccess" />
                  Задание не выполнено
                </p>
              ) : (
                <p className={style.target_actions__success}>
                  <img src={success} alt="success" />
                  Задание выполнено
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TargetActionsPopup;
