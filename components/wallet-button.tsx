'use client';
import { useLogin, usePrivy } from '@privy-io/react-auth';
import { type WalletWithMetadata } from '@privy-io/react-auth';
import { User, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useUserProfileStore } from '../lib/user-profile-store';
import { UserProfileModal } from './user-profile-modal';

export function WalletButton() {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const getProfile = useUserProfileStore((state) => state.getProfile);

  if (!ready) {
    return (
      <button className='bg-gray-700 text-gray-400 font-bold px-6 py-2.5 tracking-widest uppercase text-xl cursor-not-allowed'>
        Loading...
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className='bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold px-6 py-2.5 tracking-widest uppercase transition-colors text-xl flex items-center gap-2'>
        <Wallet className='w-5 h-5' />
        Connect
      </button>
    );
  }

  const embeddedWallet = user?.linkedAccounts?.find((account): account is WalletWithMetadata =>
    account.type === 'wallet' && account.walletClientType === 'privy'
  );

  const profile = user ? getProfile(user.id) : undefined;
  const displayName = profile?.displayName || `${embeddedWallet?.address?.slice(0, 6)}...${embeddedWallet?.address?.slice(-4)}`;

  return (
    <>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setShowProfileModal(true)}
          className='bg-[#ccff00] hover:bg-[#b3e600] text-black font-bold px-6 py-2.5 tracking-widest uppercase transition-colors text-xl flex items-center gap-2'>
          {profile?.profileImage ?
            <img src={profile.profileImage || '/placeholder.svg'} alt='Profile' className='w-6 h-6 rounded-full object-cover' /> :
            <User className='w-5 h-5' />}
          {displayName}
        </button>
      </div>

      {showProfileModal && <UserProfileModal onCloseAction={() => setShowProfileModal(false)} />}
    </>
  );
}
