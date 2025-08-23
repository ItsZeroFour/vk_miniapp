// Настройки анимации
export const popupAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

export const wrapperAnimation = {
  initial: { scale: 0.8, y: 50 },
  animate: { scale: 1, y: 0 },
  exit: { scale: 0.8, y: 50 },
  transition: {
    type: "spring",
    damping: 15,
    stiffness: 200,
  },
};

export const buttonAnimation = {
  whileHover: { scale: 1.1 },
  whileTap: { scale: 0.9 },
};

export const contentAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export const iconAnimation = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { type: "spring", delay: 0.2 },
};

export const DELAYS = {
  TEXT: 0.1,
  BUTTONS: 0.15,
  CHECK_BUTTON: 0.2,
};
