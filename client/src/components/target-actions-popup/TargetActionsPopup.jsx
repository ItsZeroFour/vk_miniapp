import React, { useEffect, useRef } from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
import useCommentStatus from "../../hooks/useCommentStatus";
import useSubscriptionStatus from "../../hooks/useSubscriptionStatus";
import useRepostStatus from "../../hooks/useRepostStatus";
import success from "../../assets/icons/success.svg";

const TargetActionsPopup = ({
  targetAction,
  setOpenTargetActionModel,
  link,
  accessToken,
  finalUserId,
  userData,
}) => {
  const isCommented = useCommentStatus(accessToken, finalUserId, userData);
  const isSubscribe = useSubscriptionStatus(accessToken, finalUserId, userData);
  const isShared = useRepostStatus(accessToken, finalUserId, userData);

  const wrapperRef = useRef(null);

  console.log(isCommented, isSubscribe, isShared);

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

  return (
    <section className={style.target_actions}>
      <div className="container">
        <div className={style.target_actions__wrapper} ref={wrapperRef}>
          <button
            className={style.target_actions__close}
            onClick={() => setOpenTargetActionModel("")}
          ></button>

          {(targetAction === "comment" && !isCommented) ||
          (targetAction === "subscribe" && !isSubscribe) ||
          (targetAction === "share" && !isShared) ? (
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

              <button className={style.target_actions__check}>Проверить</button>
            </>
          ) : (
            <>
              <p className={style.target_actions__success}>
                <img src={success} alt="success" />
                Задание выполнено
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TargetActionsPopup;
