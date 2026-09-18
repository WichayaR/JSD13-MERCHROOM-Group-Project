// ไฟล์เชื่อมต่อ MongoDB: อ่าน connection string จาก .env ในเครื่อง หรือจาก Environment Variables ตอน deploy
require('dotenv').config();

const mongoose = require('mongoose');
const dns = require('dns');

let connectionPromise;

// ฟิก DNS เป็น Google/Cloudflare ป้องกันบั๊ก ECONNREFUSED จาก MongoDB Atlas SRV บนเน็ตบางค่าย
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Reuses a connection for warm serverless function invocations.
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add it to server/.env or the deployment environment variables.');
  }

  connectionPromise ??= mongoose.connect(process.env.MONGO_URI);

  try {
    const connection = await connectionPromise;
    console.log('[DATABASE] MongoDB connected successfully');
    return connection;
  } catch (err) {
    connectionPromise = undefined;
    throw err;
  }
};

module.exports = connectDB;
