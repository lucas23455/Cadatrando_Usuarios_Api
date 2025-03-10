import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors())

// Criar um usuário
app.post('/usuarios', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                age: Number(req.body.age) // Garantindo que age seja um número
            }
        });
        res.status(201).json(user); // Respondendo com o usuário criado
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar usuário' });
    }
});

// Listar todos os usuários
app.get('/usuarios', async (req, res) => {
    try {
        //filtrar dados
        let users = [];
        if (req.query) {
            // Certificando-se que age é um número, se presente na query
            const age = req.query.age ? Number(req.query.age) : undefined;

            users = await prisma.user.findMany({
                where: {
                    name: req.query.name,
                    email: req.query.email,
                    age: age // Passando o valor convertido para o filtro
                }
            });
        } else {
            users = await prisma.user.findMany();
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao listar usuários' });
    }
});

// Atualizar dados
app.put('/usuarios/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: {
                email: req.body.email,
                name: req.body.name,
                age: Number(req.body.age) // Convertendo string para número
            }
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Usuário não encontrado ou erro na atualização' });
    }
});

// Deletar dados
app.delete('/usuarios/:id', async (req, res) => {
    try {
        await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao deletar usuário' });
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000 🚀");
});
