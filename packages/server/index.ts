import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    console.log(process.env.OPENAI_API_KEY);
    res.send('Hello world!!!!')
})

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`))