import React, { useState } from "react";
import style from "./drawing.module.scss";
import gift1 from "../../assets/images/gifts/gift-1.png";
import gift2 from "../../assets/images/gifts/gift-2.png";
import gift3 from "../../assets/images/gifts/gift-3.png";
import { faq } from "../../data/faq";
import { motion, AnimatePresence } from "framer-motion";
import Trailer from "./Trailer";

const Drawing = React.memo(() => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={style.drawing}>
      <div className="container">
        <div className={style.drawing__wrapper}>
          <p className={style.drawing__description}>
            Выполните все 6 спецзаданий и получите шанс выиграть одну из наград
            с символикой <br /> фильма «Август». А среди самых быстрых и
            находчивых будут разыграны колонки Яндекс Street <br /> в
            лимитированном дизайне. Итоги 6 октября 2025.
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
              {faq.map(({ question, answer, link }, index) => (
                <li key={question} className={style.drawing__faq__item}>
                  <div className={style.drawing__faq__top}>
                    <p onClick={() => toggleFaq(index)}>{question}</p>
                    <button
                      className={`${style.drawing__faq__button} ${
                        openIndex === index
                          ? style.drawing__faq__button_active
                          : ""
                      }`}
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
                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            ссылке
                          </a>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>

          <Trailer src="https://vkvideo.ru/video_ext.php?oid=-217350474&id=456243968&hd=2&autoplay=1" />
        </div>
      </div>
    </section>
  );
});

export default Drawing;
