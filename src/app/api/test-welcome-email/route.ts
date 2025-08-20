import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test if React Email is working
    const { render } = await import('@react-email/render');

    return NextResponse.json({
      success: true,
      message: 'React Email render function available',
      renderAvailable: typeof render === 'function',
    });
  } catch (error) {
    console.error('Error importing React Email:', error);
    return NextResponse.json(
      {
        error: 'Failed to import React Email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
