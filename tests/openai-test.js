// Simple test script to check OpenAI API connection
require('dotenv').config({ path: '.env.local' });
const OpenAI = require('openai');

async function testOpenAI() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('Testing OpenAI API connection...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, can you hear me?' }
      ],
      max_tokens: 50
    });

    console.log('OpenAI API connection successful!');
    console.log('Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error connecting to OpenAI API:', error);
  }
}

testOpenAI();
