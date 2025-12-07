import { NextResponse } from 'next/server';

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'Stratos Markets API',
    version: '0.0.1',
    description:
      'Internal API surface for the Stratos Markets UI. Portfolio data is served from Dune when configured, with mock fallbacks in development.'
  },
  servers: [{ url: '/' }],
  tags: [
    { name: 'Portfolio', description: 'Wallet portfolio data and history' },
    { name: 'Agents', description: 'Agent catalog, lifecycle, and execution' },
    { name: 'Strategies', description: 'Strategy catalog and subscriptions' },
    { name: 'Market', description: 'Market snapshots and chart data' }
  ],
  paths: {
    '/api/portfolio/{address}': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get live portfolio (Dune-backed with mock fallback)',
        parameters: [{
          name: 'address',
          in: 'path',
          required: true,
          schema: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' },
          description: 'Wallet address to fetch'
        }, {
          name: 'chain_ids',
          in: 'query',
          required: false,
          schema: { type: 'string', example: '1,137' },
          description: 'Comma-separated EVM chain IDs to scope balances/positions'
        }],
        responses: {
          200: {
            description: 'Portfolio data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    balances: { type: 'array', items: { $ref: '#/components/schemas/DuneBalance' } },
                    transactions: { type: 'array', items: { $ref: '#/components/schemas/DuneTransaction' } },
                    defiPositions: { type: 'array', items: { $ref: '#/components/schemas/DuneDefiPosition' } }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid wallet address' }
        }
      }
    },
    '/api/portfolio': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get mock portfolio snapshot',
        parameters: [{ name: 'walletAddress', in: 'query', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Mock portfolio payload',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { success: { type: 'boolean' }, data: { $ref: '#/components/schemas/Portfolio' } } }
              }
            }
          },
          400: { description: 'Missing walletAddress' }
        }
      },
      post: {
        tags: ['Portfolio'],
        summary: 'Create or update a portfolio (mock persistence)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  walletAddress: { type: 'string' },
                  assets: { type: 'array', items: { $ref: '#/components/schemas/PortfolioAsset' } },
                  performance: { $ref: '#/components/schemas/PortfolioPerformance' },
                  activeStrategies: { type: 'array', items: { type: 'string' } },
                  activeAgents: { type: 'array', items: { type: 'string' } }
                },
                required: ['walletAddress']
              }
            }
          }
        },
        responses: { 201: { description: 'Portfolio created/updated' }, 400: { description: 'Validation error' } }
      }
    },
    '/api/portfolio/history': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get historical portfolio equity curve',
        parameters: [{ name: 'walletAddress', in: 'query', required: true, schema: { type: 'string' } }, {
          name: 'timeframe',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['7d', '30d', '90d', '1y', 'all'], default: '30d' }
        }],
        responses: { 200: { description: 'Historical data points' }, 400: { description: 'Missing walletAddress' } }
      }
    },
    '/api/portfolio/transactions': {
      get: {
        tags: ['Portfolio'],
        summary: 'Get transaction history (mock)',
        parameters: [
          { name: 'walletAddress', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'type', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'status', in: 'query', required: false, schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } }
        ],
        responses: {
          200: {
            description: 'Transaction list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { success: { type: 'boolean' }, data: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } } }
                }
              }
            }
          },
          400: { description: 'Missing walletAddress' }
        }
      }
    },
    '/api/agents': {
      get: {
        tags: ['Agents'],
        summary: 'List agents with filters, sorting, and pagination',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'subscribers' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Agent list' } }
      },
      post: {
        tags: ['Agents'],
        summary: 'Deploy a new agent (mock)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'creator', 'type'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  creator: { type: 'string' },
                  type: { type: 'string' },
                  capabilities: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Agent created' }, 400: { description: 'Validation error' } }
      }
    },
    '/api/agents/{id}': {
      get: {
        tags: ['Agents'],
        summary: 'Get agent by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Agent detail' }, 404: { description: 'Not found' } }
      },
      patch: {
        tags: ['Agents'],
        summary: 'Update agent metadata',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } }
      },
      delete: {
        tags: ['Agents'],
        summary: 'Delete agent (mock)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } }
      }
    },
    '/api/agents/{id}/execute': {
      post: {
        tags: ['Agents'],
        summary: 'Execute an agent for a wallet',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['walletAddress'],
                properties: { walletAddress: { type: 'string' }, parameters: { type: 'object', additionalProperties: true } }
              }
            }
          }
        },
        responses: { 202: { description: 'Execution started' }, 400: { description: 'Validation error' } }
      },
      get: {
        tags: ['Agents'],
        summary: 'Execution history for an agent',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'walletAddress', in: 'query', schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } }
        ],
        responses: { 200: { description: 'Execution history' } }
      }
    },
    '/api/strategies': {
      get: {
        tags: ['Strategies'],
        summary: 'List strategies with filters and pagination',
        parameters: [
          { name: 'tag', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'riskLevel', in: 'query', schema: { type: 'string' } },
          { name: 'verified', in: 'query', schema: { type: 'boolean' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'subscribers' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } }
        ],
        responses: { 200: { description: 'Strategy list' } }
      },
      post: {
        tags: ['Strategies'],
        summary: 'Create a new strategy (mock)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'creator', 'version'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  creator: { type: 'string' },
                  version: { type: 'string' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Strategy created' }, 400: { description: 'Validation error' } }
      }
    },
    '/api/strategies/{id}': {
      get: {
        tags: ['Strategies'],
        summary: 'Get strategy by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Strategy detail' }, 404: { description: 'Not found' } }
      },
      patch: {
        tags: ['Strategies'],
        summary: 'Update strategy metadata',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true },
        responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } }
      },
      delete: {
        tags: ['Strategies'],
        summary: 'Delete a strategy (mock)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } }
      }
    },
    '/api/strategies/{id}/subscribe': {
      post: {
        tags: ['Strategies'],
        summary: 'Subscribe a wallet to a strategy',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', required: ['walletAddress'], properties: { walletAddress: { type: 'string' } } }
            }
          }
        },
        responses: { 201: { description: 'Subscribed' }, 400: { description: 'Validation error' } }
      },
      delete: {
        tags: ['Strategies'],
        summary: 'Unsubscribe a wallet from a strategy',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, {
          name: 'walletAddress',
          in: 'query',
          required: true,
          schema: { type: 'string' }
        }],
        responses: { 200: { description: 'Unsubscribed' }, 400: { description: 'Validation error' } }
      }
    },
    '/api/market': {
      get: {
        tags: ['Market'],
        summary: 'Get market overview for multiple assets',
        parameters: [
          { name: 'symbols', in: 'query', schema: { type: 'string', example: 'ETH,BTC' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'marketCap' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } }
        ],
        responses: { 200: { description: 'Market data list' } }
      }
    },
    '/api/market/{symbol}': {
      get: {
        tags: ['Market'],
        summary: 'Get detailed market data for a symbol',
        parameters: [{ name: 'symbol', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Market detail' }, 404: { description: 'Not found' } }
      }
    },
    '/api/market/{symbol}/chart': {
      get: {
        tags: ['Market'],
        summary: 'Get chart-ready OHLCV data for a symbol',
        parameters: [
          { name: 'symbol', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'range', in: 'query', schema: { type: 'string', example: '30d' } },
          { name: 'interval', in: 'query', schema: { type: 'string', example: '1d', default: '1h' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 100 } }
        ],
        responses: { 200: { description: 'Chart data points' } }
      }
    }
  },
  components: {
    schemas: {
      PortfolioAsset: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
          name: { type: 'string' },
          amount: { type: 'number' },
          value: { type: 'number' },
          valueUSD: { type: 'number' },
          price: { type: 'number' },
          priceChange24h: { type: 'number' },
          allocation: { type: 'number' }
        }
      },
      PortfolioPerformance: {
        type: 'object',
        properties: {
          totalValue: { type: 'number' },
          totalValueUSD: { type: 'number' },
          dailyChange: { type: 'number' },
          dailyChangePercent: { type: 'number' },
          weeklyChange: { type: 'number' },
          weeklyChangePercent: { type: 'number' },
          monthlyChange: { type: 'number' },
          monthlyChangePercent: { type: 'number' },
          allTimeHigh: { type: 'number' },
          allTimeLow: { type: 'number' }
        }
      },
      Portfolio: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          walletAddress: { type: 'string' },
          assets: { type: 'array', items: { $ref: '#/components/schemas/PortfolioAsset' } },
          performance: { $ref: '#/components/schemas/PortfolioPerformance' },
          activeStrategies: { type: 'array', items: { type: 'string' } },
          activeAgents: { type: 'array', items: { type: 'string' } },
          lastUpdated: { type: 'string', format: 'date-time' }
        }
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          hash: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          from: { type: 'string' },
          to: { type: 'string' },
          assetIn: { type: 'object' },
          assetOut: { type: 'object' },
          fee: { type: 'object' },
          relatedStrategyId: { type: 'string' },
          relatedAgentId: { type: 'string' }
        }
      },
      Agent: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          creator: { type: 'string' },
          version: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          capabilities: { type: 'array', items: { type: 'string' } },
          pricing: { type: 'object' },
          metrics: { type: 'object' },
          tags: { type: 'array', items: { type: 'string' } },
          subscribers: { type: 'integer' },
          verified: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Strategy: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          creator: { type: 'string' },
          version: { type: 'string' },
          performance: { type: 'object' },
          pricing: { type: 'object' },
          tags: { type: 'array', items: { type: 'string' } },
          subscribers: { type: 'integer' },
          category: { type: 'string' },
          verified: { type: 'boolean' },
          riskLevel: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      MarketData: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          priceChange24h: { type: 'number' },
          priceChangePercent24h: { type: 'number' },
          volume24h: { type: 'number' },
          marketCap: { type: 'number' },
          high24h: { type: 'number' },
          low24h: { type: 'number' },
          circulatingSupply: { type: 'number' },
          totalSupply: { type: 'number' },
          lastUpdated: { type: 'string', format: 'date-time' }
        }
      },
      DuneBalance: {
        type: 'object',
        properties: {
          chain: { type: 'string' },
          chain_id: { type: 'integer' },
          address: { type: 'string' },
          amount: { type: 'string' },
          symbol: { type: 'string' },
          name: { type: 'string' },
          decimals: { type: 'integer' },
          price_usd: { type: 'number' },
          value_usd: { type: 'number' }
        }
      },
      DuneTransaction: {
        type: 'object',
        properties: {
          chain: { type: 'string' },
          chain_id: { type: 'integer' },
          hash: { type: 'string' },
          block_number: { type: 'integer' },
          block_timestamp: { type: 'string', format: 'date-time' },
          from_address: { type: 'string' },
          to_address: { type: 'string' },
          value: { type: 'string' },
          gas_price: { type: 'string' },
          gas_used: { type: 'integer' },
          transaction_fee: { type: 'string' },
          status: { type: 'integer' },
          method_id: { type: 'string' }
        }
      },
      DuneDefiPosition: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          chain_id: { type: 'integer' },
          protocol: { type: 'string' },
          token: { type: 'string' },
          token_name: { type: 'string' },
          token_symbol: { type: 'string' },
          usd_value: { type: 'number' }
        }
      }
    }
  }
};

export async function GET() {
  return NextResponse.json(spec);
}
