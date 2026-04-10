const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const hash = await bcrypt.hash('admin123', 10);
  await User.findOneAndUpdate(
    { email: 'admin@school.edu' },
    { email: 'admin@school.edu', password: hash, role: 'admin', name: 'Admin' },
    { upsert: true }
  );
  console.log('Admin created!');
  process.exit();
});