import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      color: '#991b1b',
      padding: '18px',
      borderRadius: '12px',
      marginBottom: '15px',
      borderLeft: '4px solid #ef4444',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 600 }}>{message}</p>
        {onRetry && (
          <button 
            className="btn btn-danger"
            onClick={onRetry}
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            🔄 Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
