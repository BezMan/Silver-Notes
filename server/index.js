const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const notesRoutes = require('./src/routes/noteRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', notesRoutes);

// Database Connection
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
