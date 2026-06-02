import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import goalRouter from './routes/goalRoute.js';
import projectRouter from './routes/projectRoute.js';
import taskRouter from './routes/taskRoute.js';
import habitRouter from './routes/habitRoute.js';
import dailyPlanRouter from './routes/dailyPlanRoute.js';
import notebookRouter from './routes/notebookRoute.js';
import pageRouter from './routes/pageRoute.js';
import weeklyStatRouter from './routes/weeklyStatRoute.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cors());


// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/goals', goalRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/habits', habitRouter);
app.use('/api/daily-plan', dailyPlanRouter);
app.use('/api/notebooks', notebookRouter);
app.use('/api/pages', pageRouter);
app.use('/api/stats', weeklyStatRouter);



app.get('/', (req, res)=>{
    res.send("WiseMindOS Backend - Server Running...");
})

app.listen(port, ()=>{
    console.log(`Server running : http://localhost:${port}`);
})

