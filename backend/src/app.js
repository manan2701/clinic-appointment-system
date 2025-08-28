const express = require('express'); 
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const userRoutes = require('./routes/userRoutes');
const publicRoutes = require('./routes/publicRoutes');
const accountRoutes = require('./routes/accountRoutes');
const { authMiddleware, roleMiddleware } = require('./middleware/authMiddleware');

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes); // Public routes don't need auth middleware
app.use('/api/account', authMiddleware, accountRoutes);
app.use('/api/admin', authMiddleware, roleMiddleware(['Admin']), adminRoutes);
app.use('/api/clinic', authMiddleware, roleMiddleware(['Clinic']), clinicRoutes);
app.use('/api/user', authMiddleware, roleMiddleware(['User']), userRoutes);


module.exports = app;