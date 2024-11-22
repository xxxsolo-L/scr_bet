import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API для ставок на футбольные матчи',
            version: '1.0.0',
            description: 'Документация API для проекта ставок на футбольные матчи',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Замените на ваш адрес
                description: 'Локальный сервер'
            }
        ],
    },
    apis: ['./src/routes/*.ts'], // Путь к файлам с описанием API (например, authRouter.ts)
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
