import React, { useState } from "react";
import style from "./drawing.module.scss";
import gift1 from "../../assets/images/gifts/gift-1.png";
import gift2 from "../../assets/images/gifts/gift-2.png";
import gift3 from "../../assets/images/gifts/gift-3.png";
import { faq } from "../../data/faq";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import _1kanal from "../../assets/icons/logos/1kanal-2.svg";
import kinopoisk from "../../assets/icons/logos/kinopoisk-2.svg";

const Drawing = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={style.drawing}>
      <div className="container">
        <div className={style.drawing__wrapper}>
          <p className={style.drawing__description}>
            Выполнив все задания правильно вы получаете высшую награду – колонку
            Яндекса. Но даже если вы допустили ошибку у вас остаётся шанс
            получить поощрительную награду – походную колонку.
          </p>

          <div className={style.drawing__gifts}>
            <h1>Ваши будущие награды</h1>

            <ul>
              <li>
                <div className={style.drawing__gift__item}>
                  <img src={gift1} alt="gift 1" />
                </div>
              </li>

              <li>
                <div className={style.drawing__gift__item}>
                  <img src={gift2} alt="gift 2" />
                </div>
              </li>

              <li>
                <div className={style.drawing__gift__item}>
                  <img src={gift3} alt="gift 3" />
                </div>
              </li>
            </ul>
          </div>

          <div className={style.drawing__faq}>
            <h2>Частые вопросы</h2>

            <ul>
              {faq.map(({ question, answer }, index) => (
                <li key={question} className={style.drawing__faq__item}>
                  <div className={style.drawing__faq__top}>
                    <p onClick={() => toggleFaq(index)}>{question}</p>
                    <button
                      className={style.drawing__faq__button}
                      onClick={() => toggleFaq(index)}
                    ></button>
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        className={style.drawing__faq__answer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>

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

          <Link className={style.trailer__tickets} to="/">
            КУПИТЬ БИЛЕТЫ
          </Link>

          <div className={style.trailer__socials}>
            <p>Следите за нами</p>

            <ul>
              <li>
                <Link to="">
                  <img src={_1kanal} alt="1  канал" />
                </Link>
              </li>

              <li>
                <Link to="">
                  <img src={kinopoisk} alt="Кинопоиск" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Drawing;
