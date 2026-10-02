const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());          // lets the React app (port 5173) call this API (port 5000)
app.use(express.json()); // parses JSON request bodies

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentdb';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected: studentdb'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Database: studentdb | Collection: students
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // stored as a bcrypt hash
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  country: { type: String, required: true },
  languages: { type: [String], default: [] },
});
const Student = mongoose.model('Student', studentSchema, 'students');

const errorMessage = (err) => (err.code === 11000 ? 'Email already registered' : err.message);

// READ - all students (password hash is never sent to the browser)
app.get('/students', async (req, res) => {
  try {
    res.json(await Student.find().select('-password').sort({ _id: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE - register a student
app.post('/students', async (req, res) => {
  try {
    const { password, ...data } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });
    const hashed = await bcrypt.hash(password, 10);
    const student = await Student.create({ ...data, password: hashed });
    res.status(201).json({ message: 'Registration successful', id: student._id });
  } catch (err) {
    res.status(400).json({ message: errorMessage(err) });
  }
});

// UPDATE - blank password keeps the existing one
app.put('/students/:id', async (req, res) => {
  try {
    const { password, ...data } = req.body;
    if (password) data.password = await bcrypt.hash(password, 10);
    const student = await Student.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Update successful' });
  } catch (err) {
    res.status(400).json({ message: errorMessage(err) });
  }
});

// DELETE
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
