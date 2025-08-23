import React from "react";
import style from "./ContactDots.module.scss";
import StarAnimation from "../../components/star-animation/StarAnimation";
import { Link } from "react-router-dom";

const ContactDots = () => {
  return (
    <section className={style.contact_dots}>
      <div className="container">
        <div className={style.contact_dots__wrapper}>
          <div className={style.contact_dots__top}>
            <h1>ТОЧКИ КОНТАКТА</h1>
            <p>
              Главное в расследовании – определить ключевые точки поиска. А
              потом – установить между ними правильные связи.
            </p>
          </div>

          <div className={style.contact_dots__animation}>
            <div className={style.svg_wrap}>
              <StarAnimation />
            </div>
          </div>

          <p className={style.contact_dots__text}>
            И только тогда вам откроется полная картина.
          </p>

          <Link className={style.contact_dots__link} to="/contact-dots/game">
            Начать игру
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactDots;
