import { NextRequest, NextResponse } from 'next/server';

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;

const ensureCatalogConfigured = () => {
  if (!CATALOG_API_BASE_URL) {
    return false;
  }
  return true;
};

// GET /api/agents - List all agents with optional filtering (live)
export async function GET(request: NextRequest) {
  try {
    if (!ensureCatalogConfigured()) {
      return NextResponse.json({ success: false, error: 'STRATOS_DATA_API_BASE_URL is not configured.' }, { status: 200 });
    }
    const { searchParams } = new URL(request.url);

    const upstreamParams = new URLSearchParams();
    searchParams.forEach((value, key) => upstreamParams.append(key, value));

    const response = await fetch(`${CATALOG_API_BASE_URL}/agents${upstreamParams.toString() ? `?${upstreamParams.toString()}` : ''}`);
    if (!response.ok) {
      const fallback = `Upstream agents request failed (${response.status} ${response.statusText})`;
      return NextResponse.json({ success: false, error: fallback }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch agents' }, { status: 502 });
  }
}

// POST /api/agents - Deploy a new agent via upstream service
export async function POST(request: NextRequest) {
  try {
    if (!ensureCatalogConfigured()) {
      return NextResponse.json({ success: false, error: 'STRATOS_DATA_API_BASE_URL is not configured.' }, { status: 200 });
    }
    const body = await request.json();

    const response = await fetch(`${CATALOG_API_BASE_URL}/agents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const fallback = data?.error || `Failed to deploy agent upstream (${response.status} ${response.statusText})`;
      return NextResponse.json({ success: false, error: fallback }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: data?.data || data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to deploy agent' }, { status: 502 });
  }
}
