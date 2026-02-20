import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_CONFIG = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

const DB_NAME = process.env.DB_NAME || 'dashboard_emp';

async function setupDatabase() {
    let connection;

    try {
        console.log('🔄 Connecting to MySQL server...');
        // 1. Connect to MySQL Server (without selecting database)
        connection = await mysql.createConnection({
            ...DB_CONFIG,
            multipleStatements: true // Allow executing multiple SQL statements
        });

        console.log(`🔨 Creating database '${DB_NAME}' if it doesn't exist...`);
        // 2. Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`✅ Database '${DB_NAME}' ready.`);

        // 3. Select Database
        await connection.changeUser({ database: DB_NAME });
        console.log(`📂 Selected database '${DB_NAME}'.`);

        // 4. Read init_db.sql
        const initDbPath = path.join(__dirname, '..', 'init_db.sql');
        console.log(`📖 Reading schema from ${initDbPath}...`);
        
        // Note: init_db.sql is known to be UTF-16LE encoded
        const sql = fs.readFileSync(initDbPath, { encoding: 'utf16le' });

        if (!sql) {
            throw new Error('init_db.sql is empty or could not be read.');
        }

        console.log('🚀 Executing schema initialization...');
        
        // cleanup some BOM or weird characters if present (UTF-16LE sometimes has BOM)
        // cleanSql invalid characters if any, but mysql2 usually handles standard SQL strings
        await connection.query(sql);

        console.log('✅ Database setup completed successfully!');

    } catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
