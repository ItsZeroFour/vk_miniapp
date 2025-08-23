import React, { useState } from "react";
import style from "./style.module.scss";
import volumeOn from "../../assets/icons/volume_on.svg";
import volumeOff from "../../assets/icons/volume_off.svg";

const ToggleVolume = () => {
  const [isVolumeOn, setIsVolumeOn] = useState(true);

  const toggleVolume = () => {
    setIsVolumeOn((prev) => !prev);
  };

  return (
    <button
      className={`${style.header__volume} ${isVolumeOn ? style.on : style.off}`}
      onClick={toggleVolume}
      aria-label={isVolumeOn ? "Mute" : "Unmute"}
    >
      <div className={style.header__volume__item}>
        <img
          src={isVolumeOn ? volumeOn : volumeOff}
          alt={isVolumeOn ? "volume On" : "volume Off"}
        />
      </div>
    </button>
  );
};

export default ToggleVolume;
