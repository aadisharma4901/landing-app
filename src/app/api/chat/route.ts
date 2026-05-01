import { NextRequest, NextResponse } from 'next/server';
import { OPENROUTER_API_KEY } from '@/lib/config';
import { SYSTEM_PROMPT, DEFAULT_MODEL, OPENROUTER_API_URL } from '@/lib/openrouter';
import { products } from '@/data/products';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get user message
    let userMessage = '';
    
    if (body.message) {
      userMessage = body.message;
    } else if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
      userMessage = body.messages[body.messages.length - 1].message;
    } else {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Prepare full product context with details
    const productContext = products.map(p => `${p.id} | ${p.name} | $${p.price} | ${p.category} | ${p.description}`).join('\n');

    // Build full system prompt with product knowledge
    const fullSystemPrompt = `${SYSTEM_PROMPT}\n\nCURRENT PRODUCTS IN STORE:\n${productContext}`;

    // OpenRouter format messages
    const messages = [
      { role: 'system', content: fullSystemPrompt },
      { role: 'user', content: userMessage }
    ];

    const requestBody = {
      model: DEFAULT_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 200
    };

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://banazon.example.com',
        'X-Title': 'Banazon AI Assistant'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'AI service unavailable. Please try again.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantReply = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({
      message: assistantReply
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
