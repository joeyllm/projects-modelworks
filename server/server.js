const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config({ path: require('path').join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.warn('OPENAI_API_KEY is not set. Create server/.env with OPENAI_API_KEY=your_key');
}

const client = new OpenAI({ apiKey: openaiApiKey });

app.post('/api/chat', async (req, res) => {
  try {
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'Server missing OpenAI API key' });
    }

    const { conversation, docsContext } = req.body || {};

    const system = [
      'You are an AI assistant helping hospital clinical coders communicate with clinicians.',
      'Be concise, professional, and reference clinical facts from the provided docs context when helpful.',
      'Follow Australian Coding Standards where relevant. If uncertain, ask a specific follow-up question.'
    ].join(' ');

    const convoText = Array.isArray(conversation)
      ? conversation
          .map(m => `${m.senderType === 'coder' ? 'Coder' : 'Clinician'}: ${m.message}`)
          .join('\n')
      : '';

    const contextText = docsContext ? `\n\nRelevant documents/context:\n${docsContext}` : '';

    const userPrompt = `Conversation so far:\n${convoText}${contextText}\n\nPlease draft the next message from the coder to the clinician, ensuring clarity and compliance.`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const text = response.choices?.[0]?.message?.content?.trim() || '';
    return res.json({ text });
  } catch (err) {
    console.error('OpenAI error:', err?.message || err);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
