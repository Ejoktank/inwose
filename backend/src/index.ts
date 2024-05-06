import express from "express";
import cors from "cors";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { tasks } from "./schema";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { eq } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./migrations" });

const app = express();
app.use(express.json());
app.use(cors());

// Middleware для логирования входящих запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toUTCString()}] ${req.method} ${req.url}`);
  next();
});

// Создание карточки задачи
app.post("/tasks", async (req, res) => {
  const obj = req.body;
  // obj.validate()
  await db.insert(tasks).values(obj);
  res.status(201).json(obj);
});

// Получение списка всех карточек задач
app.get("/tasks", async (req, res) => {
  console.log("Обработка запроса на получение списка задач");
  const x = await db.select().from(tasks);
  return res.json(x);
});

// Изменение карточки задачи
app.patch("/tasks/:id", async (req, res) => {
  const obj = req.body;
  const id = parseInt(req.params.id);
  if (!obj.taskType) {
    return res.status(400).send("Не получилось :(")
  }
  if (Number.isNaN(id)) {
    return res.status(400).send(`Ты лох ${req.params.id}`);
  }
  await db.update(tasks).set(obj).where(eq(tasks.id, id));
  return res.json({answer: "Успешно!"});
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
