// file: app/api/agents/[id]/route.ts
// description: Dynamic agent API route for fetching, updating, and deleting catalog agents
// reference: process.env.STRATOS_DATA_API_BASE_URL

import { NextRequest, NextResponse } from 'next/server';

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;
const FALLBACK_MESSAGES = {
  fetch: 'Failed to fetch agent',
  update: 'Failed to update agent',
  delete: 'Failed to delete agent'
};

const ensureCatalogConfigured = () => {
  if (!CATALOG_API_BASE_URL) {
    throw new Error('STRATOS_DATA_API_BASE_URL is not configured. Live agent data cannot be fetched.');
  }
};

const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

// GET /api/agents/[id] - Get agent by ID
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;
    const response = await fetch(`${CATALOG_API_BASE_URL}/agents/${id}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error || 'Agent not found';
      const status = response.status === 404 ? 404 : 502;
      return NextResponse.json({ success: false, error: errorMessage }, { status });
    }

    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.fetch);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

// PATCH /api/agents/[id] - Update agent
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${CATALOG_API_BASE_URL}/agents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || 'Failed to update agent upstream');
    }

    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.update);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

// DELETE /api/agents/[id] - Delete agent
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    ensureCatalogConfigured();
    const { id } = await params;

    const response = await fetch(`${CATALOG_API_BASE_URL}/agents/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error || FALLBACK_MESSAGES.delete);
    }

    return NextResponse.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error: unknown) {
    const message = getErrorMessage(error, FALLBACK_MESSAGES.delete);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
