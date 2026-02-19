import React from 'react';

interface GeneCardProps {
  gene: string;
  diplotype?: string;
  phenotype?: string;
  activityScore?: number;
  drugCount?: number;
}

const GeneCard: React.FC<GeneCardProps> = ({ 
  gene, 
  diplotype, 
  phenotype, 
  activityScore, 
  drugCount 
}) => {
  return (
    <div
      style={{
        border: '2px solid #007bff',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
    >
      <h3 style={{ 
        marginBottom: '15px', 
        color: '#007bff', 
        fontSize: '1.4rem',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '10px'
      }}>
        {gene}
      </h3>
      
      <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
        {diplotype && (
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#333' }}>Diplotype:</strong>
            <span style={{ 
              marginLeft: '8px', 
              padding: '4px 10px', 
              backgroundColor: '#e7f3ff', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '13px'
            }}>
              {diplotype}
            </span>
          </div>
        )}
        
        {phenotype && (
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#333' }}>Phenotype:</strong>
            <span style={{ 
              marginLeft: '8px', 
              padding: '4px 10px', 
              backgroundColor: '#fff3cd', 
              borderRadius: '4px',
              fontSize: '13px'
            }}>
              {phenotype}
            </span>
          </div>
        )}
        
        {activityScore !== undefined && (
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#333' }}>Activity Score:</strong>
            <span style={{ 
              marginLeft: '8px',
              fontWeight: 'bold',
              color: '#28a745'
            }}>
              {activityScore}
            </span>
          </div>
        )}
        
        {drugCount !== undefined && drugCount > 0 && (
          <div style={{ 
            marginTop: '15px', 
            paddingTop: '12px', 
            borderTop: '1px solid #e9ecef' 
          }}>
            <span style={{ 
              padding: '6px 12px', 
              backgroundColor: '#28a745', 
              color: 'white',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {drugCount} drug{drugCount !== 1 ? 's' : ''} affected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneCard;
