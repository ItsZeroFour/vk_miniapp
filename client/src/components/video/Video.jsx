import React from "react";
import style from "./style.module.scss";
import { useState, useRef, useEffect } from "react";

const Video = ({ src }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);
  const iframeRef = useRef(null);

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

  const handleClick = () => {
    setIsPlaying(true);
  };

  const cleanSrc = src
    ? src.replace("autoplay=1", "autoplay=0")
    : "https://vkvideo.ru/video_ext.php?oid=-232235882&id=456239021&hd=2&autoplay=0";

  const videoSrc = isPlaying
    ? cleanSrc.replace("autoplay=0", "autoplay=1")
    : cleanSrc;

  return (
    <div className={style.video__container} ref={ref}>
      {isVisible && (
        <div className={style.videoWrapper} onClick={handleClick}>
          <iframe
            ref={iframeRef}
            className={style.video}
            src={videoSrc}
            width="100%"
            allow="encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameBorder="0"
            allowFullScreen
            title="Август"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default Video;
