import { config } from "dotenv";

config()

import express from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { tasks, users } from "./schema";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";
import * as path from "node:path"

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "./auth";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./migrations" });

const app = express();
app.use(express.json());
app.use(cors());

const staticPath = path.resolve(__dirname, '..', 'public')
const indexPath = path.join(staticPath, 'index.html')

app.use(express.static(staticPath))
app.get('/login', (req, res) => { res.sendFile(indexPath) })
app.get('/register', (req, res) => { res.sendFile(indexPath) })
app.get('/mytasks', (req, res) => { res.sendFile(indexPath) })

// Middleware для логирования входящих запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toUTCString()}] ${req.method} ${req.url}`);
  next();
});

// Создание карточки задачи
app.post("/api/tasks", authenticateToken, async (req, res) => {
  const obj = req.body;
  // obj.validate()
  obj.ownerId = (req as any).user.userId
  await db.insert(tasks).values(obj);
  res.status(201).json(obj);
});

// Получение списка всех карточек задач
app.get("/api/tasks", authenticateToken, async (req, res) => {
  const user = (req as any).user
  console.log("Обработка запроса на получение списка задач");
  const x = await db.select().from(tasks).where(eq(tasks.ownerId, user.userId));
  return res.json(x);
});

// Изменение карточки задачи
app.patch("/api/tasks/:id", authenticateToken, async (req, res) => {
  const obj = req.body;
  const id = parseInt(req.params.id);
  if (!obj.taskType) {
    return res.status(400).send("Не получилось :(");
  }
  if (Number.isNaN(id)) {
    return res.status(400).send(`Ты лох ${req.params.id}`);
  }
  await db.update(tasks).set(obj).where(eq(tasks.id, id));
  return res.json({ answer: "Успешно!" });
});

// Registration endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user[0].id, email: user[0].email }, process.env.JWT_SECRET as string, { expiresIn: "24h" });

    res.json({ token });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
