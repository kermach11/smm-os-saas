import { CarouselItem } from "../types/types";

export const DEFAULT_CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: "1",
    title: "LINKCORE",
    description: "Мінімалістичний профіль-хаб. Один лінк, що відкриває весь твій цифровий слід.",
    imageUrl: "/photo/photo-1.png",
    url: "#linkcore"
  },
  {
    id: "2",
    title: "CASEMACHINE",
    description: "Сайт-кейсбук: твої проєкти в деталях, цифри, візуали, відгуки.",
    imageUrl: "/photo/photo-2.png",
    url: "#casemachine"
  },
  {
    id: "3",
    title: "BOOKME",
    description: "Інструмент бронювання консультацій. Години, оплата, зручність.",
    imageUrl: "/photo/photo-3.png",
    url: "/bookme"
  },
  {
    id: "4",
    title: "ADLAND",
    description: "Посадкові сторінки під рекламу. Швидкі, точні, ефективні.",
    imageUrl: "/photo/photo-4.png",
    url: "#adland"
  },
  {
    id: "5",
    title: "SELLKIT",
    description: "Магазин цифрових продуктів: гайдпаки, шаблони, caption-сети.",
    imageUrl: "/photo/photo-5.png",
    url: "#sellkit"
  }
];

export const DEFAULT_INTRO_SETTINGS = {
  titleTop: "За межами",
  titleMiddle: "Реальності", 
  description: "Подорожуйте крізь час і простір у захоплюючому всесвіті майбутнього.",
  buttonText: "Розпочати подорож"
};

export const DEFAULT_ADMIN_SETTINGS = {
  password: 'admin123',
  showAdminButton: false,
  autoLogout: true,
  logoutTime: 30
}; 