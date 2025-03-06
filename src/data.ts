import express, { Express, Request, Response } from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";

const dbPromise = open({
  filename: "./data.db",
  driver: sqlite3.Database,
});

const app: Express = express();
const port = 3500;

app.use(cors());
app.use(express.json());

// Интерфейс для CartItem
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Инициализация базы данных
async function initDB(): Promise<void> {
  const db = await dbPromise;
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fio TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        date TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userEmail TEXT NOT NULL,
        userName TEXT NOT NULL,
        userPhone TEXT NOT NULL,
        total REAL NOT NULL,
        date TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        rating INTEGER NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `);
    console.log("📦 База данных успешно инициализирована");
  } catch (err) {
    console.error("Ошибка при инициализации базы данных:", err);
    throw err;
  }
}

// Функции работы с пользователями
async function addUser(fio: string, phone: string, email: string, password: string, date: string): Promise<void> {
  const db = await dbPromise;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.run(
    "INSERT INTO users (fio, phone, email, password, date) VALUES (?, ?, ?, ?, ?)",
    [fio, phone, email, hashedPassword, date]
  );
}

async function getUserByEmail(email: string): Promise<{ id: number; fio: string; phone: string; email: string; password: string; date: string } | undefined> {
  const db = await dbPromise;
  return db.get("SELECT * FROM users WHERE email = ?", [email]);
}

async function updateUser(fio: string, phone: string, email: string, currentEmail: string): Promise<boolean> {
  const db = await dbPromise;
  const result = await db.run(
    "UPDATE users SET fio = ?, phone = ?, email = ? WHERE email = ?",
    [fio, phone, email, currentEmail]
  );
  return result.changes !== undefined && result.changes > 0;
}

// Функции работы с отзывами
async function addReview(author: string, rating: number, content: string, date: string): Promise<{ id: number; author: string; rating: number; content: string; date: string }> {
  const db = await dbPromise;
  const result = await db.run(
    "INSERT INTO reviews (author, rating, content, date) VALUES (?, ?, ?, ?)",
    [author, rating, content, date]
  );
  return { id: result.lastID!, author, rating, content, date };
}

async function getAllReviews(): Promise<{ id: number; author: string; rating: number; content: string; date: string }[]> {
  const db = await dbPromise;
  return db.all("SELECT * FROM reviews ORDER BY date DESC");
}

// Функция добавления заказа с подробным логированием
async function addOrder(
  userEmail: string,
  userName: string,
  userPhone: string,
  total: number,
  items: CartItem[],
  date: string
): Promise<{ id: number; userEmail: string; userName: string; userPhone: string; total: number; items: CartItem[]; date: string }> {
  const db = await dbPromise;
  try {
    console.log("Добавление заказа:", { userEmail, userName, userPhone, total, items, date });

    // Вставка в таблицу orders
    const orderResult = await db.run(
      "INSERT INTO orders (userEmail, userName, userPhone, total, date) VALUES (?, ?, ?, ?, ?)",
      [userEmail, userName, userPhone, total, date]
    );
    const orderId = orderResult.lastID!;
    console.log("Заказ добавлен с ID:", orderId);

    // Вставка элементов заказа
    for (const item of items) {
      console.log("Добавление элемента заказа:", item);
      await db.run(
        "INSERT INTO order_items (orderId, name, price, quantity) VALUES (?, ?, ?, ?)",
        [orderId, item.name, item.price, item.quantity]
      );
    }

    return { id: orderId, userEmail, userName, userPhone, total, items, date };
  } catch (err) {
    console.error("Детальная ошибка в addOrder:", err);
    throw err; // Передаем ошибку дальше для обработки в маршруте
  }
}

// Инициализация базы данных
initDB().catch((err) => {
  console.error("Не удалось запустить сервер из-за ошибки базы данных:", err);
  process.exit(1);
});

// Маршруты
app.post("/api/register", async (req: Request, res: Response): Promise<void> => {
  const { fio, phone, email, password } = req.body as { fio?: string; phone?: string; email?: string; password?: string };
  const date = new Date().toISOString();
  if (!fio || !phone || !email || !password) {
    res.status(400).json({ error: "Все поля обязательны" });
    return;
  }
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "Пользователь с таким email уже существует" });
      return;
    }
    await addUser(fio, phone, email, password, date);
    const newUser = await getUserByEmail(email);
    res.status(201).json({ fio: newUser!.fio, email: newUser!.email, phone: newUser!.phone });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email и пароль обязательны" });
    return;
  }
  try {
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }
    res.json({ fio: user.fio, email: user.email, phone: user.phone });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/profile", async (req: Request, res: Response): Promise<void> => {
  const { fio, phone, email, currentEmail } = req.body as { fio?: string; phone?: string; email?: string; currentEmail?: string };
  if (!fio || !phone || !email || !currentEmail) {
    res.status(400).json({ error: "Все поля обязательны" });
    return;
  }
  try {
    const updated = await updateUser(fio, phone, email, currentEmail);
    if (!updated) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }
    const updatedUser = await getUserByEmail(email);
    res.json({ fio: updatedUser!.fio, email: updatedUser!.email, phone: updatedUser!.phone });
  } catch (err) {
    console.error("Ошибка обновления профиля:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.get("/api/reviews", async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (err) {
    console.error("Ошибка получения отзывов:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/reviews", async (req: Request, res: Response): Promise<void> => {
  const { author, rating, content, date } = req.body as { author?: string; rating?: number; content?: string; date?: string };
  if (!author || typeof rating !== "number" || !content || !date) {
    res.status(400).json({ error: "Все поля обязательны" });
    return;
  }
  try {
    const newReview = await addReview(author, rating, content, date);
    res.status(201).json(newReview);
  } catch (err) {
    console.error("Ошибка добавления отзыва:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/api/orders", async (req: Request, res: Response): Promise<void> => {
  const { userEmail, userName, userPhone, items, total, date } = req.body as {
    userEmail?: string;
    userName?: string;
    userPhone?: string;
    items?: CartItem[];
    total?: number;
    date?: string;
  };
  if (!userEmail || !userName || !userPhone || !Array.isArray(items) || typeof total !== "number" || !date) {
    res.status(400).json({ error: "Все поля (userEmail, userName, userPhone, items, total, date) обязательны" });
    return;
  }
  try {
    const newOrder = await addOrder(userEmail, userName, userPhone, total, items, date);
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Ошибка добавления заказа:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});