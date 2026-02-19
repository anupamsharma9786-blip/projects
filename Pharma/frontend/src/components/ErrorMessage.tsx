import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error">
      <p>{message}</p>
      {onRetry && (
        <button 
          className="btn btn-secondary" 
          onClick={onRetry}
          style={{ marginTop: '10px' }}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
