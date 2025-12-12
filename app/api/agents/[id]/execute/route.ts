// file: app/api/agents/[id]/execute/route.ts
// description: Agent execution API route for triggering and reading execution runs from the catalog service
// reference: process.env.STRATOS_DATA_API_BASE_URL

import { NextRequest, NextResponse } from 'next/server';

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;
const FALLBACK_MESSAGES = { execute: 'Failed to execute agent', history: 'Failed to fetch execution history' };

const ensureCatalogConfigured = () => {
  if (!CATALOG_API_BASE_URL) {
    throw new Error('STRATOS_DATA_API_BASE_URL is not configured. Live agent execution is unavailable.');
  }
};

const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

// POST /api/agents/[id]/execute - Execute an agent via upstream
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;
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
      throw new Error(data?.error || FALLBACK_MESSAGES.execute);
    }

    return NextResponse.json({ success: true, data: data?.data || data }, { status: 202 });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.execute);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

// GET /api/agents/[id]/execute - Get execution history from upstream
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const upstreamParams = new URLSearchParams();
    searchParams.forEach((value, key) => upstreamParams.append(key, value));

    const response = await fetch(
      `${CATALOG_API_BASE_URL}/agents/${id}/execute${upstreamParams.toString() ? `?${upstreamParams.toString()}` : ''}`
    );
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.error || FALLBACK_MESSAGES.history);
    }

    return NextResponse.json({ success: true, data: data?.data || data, meta: data?.meta });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.history);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
