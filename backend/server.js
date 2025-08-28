require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app'); // Import the Express app

connectDB()


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});