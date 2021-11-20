import { ConnectionOptions } from 'typeorm';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
const config: ConnectionOptions = {
    type: 'postgres',
    host: process.env.TYPEORM_HOST || 'localhost',
    port: Number(process.env.TYPEORM_PORT) || 5432,
    username: process.env.TYPEORM_USERNAME || "postgres",
    password: process.env.TYPEORM_PASSWORD || "postgres",
    database: process.env.TYPEORM_DATABASE || "trello",
    entities: [
        path.resolve(`dist/entities/*.js`),
    ],
    migrations: [
        path.resolve(`dist/migrations/*.js`),
    ],
    subscribers: [
        path.resolve(`dist/entities/*.js`),
    ],
    cli: {
        "entitiesDir": "src/entities",
        "migrationsDir": "src/migrations",
        "subscribersDir": "src/subscriber"
    },
    extra: { ssl: true, rejectUnauthorized: false },
    logging: true,
    synchronize: true,
};

export default config;  
