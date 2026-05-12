import "dotenv/config";
import express from "express";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "./generated/prisma/client.js";

const adapter = new PrismaMariaDb(process.env["DATABASE_URL"]!);
const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/users", async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: req.body,
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

app.get("/users/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {id: Number(id)},
        });

        res.json(user);

    }   catch (err) {
        res.status(500).json({error:err});
    }
});


app.put("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: req.body
        });

        res.json(user);

    } catch (err) {
        res.status(500).json({ error: err});
    }
});

app.delete("/users/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const user = await prisma.user.delete({
            where: {id: Number(id)},
        });

        res.json(user);

    }   catch (err) {
        res.status(500).json({error:err});
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

