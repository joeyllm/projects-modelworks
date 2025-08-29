// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from the correct path
dotenv.config({ path: require('path').join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set in environment variables');
  console.log('Create a .env file in your server directory with:');
  console.log('OPENAI_API_KEY=your_api_key_here');
} else {
  console.log('✅ OpenAI API key loaded');
}

// Middleware
app.use(cors());
app.use(express.json());

// Chat endpoint - passes requests directly to OpenAI
app.post('/api/chat', async (req, res) => {
  try {
    // Check if API key exists for this request
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OpenAI API key not configured on server'
      });
    }

    const body = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error Details:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    res.status(500).json({
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
