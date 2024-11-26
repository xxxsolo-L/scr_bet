import express, { Application } from 'express';
import cors from 'cors';
import { PrismaClient, Prisma } from '@prisma/client'
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger'; // Импорт Swagger-документации
import authRouter from './src/routes/authRouter'


dotenv.config();
const app: Application = express();
const prisma = new PrismaClient()
const port = process.env.PORT || 3000;

export {prisma, Prisma}; // prisma (my client)

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/api', authRouter)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Server is running on http://localhost:${port}`)
});