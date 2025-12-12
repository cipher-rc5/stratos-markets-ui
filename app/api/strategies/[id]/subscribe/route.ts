// file: app/api/strategies/[id]/subscribe/route.ts
// description: Strategy subscription API route for creating and removing subscriptions
// reference: app/api/strategies/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

const SUBSCRIBE_ERROR_MESSAGE = 'Failed to subscribe to strategy';
const UNSUBSCRIBE_ERROR_MESSAGE = 'Failed to unsubscribe from strategy';

const getErrorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);

// POST /api/strategies/[id]/subscribe - Subscribe to a strategy
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    // In production, this would:
    // 1. Verify wallet ownership
    // 2. Process payment
    // 3. Create subscription record
    // 4. Update strategy subscriber count

    const subscription = {
      id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      strategyId: id,
      walletAddress: body.walletAddress,
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: null, // null for perpetual subscriptions
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ success: true, data: subscription, message: 'Successfully subscribed to strategy' }, { status: 201 });
  } catch (error: unknown) {
    const message = getErrorMessage(error, SUBSCRIBE_ERROR_MESSAGE);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE /api/strategies/[id]/subscribe - Unsubscribe from a strategy
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
      return NextResponse.json({ success: false, error: 'Wallet address is required' }, { status: 400 });
    }

    // In production, this would:
    // 1. Verify wallet ownership
    // 2. Update subscription status
    // 3. Update strategy subscriber count

    return NextResponse.json({ success: true, message: 'Successfully unsubscribed from strategy' });
  } catch (error: unknown) {
    const message = getErrorMessage(error, UNSUBSCRIBE_ERROR_MESSAGE);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
