import 'dotenv/config'
import express from 'express';
import { router } from './routes/index.js';
import { connectDB } from "./config/database.js";
import cookieParser from 'cookie-parser'

await connectDB()
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());




app.use('/api', router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, statusCode, message });
});

app.listen(PORT, () => {
  console.log(`Application listen on port ${PORT}`);
});