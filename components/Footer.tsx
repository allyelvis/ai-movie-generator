
import React, { useState, useEffect } from 'react';

const BlockchainStatus: React.FC = () => {
    const [status, setStatus] = useState('Connecting...');
    const [blockNumber, setBlockNumber] = useState<string | null>(null);

    useEffect(() => {
        const WS_URL = 'wss://blockchain.googleapis.com/v1/projects/sokoni-44ef1-7e082/locations/us-central1/endpoints/ethereum-holesky/rpc?key=AIzaSyATKuT1ysLn1qkZBLAsG0uWLnzJSMhLGyQ';
        let ws: WebSocket;
        let timeoutId: number;

        const connect = () => {
            ws = new WebSocket(WS_URL);

            ws.onopen = () => {
                setStatus('Connected');
                ws.send(JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_subscribe',
                    params: ['newHeads']
                }));
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.method === 'eth_subscription' && data.params?.result?.number) {
                        const blockNum = parseInt(data.params.result.number, 16);
                        setBlockNumber(blockNum.toString());
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
                setStatus('Error');
                ws.close();
            };

            ws.onclose = () => {
                setStatus('Disconnected');
                setBlockNumber(null);
                // Attempt to reconnect after a delay
                timeoutId = window.setTimeout(connect, 5000);
            };
        };

        connect();

        return () => {
            clearTimeout(timeoutId);
            if (ws) {
                ws.onclose = null; // Prevent reconnect logic from firing on unmount
                ws.close();
            }
        };
    }, []);
    
    const getStatusColor = () => {
        switch (status) {
            case 'Connected':
                return 'text-green-400';
            case 'Connecting...':
                return 'text-yellow-400';
            default:
                return 'text-red-400';
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor().replace('text-', 'bg-')}`}></span>
            <span className={getStatusColor()}>{status} to Holesky Testnet</span>
            {blockNumber && (
                <span className="text-gray-400 font-mono">| Block: {blockNumber}</span>
            )}
        </div>
    );
};


export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-green-500/20">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm space-y-3">
        <BlockchainStatus />
        <p>Powered by Gemini AI. Designed with an NVIDIA-inspired aesthetic.</p>
        <p>&copy; {new Date().getFullYear()} AI Movie Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};
