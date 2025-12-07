// Dune Analytics Sim API integration for real-time DeFi portfolio data
// This file should only be used in Server Components, Server Actions, or Route Handlers

const DUNE_API_BASE_URL = 'https://api.sim.dune.com';
const DUNE_API_KEY = process.env.DUNE_API_KEY || '';

// API response types based on Dune documentation
export interface DuneBalance {
  chain: string;
  chain_id: number;
  address: string;
  amount: string;
  symbol: string;
  name: string;
  decimals: number;
  price_usd: number;
  value_usd: number;
  pool_size?: number;
  low_liquidity?: boolean;
  logo?: string;
}

export interface DuneTransaction {
  chain: string;
  chain_id: number;
  hash: string;
  block_number: number;
  block_timestamp: string;
  from_address: string;
  to_address: string | null;
  value: string;
  gas_price: string;
  gas_used: number;
  transaction_fee: string;
  status: number;
  method_id: string | null;
  decoded?: { function_name: string, parameters: Record<string, any> };
}

export interface DuneDefiPosition {
  type: 'UniswapV2' | 'Nft' | 'Tokenized' | 'CompoundV2' | 'CompoundV3' | 'Moonwell';
  chain_id: number;
  protocol: string;
  token?: string;
  token_name?: string;
  token_symbol?: string;
  pool?: string;
  token0?: string;
  token0_name?: string;
  token0_symbol?: string;
  token0_decimals?: number;
  token1?: string;
  token1_name?: string;
  token1_symbol?: string;
  token1_decimals?: number;
  usd_value: number;
  calculated_balance?: number;
  price_in_usd?: number;
  logo?: string | null;
  positions?: Array<
    {
      tick_lower?: number,
      tick_upper?: number,
      token_id?: string,
      token0_price?: number,
      token0_holdings?: number,
      token0_rewards?: number,
      token1_price?: number,
      token1_holdings?: number,
      token1_rewards?: number
    }
  >;
  supply_quote?: { calculated_balance: number, price_in_usd: number, usd_value: number };
  debt_quote?: { calculated_balance: number, price_in_usd: number, usd_value: number };
}

const isDuneApiConfigured = () => {
  return DUNE_API_KEY && DUNE_API_KEY.length > 0;
};

const getMockBalances =
  (): DuneBalance[] => [{
    chain: 'ethereum',
    chain_id: 1,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    amount: '2500000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    price_usd: 3500,
    value_usd: 8750
  }, {
    chain: 'ethereum',
    chain_id: 1,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    amount: '5000000000',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    price_usd: 1,
    value_usd: 5000
  }];

const getMockTransactions =
  (): DuneTransaction[] => [{
    chain: 'ethereum',
    chain_id: 1,
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    block_number: 18000000,
    block_timestamp: new Date(Date.now() - 3600000).toISOString(),
    from_address: '0x0000000000000000000000000000000000000000',
    to_address: '0x0000000000000000000000000000000000000001',
    value: '1000000000000000000',
    gas_price: '50000000000',
    gas_used: 21000,
    transaction_fee: '1050000000000000',
    status: 1,
    method_id: '0xa9059cbb',
    decoded: { function_name: 'transfer', parameters: { recipient: '0x...', amount: '1000000000000000000' } }
  }];

const getMockDefiPositions =
  (): DuneDefiPosition[] => [{
    type: 'CompoundV2',
    chain_id: 1,
    protocol: 'Aave V3',
    token: '0x...',
    token_name: 'USD Coin',
    token_symbol: 'USDC',
    usd_value: 12500,
    supply_quote: { calculated_balance: 12500, price_in_usd: 1, usd_value: 12500 }
  }];

// Fetch token balances for a wallet across multiple chains
export async function fetchBalances(walletAddress: string, chainIds?: number[]): Promise<DuneBalance[]> {
  if (!isDuneApiConfigured()) {
    console.log('[v0] Dune API key not configured, returning mock balances');
    return getMockBalances();
  }

  try {
    const chainParam = chainIds ? `?chain_ids=${chainIds.join(',')}` : '';
    const response = await fetch(`${DUNE_API_BASE_URL}/v1/evm/balances/${walletAddress}${chainParam}`, {
      headers: { 'X-Sim-Api-Key': DUNE_API_KEY }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[v0] Dune API balances error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch balances: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.balances || [];
  } catch (error) {
    console.error('[v0] Error fetching balances:', error);
    return getMockBalances();
  }
}

// Fetch transaction history for a wallet
export async function fetchTransactions(walletAddress: string, chainIds?: number[], decode = true): Promise<DuneTransaction[]> {
  if (!isDuneApiConfigured()) {
    console.log('[v0] Dune API key not configured, returning mock transactions');
    return getMockTransactions();
  }

  try {
    const params = new URLSearchParams();
    if (chainIds) params.append('chain_ids', chainIds.join(','));
    if (decode) params.append('decode', 'true');
    params.append('limit', '50');

    const response = await fetch(`${DUNE_API_BASE_URL}/v1/evm/transactions/${walletAddress}?${params.toString()}`, {
      headers: { 'X-Sim-Api-Key': DUNE_API_KEY }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[v0] Dune API transactions error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.transactions || [];
  } catch (error) {
    console.error('[v0] Error fetching transactions:', error);
    return getMockTransactions();
  }
}

// Fetch DeFi positions for a wallet
export async function fetchDefiPositions(walletAddress: string, chainIds?: number[]): Promise<DuneDefiPosition[]> {
  if (!isDuneApiConfigured()) {
    console.log('[v0] Dune API key not configured, returning mock positions');
    return getMockDefiPositions();
  }

  try {
    const chainParam = chainIds ? `?chain_ids=${chainIds.join(',')}` : '';
    const response = await fetch(`${DUNE_API_BASE_URL}/beta/evm/defi/positions/${walletAddress}${chainParam}`, {
      headers: { 'X-Sim-Api-Key': DUNE_API_KEY }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[v0] Dune API positions error: ${response.status} ${response.statusText} - ${errorText}`);
      throw new Error(`Failed to fetch DeFi positions: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.positions || [];
  } catch (error) {
    console.error('[v0] Error fetching DeFi positions:', error);
    return getMockDefiPositions();
  }
}

// Fetch all portfolio data in parallel
export async function fetchPortfolioData(walletAddress: string, chainIds?: number[]) {
  const [balances, transactions, defiPositions] = await Promise.all([
    fetchBalances(walletAddress, chainIds),
    fetchTransactions(walletAddress, chainIds),
    fetchDefiPositions(walletAddress, chainIds)
  ]);

  return { balances, transactions, defiPositions };
}
