const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/books', require('./routes/books'));
app.use('/api/borrow', require('./routes/borrow'));

app.get('/', (req, res) => res.send('Library backend running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
