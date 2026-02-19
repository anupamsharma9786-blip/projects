import React from 'react';

interface DrugRisk {
  drug: string;
  gene: string;
  recommendation: string;
  level: string;
  implications?: string;
  risk?: string;
  severity?: string;
}

interface DrugCardProps {
  drugRisk: DrugRisk;
}

const DrugCard: React.FC<DrugCardProps> = ({ drugRisk }) => {
  const getSeverityColor = (severity: string) => {
    const sev = severity.toLowerCase();
    if (sev === 'critical' || sev === 'high') return { bg: '#f8d7da', border: '#dc3545', text: '#721c24' };
    if (sev === 'moderate') return { bg: '#fff3cd', border: '#ffc107', text: '#856404' };
    return { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460' };
  };

  const severityLevel = drugRisk.severity || drugRisk.level || 'unknown';
  const colors = getSeverityColor(severityLevel);

  return (
    <div
      style={{
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        height: '100%',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: colors.border, fontSize: '1.3rem' }}>
          {drugRisk.drug}
        </h3>
        <span
          style={{
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            textTransform: 'uppercase'
          }}
        >
          {severityLevel}
        </span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ 
          fontSize: '13px', 
          color: '#666',
          backgroundColor: '#f8f9fa',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          Gene: <strong>{drugRisk.gene}</strong>
        </span>
      </div>

      {drugRisk.risk && (
        <div style={{ 
          marginBottom: '15px',
          padding: '12px',
          backgroundColor: colors.bg,
          borderRadius: '8px',
          borderLeft: `4px solid ${colors.border}`
        }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Risk
          </div>
          <div style={{ fontSize: '14px', color: colors.text, fontWeight: '500' }}>
            {drugRisk.risk}
          </div>
        </div>
      )}

      <div style={{ 
        marginBottom: '12px',
        padding: '12px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        borderLeft: '4px solid #28a745'
      }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Recommendation
        </div>
        <div style={{ fontSize: '14px', color: '#155724', lineHeight: '1.5' }}>
          {drugRisk.recommendation}
        </div>
      </div>

      {drugRisk.implications && (
        <div style={{ 
          fontSize: '13px', 
          color: '#666', 
          lineHeight: '1.6',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          fontStyle: 'italic'
        }}>
          {drugRisk.implications}
        </div>
      )}
    </div>
  );
};

export default DrugCard;
