import { Facebook, Instagram, Phone, Mail, Icon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";



const socialLinks = [
  {
    name: "Wildberries",
    url: "#",
    logo: "/img/Icon/wb_icon.svg",
  },
  {
    name: "Ozon",
    url: "https://ozon.ru/t/Gd65zWq",
    logo: "/img/Icon/ozon_icon.svg",
  },
  {
    name: "Telegram",
    url: "#",
    logo: "/img/Icon/tg_icon.svg",
  },
  {
    name: "VKontakte",
    url: "#",
    logo: "/img/Icon/wk_icon.svg",
  },
];

const CreatorLinks = [
  {
    name: "Разработчик 1",
    url: "https://t.me/kara0917",
    logo: "/img/Icon/tg_icon.svg",
  },
  {
    name: "Разработчик 2",
    url: "https://t.me/RAFF_LEMs",
    logo: "/img/Icon/tg_icon.svg",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Связаться с нами</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Phone size={20} className="text-mangal-600" />
                <span>+7 900 633-13-83</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <Mail size={20} className="text-mangal-600" />
                <span>mangalstor@yandex.ru</span>
              </div>
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Мы в соц сетях</h3>
            <div className="grid grid-cols-2 gap-4 justify-center sm:justify-start">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="flex items-center space-x-2 text-mangal-600 hover:text-mangal-700 p-2 rounded-lg hover:bg-mangal-50 transition-colors"
                >
                  <img
                    src={social.logo}
                    alt={social.name}
                    className="w-8 h-8  object-contain"
                  />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Адрес</h3>
            <p>г.Санкт-Петербург, ул. Ольги Берггольц, д.40. </p>
            <p>Завод «ПАТРИОТ»</p>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Команда разработчиков</h3>
            <div className="grid grid-cols-1 gap-4 justify-center sm:justify-start">
              {CreatorLinks.map((creator) => (
                <a
                  key={creator.name}
                  href={creator.url}
                  className="flex items-center space-x-2 text-mangal-600 hover:text-mangal-700 p-2 rounded-lg hover:bg-mangal-50 transition-colors"
                >
                  <img
                    src={creator.logo}
                    alt={creator.name}
                    className="w-8 h-8  object-contain"
                  />
                  <span>{creator.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-600">
          <p>&copy; 2024 Mangal-Store. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};