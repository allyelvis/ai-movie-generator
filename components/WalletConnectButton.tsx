import React from 'react';
import { WalletIcon } from './icons/WalletIcon';

interface WalletConnectButtonProps {
  onConnect: () => void;
  connectedAddress: string | null;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ onConnect, connectedAddress }) => {
  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <button
      onClick={onConnect}
      className="flex items-center justify-center gap-2 text-sm font-orbitron py-2 px-4 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
      aria-label="Connect Wallet"
    >
      <WalletIcon className="w-5 h-5" />
      {connectedAddress ? (
        <span className="font-mono">{truncateAddress(connectedAddress)}</span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
};