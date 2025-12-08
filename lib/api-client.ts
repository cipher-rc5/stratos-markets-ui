// API Client for Stratos Markets UI
// Uses native fetch with Bun runtime optimizations

const API_BASE_URL = typeof window !== 'undefined' ?
  '/api' // Client-side: use relative path
   :
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'; // Server-side: use absolute path

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: any;
}

// API Client class
class StratosApiClient {
  private baseUrl: string;

  constructor (baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic request method
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('[v0] API Request:', url); // Debug logging

      const response = await fetch(url, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });

      console.log('[v0] API Response status:', response.status); // Debug logging

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        const isHtml = text && text.trim().startsWith('<');
        data = { error: isHtml ? `HTTP ${response.status} ${response.statusText}` : text };
      }

      if (!response.ok) {
        return { success: false, error: data.error || `HTTP error! status: ${response.status}` };
      }

      return data;
    } catch (error: any) {
      console.error(`[v0] API Error [${endpoint}]:`, error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  }

  // Strategies API
  strategies = {
    // List strategies with optional filters
    list: async (
      params?: {
        category?: string,
        verified?: boolean,
        riskLevel?: string,
        minRoi?: number,
        maxRoi?: number,
        search?: string,
        sortBy?: string,
        order?: 'asc' | 'desc',
        limit?: number,
        offset?: number
      }
    ) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const query = queryParams.toString();
      return this.request<any[]>(`/strategies${query ? `?${query}` : ''}`);
    },

    // Get strategy by ID
    get: async (id: string) => {
      return this.request<any>(`/strategies/${id}`);
    },

    // Create new strategy
    create: async (data: any) => {
      return this.request<any>('/strategies', { method: 'POST', body: JSON.stringify(data) });
    },

    // Update strategy
    update: async (id: string, data: any) => {
      return this.request<any>(`/strategies/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },

    // Delete strategy
    delete: async (id: string) => {
      return this.request<any>(`/strategies/${id}`, { method: 'DELETE' });
    },

    // Subscribe to strategy
    subscribe: async (id: string, walletAddress: string) => {
      return this.request<any>(`/strategies/${id}/subscribe`, { method: 'POST', body: JSON.stringify({ walletAddress }) });
    },

    // Unsubscribe from strategy
    unsubscribe: async (id: string, walletAddress: string) => {
      return this.request<any>(`/strategies/${id}/subscribe?walletAddress=${walletAddress}`, { method: 'DELETE' });
    }
  };

  // Agents API
  agents = {
    // List agents with optional filters
    list: async (
      params?: {
        type?: string,
        status?: string,
        verified?: boolean,
        minSuccessRate?: number,
        search?: string,
        sortBy?: string,
        order?: 'asc' | 'desc',
        limit?: number,
        offset?: number
      }
    ) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const query = queryParams.toString();
      return this.request<any[]>(`/agents${query ? `?${query}` : ''}`);
    },

    // Get agent by ID
    get: async (id: string) => {
      return this.request<any>(`/agents/${id}`);
    },

    // Deploy new agent
    deploy: async (data: any) => {
      return this.request<any>('/agents', { method: 'POST', body: JSON.stringify(data) });
    },

    // Update agent
    update: async (id: string, data: any) => {
      return this.request<any>(`/agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },

    // Delete agent
    delete: async (id: string) => {
      return this.request<any>(`/agents/${id}`, { method: 'DELETE' });
    },

    // Execute agent
    execute: async (id: string, walletAddress: string, parameters?: any) => {
      return this.request<any>(`/agents/${id}/execute`, { method: 'POST', body: JSON.stringify({ walletAddress, parameters }) });
    },

    // Get execution history
    getExecutions: async (id: string, walletAddress?: string, limit = 20, offset = 0) => {
      const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
      if (walletAddress) params.append('walletAddress', walletAddress);
      return this.request<any[]>(`/agents/${id}/execute?${params.toString()}`);
    }
  };

  // Portfolio API
  portfolio = {
    // Get portfolio for wallet
    get: async (walletAddress: string) => {
      return this.request<any>(`/portfolio?walletAddress=${walletAddress}`);
    },

    // Create/update portfolio
    update: async (walletAddress: string, data: any) => {
      return this.request<any>('/portfolio', { method: 'POST', body: JSON.stringify({ walletAddress, ...data }) });
    },

    // Get portfolio history
    getHistory: async (walletAddress: string, timeframe = '30d') => {
      return this.request<any[]>(`/portfolio/history?walletAddress=${walletAddress}&timeframe=${timeframe}`);
    },

    // Get transactions
    getTransactions: async (walletAddress: string, params?: { type?: string, status?: string, limit?: number, offset?: number }) => {
      const queryParams = new URLSearchParams({ walletAddress });
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }

      return this.request<any[]>(`/portfolio/transactions?${queryParams.toString()}`);
    }
  };

  // Market Data API
  market = {
    // Get market data for multiple assets
    list: async (params?: { symbols?: string[], limit?: number, sortBy?: string, order?: 'asc' | 'desc' }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.symbols) {
          queryParams.append('symbols', params.symbols.join(','));
        }
        if (params.limit) {
          queryParams.append('limit', params.limit.toString());
        }
        if (params.sortBy) {
          queryParams.append('sortBy', params.sortBy);
        }
        if (params.order) {
          queryParams.append('order', params.order);
        }
      }

      const query = queryParams.toString();
      return this.request<any[]>(`/market${query ? `?${query}` : ''}`);
    },

    // Get detailed market data for specific asset
    get: async (symbol: string) => {
      return this.request<any>(`/market/${symbol}`);
    },

    // Get chart data
    getChart: async (symbol: string, interval = '1h', limit = 100) => {
      return this.request<any[]>(`/market/${symbol}/chart?interval=${interval}&limit=${limit}`);
    }
  };
}

// Export singleton instance
export const apiClient = new StratosApiClient();

// Export class for custom instances
export default StratosApiClient;
