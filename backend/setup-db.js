const mysql = require('mysql2/promise');

async function setupDatabase() {
  // First, try to connect without specifying a database
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Dogy@1234',
    port: 3306
  });

  try {
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS rethread');
    console.log('Database "rethread" created or already exists');
    
    // Create a new user for the application (optional - we can use root for now)
    // For now, we'll just use root and create the database
    
    console.log('Database setup complete!');
    console.log('\nYou can now run: npm run prisma:generate && npx prisma db push');
    
  } catch (error) {
    console.error('Error setting up database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAuthentication failed. Please check your MySQL root password.');
      console.error('You may need to:');
      console.error('1. Reset MySQL root password');
      console.error('2. Or create the database manually using:');
      console.error('   mysql -u root -p');
      console.error('   CREATE DATABASE rethread;');
    }
  } finally {
    await connection.end();
  }
}

setupDatabase();

