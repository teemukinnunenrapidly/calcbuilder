'use client';

import { Analytics } from '@vercel/analytics/react';

interface VercelAnalyticsProps {
  mode?: 'production' | 'development';
  debug?: boolean;
}

export function VercelAnalytics({ mode = 'production', debug = false }: VercelAnalyticsProps) {
  // Only render analytics in production or when explicitly enabled
  if (mode === 'development' && !debug) {
    return null;
  }

  return <Analytics mode={mode} debug={debug} />;
}

export default VercelAnalytics;
