import React, { useState, useEffect, useRef } from 'react';

const BlockchainStatus: React.FC = () => {
    const [status, setStatus] = useState('Connecting...');
    const [blockNumber, setBlockNumber] = useState<string | null>(null);

    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeoutId = useRef<number | null>(null);
    
    // Configuration for reconnection strategy
    const INITIAL_RECONNECT_DELAY = 1000; // 1 second
    const MAX_RECONNECT_DELAY = 30000;    // 30 seconds
    const reconnectDelay = useRef(INITIAL_RECONNECT_DELAY);

    useEffect(() => {
        const WS_URL = 'wss://blockchain.googleapis.com/v1/projects/sokoni-44ef1-7e082/locations/us-central1/endpoints/ethereum-holesky/rpc?key=AIzaSyATKuT1ysLn1qkZBLAsG0uWLnzJSMhLGyQ';
        
        const connect = () => {
            // Avoid creating a new WebSocket if one is already connecting or open
            if (ws.current && (ws.current.readyState === WebSocket.CONNECTING || ws.current.readyState === WebSocket.OPEN)) {
                return;
            }
            
            ws.current = new WebSocket(WS_URL);

            ws.current.onopen = () => {
                setStatus('Connected');
                reconnectDelay.current = INITIAL_RECONNECT_DELAY; // Reset backoff on successful connection
                ws.current?.send(JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_subscribe',
                    params: ['newHeads']
                }));
            };

            ws.current.onmessage = (event) => {
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

            ws.current.onerror = (event) => {
                console.error("WebSocket Error:", event);
                setStatus('Error');
                ws.current?.close(); // This will trigger the onclose handler for reconnection logic
            };

            ws.current.onclose = () => {
                setStatus('Disconnected');
                setBlockNumber(null);
                
                // Sophisticated reconnection: exponential backoff with jitter
                // Jitter adds a random delay to prevent synchronized retries from multiple clients
                const jitter = Math.random() * 500; // Add up to 0.5s of randomness
                const delayWithJitter = reconnectDelay.current + jitter;

                reconnectTimeoutId.current = window.setTimeout(connect, delayWithJitter);

                // Apply exponential backoff for the next attempt
                reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY);
            };
        };

        connect();

        return () => {
            if (reconnectTimeoutId.current) {
                clearTimeout(reconnectTimeoutId.current);
            }
            if (ws.current) {
                ws.current.onclose = null; // Prevent onclose from firing during component unmount
                ws.current.close();
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
        <p>&copy; {new Date().getFullYear()} aenzbi. All rights reserved.</p>
      </div>
    </footer>
  );
};