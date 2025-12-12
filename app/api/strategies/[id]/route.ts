// file: app/api/strategies/[id]/route.ts
// description: Dynamic strategy API route providing fetch, update, and delete operations via the catalog service
// reference: process.env.STRATOS_DATA_API_BASE_URL

import { NextRequest, NextResponse } from 'next/server';

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;
const FALLBACK_MESSAGES = {
  fetch: 'Failed to fetch strategy',
  update: 'Failed to update strategy',
  delete: 'Failed to delete strategy'
};

const ensureCatalogConfigured = () => {
  if (!CATALOG_API_BASE_URL) {
    throw new Error('STRATOS_DATA_API_BASE_URL is not configured. Live strategy data cannot be fetched.');
  }
};

const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

// GET /api/strategies/[id] - Get strategy by ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;
    const response = await fetch(`${CATALOG_API_BASE_URL}/strategies/${id}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error || 'Strategy not found';
      const status = response.status === 404 ? 404 : 502;
      return NextResponse.json({ success: false, error: errorMessage }, { status });
    }

    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.fetch);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

// PATCH /api/strategies/[id] - Update strategy
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${CATALOG_API_BASE_URL}/strategies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || FALLBACK_MESSAGES.update);
    }

    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.update);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

// DELETE /api/strategies/[id] - Delete strategy
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;

    const response = await fetch(`${CATALOG_API_BASE_URL}/strategies/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error || FALLBACK_MESSAGES.delete);
    }

    return NextResponse.json({ success: true, message: 'Strategy deleted successfully' });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.delete);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
