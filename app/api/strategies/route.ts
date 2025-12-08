// file: app/api/strategies/route.ts
// description: Strategies API proxy with local sample fallback
// reference: lib/sample_strategies.json

import { NextRequest, NextResponse } from 'next/server';
import sampleStrategies from '@/lib/sample_strategies.json' assert { type: 'json' };

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;

const respondWithSamples = () =>
  NextResponse.json({ success: true, data: sampleStrategies, source: 'local-fallback' }, { status: 200 });

const isCatalogConfigured = () => Boolean(CATALOG_API_BASE_URL);

// GET /api/strategies - List all strategies with optional filtering (live)
export async function GET(request: NextRequest) {
  try {
    if (!isCatalogConfigured()) {
      return respondWithSamples();
    }
    const { searchParams } = new URL(request.url);

    const upstreamParams = new URLSearchParams();
    searchParams.forEach((value, key) => upstreamParams.append(key, value));

    const response = await fetch(`${CATALOG_API_BASE_URL}/strategies${upstreamParams.toString() ? `?${upstreamParams.toString()}` : ''}`);
    if (!response.ok) {
      if (response.status === 404) {
        return respondWithSamples();
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
