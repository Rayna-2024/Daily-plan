import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
