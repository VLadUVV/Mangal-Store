import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { getGlobalProfile, UserProfile } from "./Profile";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export const sendOrderEmails = async (
  userEmail: string,
  userName: string,
  userPhone: string,
  orderDetails: string,
  total: number
) => {
  const adminEmail = "goatfullgame123@gmail.com";

  const validateEmail = (email: string, context: string): boolean => {
    if (!email || typeof email !== "string") {
      console.error(`${context} не является строкой или пустой:`, email);
      return false;
    }
    const trimmedEmail = email.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(trimmedEmail)) {
      console.error(`${context} имеет некорректный формат:`, trimmedEmail);
      return false;
    }
    return true;
  };

  try {
    // Проверка и отправка письма администратору
    console.log("Admin Email:", adminEmail);
    if (!validateEmail(adminEmail, "Admin email")) {
      throw new Error(`Некорректный email администратора: ${adminEmail}`);
    }
    const adminParams = {
      to_email: adminEmail.trim(),
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
      order_details: orderDetails,
      total: `${total.toFixed(2)} ₽`,
    };
    await emailjs.send("service_26alv4m", "template_ju72srl", adminParams, "tQhZJQEuHzUY6Zu_g");

    // Проверка и отправка письма пользователю
    console.log("User Email:", userEmail);
    if (!validateEmail(userEmail, "User email")) {
      throw new Error(`Некорректный email пользователя: ${userEmail}`);
    }
    const userParams = {
      to_email: userEmail.trim(),
      user_name: userName,
      order_details: orderDetails,
      total: `${total.toFixed(2)} ₽`,
    };
    await emailjs.send("service_26alv4m", "template_b1svbbg", userParams, "tQhZJQEuHzUY6Zu_g");

    console.log("Оба письма успешно отправлены.");
    return true;
  } catch (error) {
    console.error("Ошибка при отправке писем:", error);
    throw error;
  }
};

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  // Синхронизация данных пользователя и корзины
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setItems([]);
      }
    }

    const profile = getGlobalProfile();
    if (profile) {
      setUser(profile);
    } else {
      const savedUser = localStorage.getItem("userProfile");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const updateQuantity = (id: number, change: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Успешно",
      description: "Товар удалён из вашей корзины!",
    });
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Ошибка",
        description: "Ваша корзина пуста!",
        variant: "destructive",
      });
      return;
    }

    const profile = getGlobalProfile();
    if (!profile || !profile.email || !profile.fio || !profile.phone) {
      toast({
        title: "Ошибка",
        description: "Вы должны войти в аккаунт или зарегистрироваться!",
        variant: "destructive",
      });
      return;
    }

    const userEmail = profile.email;
    const userName = profile.fio;
    const userPhone = profile.phone;

    const orderDetails = items
      .map((item) => `${item.name} — ${item.quantity} шт. — ${item.price * item.quantity} ₽`)
      .join("\n");
    const fullOrderDetails = `${orderDetails}\n\nИтого: ${total.toFixed(2)} ₽`;
    try {
      const response = await fetch("http://localhost:3500/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userName,
          userPhone,
          items,
          total,
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка сервера: ${errorData.error || response.statusText}`);
      }

      await sendOrderEmails(userEmail, userName, userPhone, fullOrderDetails, total);

      toast({
        title: "Успешный заказ",
        description: "Спасибо за покупку! Наш специалист свяжется с вами в течение дня!",
      });
      setItems([]);
      localStorage.removeItem("cart");
    } catch (error: any) {
      console.error("Ошибка при оформлении заказа:", error.message);
      console.log("JIB",fullOrderDetails );
      console.log("JIB",orderDetails );
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ. Попробуйте снова.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-mangal-600">Твоя корзина</h1>

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Корзина пуста</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-contain rounded"
                      onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-mangal-600">{(item.price * item.quantity).toFixed(2)} ₽</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          disabled={item.quantity === 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-4 text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Итоговый заказ</h2>
              <div className="space-y-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} ({item.quantity} шт.)</span>
                    <span>{(item.price * item.quantity).toFixed(2)} ₽</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Итого</span>
                  <span>{total.toFixed(2)} ₽</span>
                </div>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Заказать
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}