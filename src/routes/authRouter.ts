import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {prisma, Prisma} from "../../server";
import sendVerificationEmail  from "../utils/sendVerificationEmail";
import crypto from 'crypto';



const authRouter = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// Регистрация
authRouter.route('/register')
    .post(async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            // Проверка существования пользователя
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                res.status(400).json({ error: "Пользователь с таким email уже существует" });
                return;
            }
            // Хэширование пароля
            const hashedPassword = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Создание нового пользователя
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    roleId: '673fffd62cb4718fafbcc029',
                    verificationToken
                }
            });
            await sendVerificationEmail(email, verificationToken);
            res.status(201).json({ message: "Регистрация успешна. Пожалуйста, подтвердите свой email." });
            // // Создание JWT-токена
            // const token = jwt.sign(
            //     { userId: newUser.id, email: newUser.email },
            //     JWT_SECRET,
            //     { expiresIn: '1h' }  // срок действия токена
            // );
            // // Ответ с токеном
            // res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
        } catch (error) {
            console.error('Registration error:', error); // Добавляем вывод ошибки
            res.status(500).json({ error: "Ошибка регистрации пользователя" });
        }
    });

authRouter.route('/verify')
    .get(async (req: Request, res: Response): Promise<void> => {
        const { token } = req.query;

        try {
            // Найти пользователя по токену
            const user = await prisma.user.findFirst({ where: { verificationToken: token as string } });
            if (!user) {
                res.status(400).json({ error: "Неверный или просроченный токен" });
                return;
            }

            // Обновить статус пользователя
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    isVerified: true,
                    verificationToken: null
                }
            });
            res.status(200).json({ message: "Email успешно подтвержден!" });
        } catch (error) {
            console.error('Verification error:', error);
            res.status(500).json({ error: "Ошибка подтверждения email" });
        }
    });

// Вход в систему
authRouter.route('/login')
    .post( async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            // Проверка существования пользователя, аутентификация
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                res.status(401).json({ error: 'Неверный логин или пароль.' });
                return;
            }
            // Проверка подтверждения email
            if (!user.isVerified) {
                res.status(403).json({ error: 'Пожалуйста, подтвердите ваш email перед входом.' });
                return;
            }
            // Проверка пароля
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ error: 'Неверный логин или пароль.' });
                return;
            }

            // Создание JWT-токена, авторизация
            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email,
                },
                JWT_SECRET,
                { expiresIn: '1h' } // Время жизни токена
            );

            // Ответ с токеном и данными пользователя
            res.status(200).json({ token, user: { id: user.id, email: user.email} });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка входа. Пожалуйста, попробуйте позже.' });
        }});

export default authRouter;
