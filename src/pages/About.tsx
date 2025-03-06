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
    url: "#",
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

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-mangal-600 mb-4">О нас</h1>
          <p className="text-2xl font-semibold text-mangal-800 mb-8">
            
          </p>
          <div className="relative h-64 rounded-lg overflow-hidden mb-8">
            <img
              src="img/fon.jpg"
              alt="Mangal-Store showroom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">О нас</h2>
            <p className="text-gray-600 mb-4">
            Добро пожаловать в Mangal Store!Ищете качественный мангал по доступной цене? Вы пришли по адресу! В Mangal Store вы можете приобрести мангалы напрямую от производителя, минуя розничные сети, и сэкономить до 30%!
            </p>
            <h2 className="text-2xl font-semibold mb-4">Почему выбирают нас?</h2>
            <p className="text-gray-600 mb-4">
            ● Собственное производство: Мы контролируем каждый этап изготовления, гарантируя высокое качество продукции. <br/>
            ● Гарантия качества: Наши мангалы проходят строгий контроль качества, чтобы вы могли наслаждаться приготовлением на открытом огне долгие годы.<br/>
            ● Долговечность: Мы используем только проверенные материалы, чтобы ваш мангал служил вам верой и правдой на протяжении многих лет.<br/>
            ● Большой ассортимент: У нас вы найдете мангалы на любой вкус и бюджет – от компактных моделей до больших стационарных конструкций.<br/>
            ● Удобная доставка: Мы оперативно доставим ваш заказ в любую точку страны, чтобы вы могли быстрее начать готовить.<br/>
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Мы есть:</h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    to={social.url}
                    className="flex items-center space-x-2 text-mangal-600 hover:text-mangal-700 p-2 rounded-lg hover:bg-mangal-50 transition-colors"
                  >
                    <img
                      src={social.logo}
                      alt={social.name}
                      className="w-8 h-8 "
                    />
                    <span>{social.name}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Наш магазин</h3>
              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin className="mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">г.Санкт-Петербург,</p>
                  <p>ул. Ольги Берггольц, д.40.</p>
                  <p>Завод «ПАТРИОТ»</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Наши гарантии</h2>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Качество</h3>
                <p className="text-gray-600">Только лучшие материалы и мастерство</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Экспертиза</h3>
                <p className="text-gray-600">Профессиональное руководство и поддержка</p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Сервис</h3>
                <p className="text-gray-600">Удовлетворение потребностей клиентов гарантировано</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}