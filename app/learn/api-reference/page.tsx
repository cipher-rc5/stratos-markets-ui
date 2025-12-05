import Link from 'next/link';
import Navbar from '../../../components/navbar';

export default function ApiReferencePage() {
  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />

      <div className='max-w-[1200px] mx-auto px-6 md:px-12 py-20'>
        <Link href='/learn' className='inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#ccff00] mb-8 transition-colors'>
          ← Back to Learn
        </Link>

        <div className='inline-block border border-[#ccff00]/30 bg-[#ccff00]/10 px-4 py-1 text-[10px] font-mono text-[#ccff00] uppercase tracking-widest mb-8'>
          ● DOCUMENTATION: API REFERENCE
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-['Orbitron'] mb-6">API Reference</h1>
        <p className='text-gray-400 text-lg mb-12'>Complete REST API documentation for integrating Stratos into your applications.</p>

        <div className='prose prose-invert max-w-none'>
          <div className='bg-black border border-gray-900 p-8 mb-8'>
            <h2 className='text-2xl font-bold text-[#ccff00] mb-4'>Authentication</h2>
            <p className='text-gray-400 mb-4'>
              All API requests require authentication using an API key. Include your API key in the request header:
            </p>
            <div className='bg-gray-950 border border-gray-800 p-4 rounded font-mono text-sm text-gray-300'>
              <code>Authorization: Bearer YOUR_API_KEY</code>
            </div>
          </div>

          <div className='bg-black border border-gray-900 p-8 mb-8'>
            <h2 className='text-2xl font-bold text-[#ccff00] mb-4'>Endpoints</h2>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-bold text-white mb-2'>GET /api/strategies</h3>
                <p className='text-gray-400 mb-3'>Retrieve all available trading strategies.</p>
                <div className='bg-gray-950 border border-gray-800 p-4 rounded font-mono text-sm text-gray-300 mb-3'>
                  <code>
                    {`curl -X GET https://api.stratos.markets/v1/strategies \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </code>
                </div>
                <div className='text-xs text-gray-500 uppercase tracking-wider mb-2'>Response:</div>
                <div className='bg-gray-950 border border-gray-800 p-4 rounded font-mono text-xs text-gray-300'>
                  <pre>{`{
  "strategies": [
    {
      "id": "strat_abc123",
      "name": "DCA Bitcoin Strategy",
      "performance": {
        "roi": 24.5,
        "sharpeRatio": 1.8
      }
    }
  ]
}`}</pre>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-bold text-white mb-2'>POST /api/strategies/deploy</h3>
                <p className='text-gray-400 mb-3'>Deploy a strategy to your account.</p>
                <div className='bg-gray-950 border border-gray-800 p-4 rounded font-mono text-sm text-gray-300'>
                  <code>
                    {`curl -X POST https://api.stratos.markets/v1/strategies/deploy \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"strategyId": "strat_abc123", "capital": 1000}'`}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-black border border-gray-900 p-8'>
            <h2 className='text-2xl font-bold text-[#ccff00] mb-4'>Rate Limits</h2>
            <p className='text-gray-400'>
              API requests are limited to 100 requests per minute. Exceeding this limit will result in a 429 status code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
