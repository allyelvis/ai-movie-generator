
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-green-500/20">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>Powered by Gemini AI. Designed with an NVIDIA-inspired aesthetic.</p>
        <p>&copy; {new Date().getFullYear()} AI Movie Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};
