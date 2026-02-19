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
  const getActivityColor = (score: number | undefined) => {
    if (!score) return { bg: 'rgba(0, 102, 204, 0.1)', color: '#0066cc' };
    if (score >= 1.25) return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
    if (score >= 0.75) return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' };
    return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' };
  };

  const activityColor = getActivityColor(activityScore);

  return (
    <div
      style={{
        border: '2px solid #0066cc',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0, 102, 204, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        borderLeft: '4px solid #0066cc',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 102, 204, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.08)';
      }}
    >
      <h3 style={{ 
        marginBottom: '15px', 
        color: '#0066cc', 
        fontSize: '1.5rem',
        fontWeight: 700,
        borderBottom: '2px solid rgba(0, 102, 204, 0.2)',
        paddingBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        🧬 {gene}
      </h3>
      
      <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
        {diplotype && (
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#0066cc', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              Diplotype
            </strong>
            <span style={{ 
              padding: '8px 12px', 
              backgroundColor: 'rgba(0, 102, 204, 0.1)', 
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0066cc',
              display: 'inline-block',
              borderLeft: '3px solid #0066cc'
            }}>
              {diplotype}
            </span>
          </div>
        )}
        
        {phenotype && (
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#f59e0b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              Phenotype
            </strong>
            <span style={{ 
              padding: '8px 12px', 
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#f59e0b',
              display: 'inline-block',
              borderLeft: '3px solid #f59e0b'
            }}>
              {phenotype}
            </span>
          </div>
        )}
        
        {activityScore !== undefined && (
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#0066cc', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              Activity Score
            </strong>
            <div style={{
              padding: '10px ',
              backgroundColor: activityColor.bg,
              borderRadius: '6px',
              fontWeight: 700,
              color: activityColor.color,
              fontSize: '16px',
              textAlign: 'center',
              borderLeft: `3px solid ${activityColor.color}`
            }}>
              {activityScore.toFixed(2)}x
            </div>
          </div>
        )}
        
        {drugCount !== undefined && drugCount > 0 && (
          <div style={{ 
            marginTop: '15px', 
            paddingTop: '12px', 
            borderTop: '2px solid rgba(0, 102, 204, 0.2)',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <span style={{ 
              padding: '8px 14px', 
              background: 'linear-gradient(135deg, #0066cc 0%, #003d99 100%)',
              color: 'white',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              💊 {drugCount} {drugCount === 1 ? 'Drug' : 'Drugs'} Affected
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneCard;
