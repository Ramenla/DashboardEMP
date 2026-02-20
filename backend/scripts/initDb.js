import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const init = async () => {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    };

    try {
        const connection = await mysql.createConnection(config);

        console.log(`Creating database "${process.env.DB_NAME}" if not exists...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        await connection.query(`USE ${process.env.DB_NAME}`);

        const initSql = `
        CREATE TABLE IF NOT EXISTS projects (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100),
            status VARCHAR(50),
            priority VARCHAR(50),
            progress INT DEFAULT 0,
            target INT DEFAULT 0,
            budgetUsed INT DEFAULT 0,
            budgetTotal BIGINT DEFAULT 0,
            startMonth INT,
            duration INT,
            sponsor VARCHAR(255),
            manager VARCHAR(255),
            strategy TEXT,
            startDate VARCHAR(50),
            endDate VARCHAR(50),
            location VARCHAR(255),
            issues JSON,
            timelineEvents JSON,
            team JSON,
            hse JSON,
            documents JSON,
            gallery JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `;

        await connection.query(initSql);
        console.log('Database and "projects" table are ready.');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
};

init();
