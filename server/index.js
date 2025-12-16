import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GeminiProvider } from './providers/gemini.js';
import { OpenRouterProvider } from './providers/openrouter.js';

// Load environment variables
dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize providers
let geminiProvider = null;
let openRouterProvider = null;

if (process.env.GEMINI_API_KEY) {
  geminiProvider = new GeminiProvider(process.env.GEMINI_API_KEY);
  console.log('✅ Gemini provider initialized');
} else {
  console.log('⚠️  Gemini API key not found');
}

if (process.env.OPENROUTER_API_KEY) {
  openRouterProvider = new OpenRouterProvider(process.env.OPENROUTER_API_KEY);
  console.log('✅ OpenRouter provider initialized');
} else {
  console.log('⚠️  OpenRouter API key not found');
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    providers: {
      gemini: !!geminiProvider,
      openrouter: !!openRouterProvider
    }
  });
});

// Get available models endpoint
app.get('/api/models', async (req, res) => {
  try {
    const models = [];

    // Add Gemini models
    if (geminiProvider) {
      models.push(
        {
          id: 'gemini-2.5-flash',
          name: 'Gemini 2.5 Flash',
          provider: 'gemini',
          description: 'Fast and efficient - Google',
          cost: 'Low'
        },
        {
          id: 'gemini-2.5-pro',
          name: 'Gemini 2.5 Pro',
          provider: 'gemini',
          description: 'Most capable - Google',
          cost: 'Medium'
        }
      );
    }

    // Add OpenRouter models (curated list of popular models)
    if (openRouterProvider) {
      const popularModels = [
        {
          id: 'deepseek/deepseek-chat',
          name: 'DeepSeek Chat',
          provider: 'openrouter',
          description: 'Excellent quality, very cheap',
          cost: 'Very Low'
        },
        {
          id: 'deepseek/deepseek-r1',
          name: 'DeepSeek R1',
          provider: 'openrouter',
          description: 'Reasoning model - best for complex tasks',
          cost: 'Very Low'
        },
        {
          id: 'openai/gpt-4o',
          name: 'GPT-4o',
          provider: 'openrouter',
          description: 'Powerful and fast - OpenAI',
          cost: 'High'
        },
        {
          id: 'openai/gpt-4o-mini',
          name: 'GPT-4o Mini',
          provider: 'openrouter',
          description: 'Fast and affordable - OpenAI',
          cost: 'Low'
        },
        {
          id: 'anthropic/claude-3.5-sonnet',
          name: 'Claude 3.5 Sonnet',
          provider: 'openrouter',
          description: 'Excellent for creative writing - Anthropic',
          cost: 'Medium'
        },
        {
          id: 'anthropic/claude-3-haiku',
          name: 'Claude 3 Haiku',
          provider: 'openrouter',
          description: 'Fast and efficient - Anthropic',
          cost: 'Low'
        },
        {
          id: 'google/gemini-2.0-flash-exp:free',
          name: 'Gemini 2.0 Flash (Free)',
          provider: 'openrouter',
          description: 'Free tier - Google via OpenRouter',
          cost: 'Free'
        },
        {
          id: 'meta-llama/llama-3.3-70b-instruct',
          name: 'Llama 3.3 70B',
          provider: 'openrouter',
          description: 'Open source, great quality - Meta',
          cost: 'Low'
        },
        {
          id: 'mistralai/mistral-large',
          name: 'Mistral Large',
          provider: 'openrouter',
          description: 'High quality European model - Mistral',
          cost: 'Medium'
        },
        {
          id: 'qwen/qwen-2.5-72b-instruct',
          name: 'Qwen 2.5 72B',
          provider: 'openrouter',
          description: 'Excellent multilingual model - Alibaba',
          cost: 'Low'
        }
      ];

      models.push(...popularModels);
    }

    res.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// Generate guide endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { topic, description, provider, modelId } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    console.log(`\n🚀 Generating guide for: "${topic}"`);
    console.log(`   Provider: ${provider}`);
    console.log(`   Model: ${modelId}`);

    let result;

    if (provider === 'gemini') {
      if (!geminiProvider) {
        return res.status(503).json({ error: 'Gemini provider not configured. Add GEMINI_API_KEY to .env.local' });
      }
      result = await geminiProvider.generateGuide(topic, description, modelId);
    } else if (provider === 'openrouter') {
      if (!openRouterProvider) {
        return res.status(503).json({ error: 'OpenRouter provider not configured. Add OPENROUTER_API_KEY to .env.local' });
      }
      result = await openRouterProvider.generateGuide(topic, description, modelId);
    } else {
      return res.status(400).json({ error: 'Invalid provider. Use "gemini" or "openrouter"' });
    }

    console.log('✅ Guide generated successfully!');
    res.json(result);

  } catch (error) {
    console.error('❌ Generation error:', error.message);
    res.status(500).json({
      error: 'Failed to generate guide',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n🎓 ════════════════════════════════════════════════');
  console.log('   EduGen Backend Server');
  console.log('   ════════════════════════════════════════════════');
  console.log(`   🌐 Server running on: http://localhost:${PORT}`);
  console.log(`   📡 API endpoints:`);
  console.log(`      GET  /health       - Server status`);
  console.log(`      GET  /api/models   - Available models`);
  console.log(`      POST /api/generate - Generate guide`);
  console.log('   ════════════════════════════════════════════════\n');

  if (!geminiProvider && !openRouterProvider) {
    console.log('   ⚠️  WARNING: No API keys configured!');
    console.log('   Please add GEMINI_API_KEY or OPENROUTER_API_KEY to .env.local\n');
  }
});
