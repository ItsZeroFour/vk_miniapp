import React from "react";
import style from "./style.module.scss";
import logo from "../../assets/logo.png";

const Preloader = () => {
  return (
    <main className={style.preloader}>
      <div className="container">
        <section className={style.preloader__wrapper}>
          <div className={style.preloader__img}>
            <img src={logo} alt="logo" />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Preloader;
