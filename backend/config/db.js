import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Automatic Schema Adjustment: Check and add 'division' column to 'issues' table
const ensureSchema = async () => {
    try {
        console.log("Checking database schema...");
        const [columns] = await pool.query("SHOW COLUMNS FROM issues LIKE 'division'");
        if (columns.length === 0) {
            console.log("Adding 'division' column to 'issues' table...");
            await pool.query("ALTER TABLE issues ADD COLUMN division VARCHAR(100) AFTER title");
            console.log("Column 'division' added successfully.");
        }
    } catch (err) {
        console.error("Schema Adjustment Error:", err.message);
    }
};

ensureSchema();

export default pool;
