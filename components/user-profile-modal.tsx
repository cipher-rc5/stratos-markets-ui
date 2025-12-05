'use client';
import { echo } from '@/lib/chain';
import { useUserProfileStore } from '@/lib/user-profile-store';
import { useLogout, usePrivy } from '@privy-io/react-auth';
import { type WalletWithMetadata } from '@privy-io/react-auth';
import { Check, Copy, LogOut, Upload, User, Wallet, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { createPublicClient, formatEther, http } from 'viem';

export function UserProfileModal({ onCloseAction }: { onCloseAction: () => void }) {
  const { user } = usePrivy();
  const { logout } = useLogout();
  const { getProfile, updateProfile } = useUserProfileStore();

  const [displayName, setDisplayName] = useState('');
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const embeddedWallet = user?.linkedAccounts?.find((account): account is WalletWithMetadata =>
    account.type === 'wallet' && account.walletClientType === 'privy'
  );

  const address = embeddedWallet?.address as `0x${string}` | undefined;

  useEffect(() => {
    if (user) {
      const profile = getProfile(user.id);
      if (profile) {
        setDisplayName(profile.displayName || '');
        setImagePreview(profile.profileImage || '');
      }
    }
  }, [user, getProfile]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      try {
        const client = createPublicClient({ chain: echo, transport: http() });

        const balanceResult = await client.getBalance({ address });
        setBalance(formatEther(balanceResult));
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance('0');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  const handleSave = () => {
    if (user) {
      updateProfile(user.id, { displayName: displayName || undefined, profileImage: imagePreview || undefined });
      onCloseAction();
    }
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user || !address) return null;

  return (
    <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-gray-900 border border-gray-800 rounded-lg max-w-2xl w-full p-8 relative'>
        <button onClick={onCloseAction} className='absolute top-4 right-4 text-gray-400 hover:text-white transition-colors'>
          <X className='w-6 h-6' />
        </button>

        <h2 className='text-3xl font-bold text-[#ccff00] mb-6 font-orbitron'>Profile Settings</h2>

        <div className='space-y-6'>
          {/* Profile Image */}
          <div className='flex items-center gap-6'>
            <div className='relative'>
              {imagePreview ?
                (
                  <img
                    src={imagePreview || '/placeholder.svg'}
                    alt='Profile'
                    className='w-24 h-24 rounded-full object-cover border-2 border-[#ccff00]' />
                ) :
                (
                  <div className='w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center'>
                    <User className='w-12 h-12 text-gray-600' />
                  </div>
                )}
              <label className='absolute bottom-0 right-0 bg-[#ccff00] p-2 rounded-full cursor-pointer hover:bg-[#b3e600] transition-colors'>
                <Upload className='w-4 h-4 text-black' />
                <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
              </label>
            </div>
            <div>
              <p className='text-sm text-gray-400 mb-1'>Profile Picture</p>
              <p className='text-xs text-gray-500'>Upload a custom avatar</p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className='block text-sm text-gray-400 mb-2'>Display Name</label>
            <input
              type='text'
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder='Enter custom name'
              className='w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-[#ccff00] transition-colors' />
          </div>

          {/* Privy DID */}
          <div>
            <label className='block text-sm text-gray-400 mb-2'>Privy ID (Privacy Protected)</label>
            <div className='bg-gray-800 border border-gray-700 rounded-md px-4 py-3 font-mono text-sm text-gray-300 break-all'>
              {user.id}
            </div>
            <p className='text-xs text-gray-500 mt-1'>Your unique decentralized identifier</p>
          </div>

          {/* Wallet Address */}
          <div>
            <label className='text-sm text-gray-400 mb-2 flex items-center gap-2'>
              <Wallet className='w-4 h-4' />
              Embedded Wallet Address
            </label>
            <div className='flex items-center gap-2'>
              <div className='flex-1 bg-gray-800 border border-gray-700 rounded-md px-4 py-3 font-mono text-sm text-gray-300 break-all'>
                {address}
              </div>
              <button
                onClick={handleCopy}
                className='bg-gray-800 border border-gray-700 rounded-md px-4 py-3 hover:bg-gray-700 transition-colors'>
                {copied ? <Check className='w-5 h-5 text-[#ccff00]' /> : <Copy className='w-5 h-5 text-gray-400' />}
              </button>
            </div>
          </div>

          {/* Balance */}
          <div>
            <label className='block text-sm text-gray-400 mb-2'>Balance</label>
            <div className='bg-gray-800 border border-gray-700 rounded-md px-4 py-3'>
              {isLoading ?
                <span className='text-gray-500'>Loading...</span> :
                <span className='text-2xl font-bold text-[#ccff00]'>{Number.parseFloat(balance).toFixed(4)} ECH</span>}
            </div>
            <a
              href='https://test.core.app/tools/testnet-faucet/?avalanche-l1=echo&token=echo'
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs text-[#ccff00] hover:underline mt-1 inline-block'>
              Get testnet tokens from faucet
            </a>
          </div>

          {/* Actions */}
          <div className='flex gap-4 pt-4'>
            <button
              onClick={handleSave}
              className='flex-1 bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold px-6 py-3 rounded-md uppercase tracking-wider transition-colors'>
              Save Changes
            </button>
            <button
              onClick={() => {
                logout();
                onCloseAction();
              }}
              className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-md uppercase tracking-wider transition-colors'>
              <LogOut className='w-5 h-5' />
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
