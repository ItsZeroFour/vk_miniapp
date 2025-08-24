export const menuItems = [
  { title: "ГЛАВНАЯ", path: "/", page_type: "main", protected: false },
  {
    title: "РОЗЫГРЫШ",
    path: "/drawing",
    page_type: "drawing",
    protected: false,
  },
  {
    title: "РАСПОЗНАВАНИЕ ЛИЦ",
    path: "/face-recognition",
    page_type: "",
    protected: true,
  },
  {
    title: "СВОЙ-ЧУЖОЙ",
    path: "/friend-or-foe",
    page_type: "",
    protected: true,
  },
  {
    title: "ТОЧКИ КОНТАКТА",
    path: "/contact-dots",
    page_type: "",
    protected: true,
  },
  { title: "О ФИЛЬМЕ", path: "/", page_type: "trailer", protected: false },
];
