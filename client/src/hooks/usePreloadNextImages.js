import { useEffect } from "react";

export const usePreloadNextImages = (items, currentIndex) => {
  useEffect(() => {
    if (currentIndex < items.length - 1) {
      items[currentIndex + 1].forEach((nextCard) => {
        const img = new Image();
        img.src = nextCard.img;
      });
    }
  }, [currentIndex, items]);
};
