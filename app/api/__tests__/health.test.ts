import { NextRequest } from 'next/server';
import { GET } from '../../api/health/route';

describe('/api/health', () => {
  it('should return health status', async () => {
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
      service: 'calcbuilder-pro',
    });
  });

  it('should return valid timestamp', async () => {
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    
    const data = await response.json();
    const timestamp = new Date(data.timestamp);
    
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });
});