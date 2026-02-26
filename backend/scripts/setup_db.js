import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    let connection;

    try {
        console.log('🔄 Connecting to MySQL server...');
        const connectionString = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.TIDB_URL;

        if (connectionString) {
            connection = await mysql.createConnection({ uri: connectionString, multipleStatements: true });
            console.log('✅ Connected via URL String (Railway/PaaS).');
        } else {
            // Fallback for local
            connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'dashboard_emp',
                multipleStatements: true
            });
            console.log('✅ Connected via Local DB Credentials.');
        }

        // Read schema.sql (NOT init_db.sql)
        const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');
        console.log(`📖 Reading schema from ${schemaPath}...`);
        
        let sql = fs.readFileSync(schemaPath, 'utf8');

        if (!sql) {
            throw new Error('schema.sql is empty or could not be read.');
        }

        console.log('🚀 Executing schema initialization...');
        await connection.query(sql);

        console.log('✅ Database setup (schema.sql) completed successfully!');

    } catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

setupDatabase();
