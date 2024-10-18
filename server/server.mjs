import cors from 'cors';
import { promises as fs } from 'node:fs';
import express from 'express';

// Initialize Express app
const app = express();
// Use CORS middleware to allow all CORS requests
app.use(cors());
// app.use(express.json()); // Add middleware to parse JSON bodies

app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Adjust the limit as needed

// Serve localfile on GET request to /localfile
app.get('/localfile', async (req, res) => {
  try {
    const data = await fs.readFile("C:\\Users\\matej.martan\\Documents\\Test projects\\server\\Stream.docx");
    const url = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // Replace with your actual URL

    // Assuming the file is a Word document, adjust Content-Type accordingly
    //res.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.json({ url: url });
    //res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error reading file');
  }
});

app.post('/localHtml', (req, res) => {
  try {
    const { htmlContent } = req.body;
    console.log('Received HTML content:', htmlContent);

    res.status(200).json({ message: 'HTML content received successfully', data: htmlContent });
  } catch (error) {
    console.error('Error handling /localHtml POST request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create an HTTP server
const server = app.listen(3000, () => {
  console.log('Listening on 127.0.0.1:3000');
});

// Initialize WebSocket server instance
// const wss = new WebSocketServer({ server, path: '/localHtml' });

// wss.on('connection', (ws) => {
//   console.log('New client connected');

//   ws.on('message', (message) => {
//     console.log('Received:', message.toString());
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });