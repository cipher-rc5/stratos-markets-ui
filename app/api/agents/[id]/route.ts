import { NextRequest, NextResponse } from 'next/server';

const CATALOG_API_BASE_URL = process.env.STRATOS_DATA_API_BASE_URL;

const ensureCatalogConfigured = () => {
  if (!CATALOG_API_BASE_URL) {
    throw new Error('STRATOS_DATA_API_BASE_URL is not configured. Live agent data cannot be fetched.');
  }
};

// GET /api/agents/[id] - Get agent by ID
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    ensureCatalogConfigured();
    const { id } = params;
    const response = await fetch(`${CATALOG_API_BASE_URL}/agents/${id}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error || 'Agent not found';
      const status = response.status === 404 ? 404 : 502;
      return NextResponse.json({ success: false, error: errorMessage }, { status });
    }

    return NextResponse.json({ success: true, data: data?.data || data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch agent' }, { status: 502 });
  }
}

// PATCH /api/agents/[id] - Update agent
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    ensureCatalogConfigured();
    const { id } = params;
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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to update agent' }, { status: 502 });
  }
}

// DELETE /api/agents/[id] - Delete agent
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    ensureCatalogConfigured();
    const { id } = params;

    const response = await fetch(`${CATALOG_API_BASE_URL}/agents/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error || 'Failed to delete agent upstream');
    }

    return NextResponse.json({ success: true, message: 'Agent deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete agent' }, { status: 502 });
  }
}
