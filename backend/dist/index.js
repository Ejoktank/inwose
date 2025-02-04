"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const better_sqlite3_1 = require("drizzle-orm/better-sqlite3");
const schema_1 = require("./schema");
const better_sqlite3_2 = __importDefault(require("better-sqlite3"));
const migrator_1 = require("drizzle-orm/better-sqlite3/migrator");
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
const sqlite = new better_sqlite3_2.default("sqlite.db");
const db = (0, better_sqlite3_1.drizzle)(sqlite);
(0, migrator_1.migrate)(db, { migrationsFolder: "./migrations" });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Middleware для логирования входящих запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toUTCString()}] ${req.method} ${req.url}`);
    next();
});
// Создание карточки задачи
app.post("/api/tasks", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = req.body;
    // obj.validate()
    obj.ownerId = req.user.userId;
    yield db.insert(schema_1.tasks).values(obj);
    res.status(201).json(obj);
}));
// Получение списка всех карточек задач
app.get("/api/tasks", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    console.log("Обработка запроса на получение списка задач");
    const x = yield db.select().from(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.ownerId, user.userId));
    return res.json(x);
}));
// Изменение карточки задачи
app.patch("/api/tasks/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = req.body;
    const id = parseInt(req.params.id);
    if (!obj.taskType) {
        return res.status(400).send("Не получилось :(");
    }
    if (Number.isNaN(id)) {
        return res.status(400).send(`Ты лох ${req.params.id}`);
    }
    yield db.update(schema_1.tasks).set(obj).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, id));
    return res.json({ answer: "Успешно!" });
}));
// Registration endpoint
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existingUser = yield db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        yield db.insert(schema_1.users).values({
            email,
            password: hashedPassword,
        });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
}));
// Login endpoint
app.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user
        const user = yield db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (user.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        // Check password
        const validPassword = yield bcrypt_1.default.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({ token });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error logging in" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
