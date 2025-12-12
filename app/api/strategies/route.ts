// file: app/api/strategies/route.ts
// description: Strategies API proxy with local sample fallback
// reference: lib/sample_strategies.json

import sampleStrategies from '@/lib/sample_strategies.json' assert { type: 'json' };
import { NextRequest, NextResponse } from 'next/server';

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;

type Performance = { roi: number, sharpeRatio: number, maxDrawdown: number, winRate?: number, totalTrades?: number };
type Pricing = { type: 'flat' | 'percentage' | 'free', amount: number, currency: string };

const performanceById: Record<string, Performance> = {
  'eth-usdc-weekly-dca': { roi: 7.2, sharpeRatio: 1.08, maxDrawdown: -8.4 },
  'aave-usdc-supply-loop': { roi: 9.8, sharpeRatio: 1.22, maxDrawdown: -11.5 },
  'eth-btc-60-40-rebal': { roi: 6.4, sharpeRatio: 0.94, maxDrawdown: -14.1 },
  'steth-leverage-loop': { roi: 14.6, sharpeRatio: 1.35, maxDrawdown: -18.2 },
  'stable-mm-basis': { roi: 5.1, sharpeRatio: 0.88, maxDrawdown: -6.7 }
};

const pricingById: Record<string, Pricing> = {
  'eth-usdc-weekly-dca': { type: 'flat', amount: 9, currency: 'USD' },
  'aave-usdc-supply-loop': { type: 'flat', amount: 12, currency: 'USD' },
  'eth-btc-60-40-rebal': { type: 'flat', amount: 10, currency: 'USD' },
  'steth-leverage-loop': { type: 'flat', amount: 14, currency: 'USD' },
  'stable-mm-basis': { type: 'flat', amount: 8, currency: 'USD' }
};

const subscribersById: Record<string, number> = {
  'eth-usdc-weekly-dca': 1420,
  'aave-usdc-supply-loop': 980,
  'eth-btc-60-40-rebal': 760,
  'steth-leverage-loop': 620,
  'stable-mm-basis': 540
};

const normalizeSample = (sample: any, index: number) => {
  const now = new Date().toISOString();
  return {
    id: sample.id,
    name: sample.metadata?.name || sample.id,
    description: sample.metadata?.description || 'Sample strategy from local catalog',
    creator: sample.components?.vault?.id || 'stratos',
    version: sample.version || '1.0.0',
    performance: performanceById[sample.id] || { roi: 5 + index, sharpeRatio: 1 + index * 0.1, maxDrawdown: -10 - index },
    pricing: pricingById[sample.id] || { type: 'flat', amount: 0, currency: 'USD' },
    tags: sample.metadata?.tags || [],
    subscribers: subscribersById[sample.id] || 500 + index * 75,
    createdAt: now,
    updatedAt: now,
    category: sample.metadata?.category || 'general',
    verified: true,
    riskLevel: sample.metadata?.riskLevel || 'medium'
  };
};

const applyFilters = (strategies: any[], searchParams?: URLSearchParams) => {
  if (!searchParams) return strategies;
  let filtered = [...strategies];

  const category = searchParams.get('category');
  if (category) {
    const normalizedCategory = category.toLowerCase();
    filtered = filtered.filter((s) => (s.category || '').toLowerCase() === normalizedCategory);
  }

  const search = searchParams.get('search');
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter((s) =>
      s.name?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      (s.tags || []).some((tag: string) => tag.toLowerCase().includes(term))
    );
  }

  return filtered;
};

const respondWithSamples = (searchParams?: URLSearchParams) => {
  const normalized = sampleStrategies.map(normalizeSample);
  const filtered = applyFilters(normalized, searchParams);
  return NextResponse.json({ success: true, data: filtered, source: 'local-fallback' }, { status: 200 });
};

const isCatalogConfigured = () => Boolean(CATALOG_API_BASE_URL);

// GET /api/strategies - List all strategies with optional filtering (live)
export async function GET(request: NextRequest) {
  try {
    if (!isCatalogConfigured()) {
      return respondWithSamples(new URL(request.url).searchParams);
    }
    const { searchParams } = new URL(request.url);

    const upstreamParams = new URLSearchParams();
    searchParams.forEach((value, key) => upstreamParams.append(key, value));

    const response = await fetch(`${CATALOG_API_BASE_URL}/strategies${upstreamParams.toString() ? `?${upstreamParams.toString()}` : ''}`);
    if (!response.ok) {
      if (response.status === 404) {
        return respondWithSamples(searchParams);
      }
      const fallback = `Upstream strategies request failed (${response.status} ${response.statusText})`;
      return NextResponse.json({ success: false, error: fallback }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch strategies' }, { status: 502 });
  }
}

// POST /api/strategies - Create a new strategy via upstream service
export async function POST(request: NextRequest) {
  try {
    if (!ensureCatalogConfigured()) {
      return NextResponse.json({ success: false, error: 'STRATOS_DATA_API_BASE_URL is not configured.' }, { status: 200 });
    }
    const body = await request.json();

    const response = await fetch(`${CATALOG_API_BASE_URL}/strategies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const fallback = data.error || `Failed to create strategy upstream (${response.status} ${response.statusText})`;
      return NextResponse.json({ success: false, error: fallback }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: data?.data || data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create strategy' }, { status: 502 });
  }
}
