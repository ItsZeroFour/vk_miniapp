import React from "react";
import style from "./style.module.scss";
import { useState, useRef, useEffect } from "react";

const Video = ({ src }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={style.video__container} ref={ref}>
      {isVisible && (
        <iframe
          className={style.video}
          src={src || "https://vkvideo.ru/video_ext.php?oid=-232235882&id=456239021&hd=2&autoplay=1"}
          width="100%"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
          frameborder="0"
          allowfullscreen
          title="Август"
        ></iframe>
      )}
    </div>
  );
};

export default Video;
