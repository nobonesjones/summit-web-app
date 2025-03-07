// Simple test script to check Perplexity API connection
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

async function testPerplexity() {
  try {
    console.log('Testing Perplexity API connection...');
    
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'What are the latest trends in business planning?' }
        ],
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        }
      }
    );

    console.log('Perplexity API connection successful!');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error connecting to Perplexity API:', error.response ? error.response.data : error.message);
  }
}

testPerplexity(); 