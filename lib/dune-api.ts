// Dune Analytics Sim API integration for live DeFi portfolio data
// This file should only be used in Server Components, Server Actions, or Route Handlers

const DUNE_API_BASE_URL = 'https://api.sim.dune.com';
const DUNE_API_KEY = process.env.DUNE_API_KEY || '';

const CHAIN_CODE_TO_ID: Record<string, number> = {
  eth: 1,
  mainnet: 1,
  op: 10,
  optimism: 10,
  bsc: 56,
  bnb: 56,
  arb: 42161,
  arbitrum: 42161,
  matic: 137,
  polygon: 137,
  avax: 43114,
  avalanche: 43114,
  base: 8453,
  celo: 42220
};

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

const isDuneApiConfigured = () => Boolean(DUNE_API_KEY && DUNE_API_KEY.length > 0);

const resolveChainIds = (chainCodes?: Array<string | number>): number[] => {
  if (!chainCodes || chainCodes.length === 0) {
    return [1]; // default to Ethereum mainnet to ensure at least one chain
  }

  const resolved = chainCodes.map((code) => {
    if (typeof code === 'number') return code;
    const normalized = code.toLowerCase();
    return CHAIN_CODE_TO_ID[normalized];
  }).filter((id): id is number => Boolean(id));

  if (resolved.length === 0) {
    throw new Error('At least one valid chain code is required (e.g., eth, arb, op, base, matic).');
  }

  return resolved;
};

// Fetch token balances for a wallet across multiple chains
export async function fetchBalances(walletAddress: string, chainCodes?: Array<string | number>): Promise<DuneBalance[]> {
  if (!isDuneApiConfigured()) {
    console.error('[v0] Dune API key not configured. Returning empty balances.');
    return [];
  }

  try {
    const chainIds = resolveChainIds(chainCodes);
    const chainParam = chainIds.length ? `?chain_ids=${chainIds.join(',')}` : '';
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
    return [];
  }
}

// Fetch transaction history for a wallet
export async function fetchTransactions(walletAddress: string, chainCodes?: Array<string | number>, decode = true): Promise<DuneTransaction[]> {
  if (!isDuneApiConfigured()) {
    console.error('[v0] Dune API key not configured. Returning empty transactions.');
    return [];
  }

  try {
    const chainIds = resolveChainIds(chainCodes);
    const params = new URLSearchParams();
    if (chainIds?.length) params.append('chain_ids', chainIds.join(','));
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
    return [];
  }
}

// Fetch DeFi positions for a wallet
export async function fetchDefiPositions(walletAddress: string, chainCodes?: Array<string | number>): Promise<DuneDefiPosition[]> {
  if (!isDuneApiConfigured()) {
    console.error('[v0] Dune API key not configured. Returning empty DeFi positions.');
    return [];
  }

  try {
    const chainIds = resolveChainIds(chainCodes);
    const chainParam = chainIds.length ? `?chain_ids=${chainIds.join(',')}` : '';
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
    return [];
  }
}

// Fetch all portfolio data in parallel
export async function fetchPortfolioData(walletAddress: string, chainCodes?: Array<string | number>) {
  const chainIds = resolveChainIds(chainCodes);
  const [balances, transactions, defiPositions] = await Promise.all([
    fetchBalances(walletAddress, chainIds),
    fetchTransactions(walletAddress, chainIds),
    fetchDefiPositions(walletAddress, chainIds)
  ]);

  return { balances, transactions, defiPositions };
}
