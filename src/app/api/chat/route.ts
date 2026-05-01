import { NextRequest, NextResponse } from 'next/server';
import { OPENROUTER_API_KEY } from '@/lib/config';
import { SYSTEM_PROMPT, DEFAULT_MODEL, OpenRouterMessage } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Build conversation history with system prompt
    const apiMessages: OpenRouterMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: { type: string; message: string }) => ({
        role: 'user' as const,
        content: msg.message
      }))
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://banazon.example.com',
        'X-Title': 'Banazon AI Assistant'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 150
      })
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
    const assistantReply = data.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({
      message: assistantReply,
      model: data.model
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
