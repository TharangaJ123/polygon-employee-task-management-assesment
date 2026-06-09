import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function initDb() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'polygon_db';

  console.log(`Connecting to MySQL at ${host} as ${user}...`);

  try {
    // Connect without specifying a database first to create it if it doesn't exist
    const connection = await mysql.createConnection({ host, user, password });
    
    console.log(`Creating database ${database} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.changeUser({ database });

    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'employee') DEFAULT 'employee',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if test users exist
    const [rows]: any = await connection.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      console.log('Seeding test users...');
      const adminPassword = await bcrypt.hash('admin123', 10);
      const employeePassword = await bcrypt.hash('employee123', 10);

      await connection.query(`
        INSERT INTO users (name, email, password, role) VALUES 
        ('Admin User', 'admin@test.com', ?, 'admin'),
        ('Employee User', 'employee@test.com', ?, 'employee')
      `, [adminPassword, employeePassword]);
      console.log('Successfully seeded admin@test.com (pwd: admin123) and employee@test.com (pwd: employee123).');
    } else {
      console.log('Users already exist, skipping seeding.');
    }

    await connection.end();
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDb();
