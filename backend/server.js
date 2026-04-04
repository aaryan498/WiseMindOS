import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors());


// API Endpoints
app.use('/api/user', userRouter);


app.get('/', (req, res)=>{
    res.send("Server Running...")
})

app.listen(port, ()=>{
    console.log(`Server running : http://localhost:${port}`);
})

