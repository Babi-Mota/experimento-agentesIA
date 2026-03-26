import express from 'express';
import questionRoutes from './routes/questionRoutes';
import examRoutes from './routes/examRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/questions', questionRoutes);
app.use('/exams', examRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
});
