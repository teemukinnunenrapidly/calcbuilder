import { NextResponse } from 'next/server';

// Use Edge Runtime for fastest possible response (only in production)
export const runtime = process.env.NODE_ENV === 'production' ? 'edge' : 'nodejs';

// Cache this response for 5 minutes
export const revalidate = 300;

export async function GET() {
  const startTime = Date.now();

  // Simulate some lightweight processing
  const data = {
    message: 'Performance test endpoint',
    timestamp: new Date().toISOString(),
    responseTime: 0,
    features: {
      edgeRuntime: true,
      isr: true,
      vercelOptimized: true,
    },
    performance: {
      memory: 'Optimized for Edge Runtime',
      latency: 'Minimal due to Edge deployment',
      caching: 'ISR enabled with 5-minute revalidation',
    },
  };

  const responseTime = Date.now() - startTime;
  data.responseTime = responseTime;

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'X-Edge-Runtime': 'true',
      'X-ISR-Enabled': 'true',
    },
  });
}
