import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Railway menyuntikkan MYSQL_URL secara otomatis jika kita menggunakan MySQL plugin
const connectionString = process.env.MYSQL_URL || process.env.DATABASE_URL;

let pool;

if (connectionString) {
    // Production: Railway MySQL via connection string
    pool = mysql.createPool({
        uri: connectionString,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
    });
    console.log('📡 Using MYSQL_URL for database connection (Production).');
} else {
    // Development: koneksi lokal
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'dashboard_emp',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true
    });
    console.log('🏠 Using local DB_HOST for database connection (Development).');
}

export default pool;
