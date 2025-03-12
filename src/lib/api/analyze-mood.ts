// app/api/analyze-mood/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { entries, prompt } = await request.json();

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: 'No entries provided for analysis' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a mental health analysis assistant, skilled in analyzing mood patterns and providing helpful, encouraging insights and recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysisText = completion.choices[0].message.content;
    
    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse the JSON response
    const analysis = JSON.parse(analysisText);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return NextResponse.json(
      { error: 'Error analyzing mood data' },
      { status: 500 }
    );
  }
}