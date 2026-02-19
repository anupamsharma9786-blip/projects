import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <span className="spinner"></span>
      <span>{message}</span>
    </div>
  );
};

export default Loading;
