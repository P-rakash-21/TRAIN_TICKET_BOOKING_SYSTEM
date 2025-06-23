const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Train = require('../models/Train');
const auth = require('../middleware/auth');
const exportBookingsToCSV = require('../utils/csvExport');
const fs = require('fs');

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  await User.create({ username, password, role });
  res.sendStatus(201);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const token = jwt.sign({ username, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});

router.post('/trains', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  const { trainName, trainId, timing, totalSeats, ticketPrice } = req.body;
  const seats = Array.from({ length: totalSeats }, (_, i) => ({
    number: i + 1,
    bookedBy: null,
    bookedAt: null
  }));
  await Train.create({ trainName, trainId, timing, totalSeats, ticketPrice, seats });
  res.sendStatus(201);
});

router.get('/trains', async (req, res) => {
  const trains = await Train.find({}, { seats: 0 });
  res.json(trains);
});

router.get('/train-seats/:trainId', auth, async (req, res) => {
  const train = await Train.findOne({ trainId: req.params.trainId });
  const bookedCount = train.seats.filter(seat => seat.bookedBy).length;
  res.json({ ...train.toObject(), bookedCount });
});

router.post('/book/:trainId/:seatNumber', auth, async (req, res) => {
  const train = await Train.findOne({ trainId: req.params.trainId });
  const seat = train.seats.find(seat => seat.number == req.params.seatNumber);
  if (!seat || seat.bookedBy) return res.status(400).send('Seat not available');
  seat.bookedBy = req.user.username;
  seat.bookedAt = new Date();
  await train.save();
  res.send('Booked');
});

router.delete('/trains/:trainId', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  await Train.deleteOne({ trainId: req.params.trainId });
  res.sendStatus(204);
});

router.get('/my-bookings', auth, async (req, res) => {
  if (req.user.role !== 'user') return res.status(403).send('Forbidden');
  const trains = await Train.find({});
  const bookings = trains.flatMap(train =>
    train.seats
      .filter(seat => seat.bookedBy === req.user.username)
      .map(seat => ({
        trainName: train.trainName,
        trainId: train.trainId,
        seatNumber: seat.number,
        bookedAt: seat.bookedAt
      }))
  );
  res.json(bookings);
});

router.get('/export-bookings', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  const trains = await Train.find({});
  const bookings = trains.flatMap(train =>
    train.seats
      .filter(seat => seat.bookedBy)
      .map(seat => ({
        trainName: train.trainName,
        trainId: train.trainId,
        seatNumber: seat.number,
        bookedBy: seat.bookedBy,
        bookedAt: seat.bookedAt
      }))
  );
  exportBookingsToCSV(bookings);
  res.download('bookings.csv');
});

module.exports = router;
