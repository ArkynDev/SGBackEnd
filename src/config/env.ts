import dotenv from 'dotenv';
dotenv.config();

export const env = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASS: process.env.DB_PASS || '18051997',
    DB_NAME: process.env.DB_NAME || 'sertgest',
    JWT_SECRET: process.env.JWT_SECRET || '99aebb5506cc0733401e9b575198782e26090451863a9ad56b388c0abc907dafd13fd7d63e43eacc9b66e2dd2b971dfe7d3e20eef9435804033d27f3dc2a7cd2',
    PORT: process.env.PORT || '3001',
};