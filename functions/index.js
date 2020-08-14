const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: true,
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
}));

