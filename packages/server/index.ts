import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// ROUTES
app.get('/api/health', (req: Request, res: Response) => {
   res.json({ message: '✅ health check success 🩺' });
});

app.use(chatRoutes);

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
