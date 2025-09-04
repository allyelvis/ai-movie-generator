
import React from 'react';

export const WelcomeMessage: React.FC = () => {
    return (
        <div className="text-center p-8 bg-gray-900/30 border border-dashed border-gray-700 rounded-lg">
            <h2 className="text-2xl font-orbitron text-gray-300 mb-4">Welcome to the AI Movie Generator</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
                Your cinematic universe awaits. Enter any theme above to begin generating a unique portfolio of fictional movies.
            </p>
            <div className="mt-6 text-left max-w-md mx-auto space-y-2">
                 <p className="text-gray-500"><span className="text-green-400 font-bold">Try themes like:</span> "underwater post-apocalyptic westerns", "noir detective stories set in ancient Rome", or "culinary space operas".</p>
            </div>
        </div>
    );
};
