import { NextRequest, NextResponse } from 'next/server';

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;

const ensureCatalogConfigured = () => {
  if (!CATALOG_API_BASE_URL) {
    throw new Error('STRATOS_DATA_API_BASE_URL is not configured. Live agent execution is unavailable.');
  }
};

// POST /api/agents/[id]/execute - Execute an agent via upstream
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    ensureCatalogConfigured();
    const { id } = params;
    const body = await request.json();

    if (!body.walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    const response = await fetch(`${CATALOG_API_BASE_URL}/agents/${id}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || 'Failed to initiate agent execution');
    }

    return NextResponse.json({ success: true, data: data?.data || data }, { status: 202 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to execute agent' }, { status: 502 });
  }
}

// GET /api/agents/[id]/execute - Get execution history from upstream
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    ensureCatalogConfigured();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const upstreamParams = new URLSearchParams();
    searchParams.forEach((value, key) => upstreamParams.append(key, value));

    const response = await fetch(
      `${CATALOG_API_BASE_URL}/agents/${id}/execute${upstreamParams.toString() ? `?${upstreamParams.toString()}` : ''}`
    );
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to fetch execution history');
    }

    return NextResponse.json({ success: true, data: data?.data || data, meta: data?.meta });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch execution history' }, { status: 502 });
  }
}
