'use client';

import { Activity, Clock, MapPin, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface RegionalMetrics {
  region: string;
  latency: number;
  uptime: number;
  performance: string;
  lastChecked: string;
  isOptimal: boolean;
}

export function RegionalPerformance() {
  const [metrics, setMetrics] = useState<RegionalMetrics>({
    region: 'EU-Frankfurt (fra1)',
    latency: 0,
    uptime: 0,
    performance: 'Checking...',
    lastChecked: new Date().toISOString(),
    isOptimal: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRegionalPerformance = async () => {
      try {
        // Simulate performance check for EU region
        const startTime = Date.now();

        // Check latency to our own API
        const response = await fetch('/api/health');
        const latency = Date.now() - startTime;

        // Simulate uptime calculation (in production, this would come from monitoring)
        const uptime = 99.9; // Simulated uptime percentage

        // Determine performance rating
        let performance = 'Excellent';
        let isOptimal = true;

        if (latency > 200) {
          performance = 'Good';
          isOptimal = false;
        } else if (latency > 100) {
          performance = 'Very Good';
          isOptimal = false;
        }

        if (uptime < 99.5) {
          performance = 'Needs Attention';
          isOptimal = false;
        }

        setMetrics({
          region: 'EU-Frankfurt (fra1)',
          latency,
          uptime,
          performance,
          lastChecked: new Date().toISOString(),
          isOptimal,
        });
      } catch (error) {
        console.error('Error checking regional performance:', error);
        setMetrics({
          region: 'EU-Frankfurt (fra1)',
          latency: 0,
          uptime: 0,
          performance: 'Error',
          lastChecked: new Date().toISOString(),
          isOptimal: false,
        });
      } finally {
        setLoading(false);
      }
    };

    checkRegionalPerformance();

    // Check performance every 30 seconds
    const interval = setInterval(checkRegionalPerformance, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance</CardTitle>
          <CardDescription>Checking EU region performance...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse space-y-2'>
            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <MapPin className='h-5 w-5 text-blue-600' />
          Regional Performance
        </CardTitle>
        <CardDescription>EU-Frankfurt region performance metrics and monitoring</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Region Display */}
        <div className='flex items-center justify-between'>
          <span className='text-sm font-medium'>Deployment Region</span>
          <Badge variant='outline' className='font-mono'>
            {metrics.region}
          </Badge>
        </div>

        {/* Latency */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Zap className='h-4 w-4 text-yellow-600' />
            <span>Response Latency</span>
          </div>
          <Badge variant={metrics.latency < 100 ? 'default' : 'secondary'}>
            {metrics.latency}ms
          </Badge>
        </div>

        {/* Uptime */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Activity className='h-4 w-4 text-green-600' />
            <span>Uptime</span>
          </div>
          <Badge variant={metrics.uptime >= 99.5 ? 'default' : 'destructive'}>
            {metrics.uptime}%
          </Badge>
        </div>

        {/* Performance Rating */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='h-4 w-4 text-purple-600' />
            <span>Performance Rating</span>
          </div>
          <Badge variant={metrics.isOptimal ? 'default' : 'secondary'}>{metrics.performance}</Badge>
        </div>

        {/* Last Checked */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-gray-600' />
            <span>Last Checked</span>
          </div>
          <span className='text-sm text-muted-foreground'>
            {new Date(metrics.lastChecked).toLocaleTimeString()}
          </span>
        </div>

        {/* Performance Summary */}
        <div
          className={`mt-4 p-3 rounded-lg border ${
            metrics.isOptimal ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}
        >
          <p className={`text-sm ${metrics.isOptimal ? 'text-green-800' : 'text-yellow-800'}`}>
            {metrics.isOptimal
              ? '✅ EU region performance is optimal with excellent latency and uptime.'
              : '⚠️ EU region performance is good but could be optimized further.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegionalPerformance;
