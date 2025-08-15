import React from "react";
import style from "./main.module.scss";
import Header from "./Header";
import Head from "./Head";
import Task from "./Task";
import Trailer from "./Trailer";
import Footer from "./Footer";

const Main = () => {
  return (
    <main className={style.main}>
      <Header />

      <div className="main__container">
        <div className={style.main__wrapper}>
          <Head />
          <Task />
          <Trailer />
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Main;
