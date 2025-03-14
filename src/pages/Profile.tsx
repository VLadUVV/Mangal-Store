import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Глобальное состояние профиля
const globalProfile: { current: UserProfile | null } = { current: null };

export interface UserProfile {
  fio: string;
  email: string;
  phone: string;
  password: string;
}

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fio: "",
    email: "",
    phone: "",
    password: "",
  });
  const { toast } = useToast();

  const [registerData, setRegisterData] = useState<UserProfile>({
    fio: "",
    email: "",
    phone: "",
    password: "",
  });

  // Загрузка профиля при монтировании компонента
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      globalProfile.current = parsedProfile;
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3500/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          password: profile.password,
        }),
      });
      if (!response.ok) throw new Error("Ошибка входа");
      const data = await response.json();
      setProfile(data);
      globalProfile.current = data;
      localStorage.setItem("userProfile", JSON.stringify(data));
      setIsLoggedIn(true);
      toast({ title: "С возвращением", description: "Вход успешно выполнен!" });
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast({ title: "Ошибка", description: "Не удалось войти. Попробуйте снова." });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3500/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!response.ok) throw new Error("Ошибка регистрации");
      const data = await response.json();
      setProfile(data);
      globalProfile.current = data;
      localStorage.setItem("userProfile", JSON.stringify(data));
      setIsLoggedIn(true);
      toast({ title: "Добро пожаловать!", description: "Ваш аккаунт создан!" });
    } catch (err) {
      console.error("Ошибка регистрации:", err);
      toast({ title: "Ошибка", description: "Не удалось зарегистрироваться" });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentEmail = globalProfile.current?.email;
      const response = await fetch("http://localhost:3500/api/profile", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, currentEmail }),
      });
      if (!response.ok) throw new Error("Ошибка обновления профиля");
      const updatedProfile = await response.json();
      setProfile({ ...updatedProfile, password: "" });
      globalProfile.current = { ...updatedProfile, password: "" };
      localStorage.setItem("userProfile", JSON.stringify({ ...updatedProfile, password: "" }));
      setIsEditing(false);
      toast({ title: "Профиль обновлён", description: "Ваш профиль успешно обновлён." });
    } catch (error) {
      console.error("Ошибка обновления:", error);
      toast({ title: "Ошибка", description: "Не удалось обновить профиль." });
    }
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [id.replace("register-", "")]: value,
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-mangal-600">Профиль</h1>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Вход</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Пароль</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={profile.password}
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Войти</Button>
              </form>
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:border-mangal-500 transition-colors">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Регистрация</h2>
                  <p className="text-gray-600 mb-4">Создайте новый аккаунт</p>
                  <Button variant="outline" className="w-full">Зарегистрироваться</Button>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Создать аккаунт</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-fio">ФИО</Label>
                  <Input id="register-fio" required value={registerData.fio} onChange={handleRegisterInputChange} />
                </div>
                <div>
                  <Label htmlFor="register-phone">Номер телефона</Label>
                  <Input id="register-phone" type="tel" required value={registerData.phone} onChange={handleRegisterInputChange} />
                </div>
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" required value={registerData.email} onChange={handleRegisterInputChange} />
                </div>
                <div>
                  <Label htmlFor="register-password">Пароль</Label>
                  <Input id="register-password" type="password" required value={registerData.password} onChange={handleRegisterInputChange} />
                </div>
                <Button type="submit" className="w-full">Создать аккаунт</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-mangal-600">Мой профиль</h1>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="fio">ФИО</Label>
                <Input
                  id="fio"
                  value={profile.fio}
                  onChange={(e) => setProfile({ ...profile, fio: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="flex justify-between">
                <Button type="submit">Сохранить изменения</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-500">ФИО</Label>
                <p className="mt-1 text-lg">{profile.fio}</p>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-500">Номер телефона</Label>
                <p className="mt-1 text-lg">{profile.phone}</p>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-500">Email</Label>
                <p className="mt-1 text-lg">{profile.email}</p>
              </div>
              <div className="flex justify-between">
                <Button onClick={() => setIsEditing(true)}>Редактировать профиль</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setProfile({ fio: "", email: "", phone: "", password: "" });
                    globalProfile.current = null;
                    localStorage.removeItem("userProfile");
                    toast({
                      title: "Выход выполнен",
                      description: "Вы успешно вышли из системы."
                    });
                  }}
                >
                  Выйти
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Функция для получения текущего профиля из любого места приложения
export function getGlobalProfile(): UserProfile | null {
  return globalProfile.current;
}