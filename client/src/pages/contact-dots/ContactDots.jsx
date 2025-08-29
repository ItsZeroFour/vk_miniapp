import React, { useEffect, useRef } from "react";
import style from "./ContactDots.module.scss";
import { Link } from "react-router-dom";
import lottie from "lottie-web";

const ContactDots = React.memo(() => {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../../assets/animations/star.json"),
    });

    return () => lottie.destroy();
  }, []);

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

          <div className={style.contact_dots__main}>
            <div className={style.contact_dots__animation}>
              <div
                className={style.svg_wrap}
                ref={container}
                style={{ width: 300, height: 300 }}
              ></div>

              <p className={style.contact_dots__text}>
                И только тогда вам откроется полная картина.
              </p>

              <Link
                className={style.contact_dots__link}
                to="/contact-dots/game"
              >
                Начать игру
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ContactDots;
