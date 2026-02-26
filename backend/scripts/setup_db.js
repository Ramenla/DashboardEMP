import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    let connection;

    try {
        console.log('🔄 Connecting to MySQL server...');
        const connectionString = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.TIDB_URL;

        if (connectionString) {
            console.log('🔌 Using Connection String (Railway)...');
            connection = await mysql.createConnection({
                uri: connectionString,
                multipleStatements: true
            });
        } else {
            console.log('🔌 Using Local Config...');
            connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'dashboard_emp',
                multipleStatements: true
            });
        }

        const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');
        console.log(`📖 Reading schema from ${schemaPath}...`);

        const sql = fs.readFileSync(schemaPath, 'utf8');

        if (!sql) {
            throw new Error('schema.sql is empty or could not be read.');
        }

        console.log('🚀 Executing schema initialization (Creating EVM tables)...');
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
