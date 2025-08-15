import React from "react";
import style from "./trailer.module.scss";

const Trailer = () => {
  return (
    <section className={style.trailer}>
      <div className={style.trailer__wrapper}>
        <h3>«Август» в кино с 25 сентября</h3>

        <div className={style.trailer__video}>
          <iframe
            src="https://vkvideo.ru/video_ext.php?oid=-211437014&id=456246667&hd=2&autoplay=1"
            width="100%"
            height="620"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Trailer;
