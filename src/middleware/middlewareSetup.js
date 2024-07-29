// src/middleware/middlewareSetup.js
import express from 'express';
import path from 'path';

export default function setupMiddleware(app) {
  app.use(express.json());
  app.use(express.static('public'));
}
