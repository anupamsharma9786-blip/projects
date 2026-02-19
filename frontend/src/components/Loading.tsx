import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Analyzing genomic data...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      color: '#0066cc',
      gap: '20px'
    }}>
      <span className="spinner"></span>
      <div style={{
        fontSize: '16px',
        fontWeight: 600,
        textAlign: 'center',
        maxWidth: '400px',
        lineHeight: '1.6'
      }}>
        🔬 {message}
      </div>
      <div style={{
        fontSize: '13px',
        color: '#666',
        marginTop: '10px'
      }}>
        Please wait while we process your genomic data...
      </div>
    </div>
  );
};

export default Loading;
