import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from 'nodemailer';

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Serve the service worker with correct MIME type
  app.get('/service-worker.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.sendFile('service-worker.js', { root: './public' });
  });

  // Serve the manifest with correct MIME type
  app.get('/manifest.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.sendFile('manifest.json', { root: './public' });
  });
  
  // Serve SVG icons with correct MIME type
  app.get('/icons/:filename', (req, res) => {
    if (req.params.filename.endsWith('.svg')) {
      res.set('Content-Type', 'image/svg+xml');
      res.sendFile(req.params.filename, { root: './public/icons' });
    } else {
      res.status(404).send('Not found');
    }
  });

  // Contact form route
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please provide name, email and message' });
      }
      
      // Import the email service functions
      const { formatContactEmail, sendEmail } = await import('./emailService');

      // The recipient would typically be your email address
      const recipient = process.env.EMAIL_RECIPIENT || 'portfolio.owner@example.com';
      
      // Format and send the email
      const emailMessage = formatContactEmail({ name, email, subject, message }, recipient);
      const result = await sendEmail(emailMessage);
      
      res.status(200).json({ 
        message: 'Message sent successfully',
        // Include the preview URL in development mode for testing
        previewUrl: process.env.NODE_ENV !== 'production' ? result.previewUrl : undefined 
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
