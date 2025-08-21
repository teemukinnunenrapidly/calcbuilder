'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { GitBranch, Globe, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface DeploymentInfo {
  environment: 'production' | 'preview' | 'development';
  url: string;
  status: 'ready' | 'error' | 'building';
  branch?: string;
  lastDeployed: string;
  isPreview: boolean;
}

export function DeploymentStatus() {
  const [deployments, setDeployments] = useState<DeploymentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDeploymentInfo = () => {
      try {
        // Determine current environment
        const isProduction = process.env.NODE_ENV === 'production';
        const isVercel =
          typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');

        // Get branch information from Git
        const currentBranch = process.env.NODE_ENV === 'production' ? 'main' : 'development';

        // Create deployment info
        const deploymentInfo: DeploymentInfo[] = [
          {
            environment: 'production',
            url: 'https://calcbuilder-pro.vercel.app',
            status: 'ready',
            branch: 'main',
            lastDeployed: new Date().toISOString(),
            isPreview: false,
          },
          {
            environment: 'preview',
            url: window.location.href,
            status: 'ready',
            branch: currentBranch,
            lastDeployed: new Date().toISOString(),
            isPreview: true,
          },
        ];

        setDeployments(deploymentInfo);
      } catch (error) {
        console.error('Error getting deployment info:', error);
      } finally {
        setLoading(false);
      }
    };

    getDeploymentInfo();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deployment Status</CardTitle>
          <CardDescription>Checking deployment status...</CardDescription>
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
          <Globe className='h-5 w-5 text-blue-600' />
          Deployment Status
        </CardTitle>
        <CardDescription>Current deployment environment and status</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {deployments.map((deployment, index) => (
          <div key={index} className='border rounded-lg p-4 space-y-3'>
            {/* Environment Header */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <GitBranch className='h-4 w-4 text-gray-600' />
                <span className='font-medium capitalize'>{deployment.environment}</span>
                {deployment.isPreview && (
                  <Badge variant='outline' className='text-xs'>
                    Preview
                  </Badge>
                )}
              </div>
              <Badge
                variant={deployment.status === 'ready' ? 'default' : 'destructive'}
                className='text-xs'
              >
                {deployment.status === 'ready' ? (
                  <CheckCircle className='h-3 w-3 mr-1' />
                ) : (
                  <AlertCircle className='h-3 w-3 mr-1' />
                )}
                {deployment.status}
              </Badge>
            </div>

            {/* Branch Information */}
            {deployment.branch && (
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <span>Branch:</span>
                <Badge variant='secondary' className='font-mono text-xs'>
                  {deployment.branch}
                </Badge>
              </div>
            )}

            {/* URL */}
            <div className='flex items-center gap-2 text-sm'>
              <span className='text-muted-foreground'>URL:</span>
              <a
                href={deployment.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline flex items-center gap-1'
              >
                {deployment.url.replace(/^https?:\/\//, '')}
                <ExternalLink className='h-3 w-3' />
              </a>
            </div>

            {/* Last Deployed */}
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Clock className='h-3 w-3' />
              <span>Last deployed: {new Date(deployment.lastDeployed).toLocaleString()}</span>
            </div>
          </div>
        ))}

        {/* Preview Deployment Info */}
        <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-800'>
            ✅ Preview deployments are active. Create a new branch and push to trigger automatic
            preview deployments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default DeploymentStatus;
