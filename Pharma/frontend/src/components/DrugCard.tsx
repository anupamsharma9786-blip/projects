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
  const getSeverityStyle = (severity: string) => {
    const sev = severity.toLowerCase();
    if (sev === 'critical' || sev === 'high') {
      return {
        bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        border: '#ef4444',
        text: '#991b1b',
        badge: 'status-risk'
      };
    }
    if (sev === 'moderate') {
      return {
        bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '#f59e0b',
        text: '#92400e',
        badge: 'status-warning'
      };
    }
    return {
      bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      border: '#0066cc',
      text: '#082f49',
      badge: 'status-approved'
    };
  };

  const severityLevel = drugRisk.severity || drugRisk.level || 'unknown';
  const styles = getSeverityStyle(severityLevel);

  return (
    <div
      style={{
        border: `2px solid ${styles.border}`,
        borderRadius: '12px',
        padding: '20px',
        background: 'white',
        boxShadow: '0 4px 12px rgba(0, 102, 204, 0.08)',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderLeft: `4px solid ${styles.border}`,
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: styles.border, fontSize: '1.4rem', fontWeight: 700 }}>
          💊 {drugRisk.drug}
        </h3>
        <span className={`status-badge ${styles.badge}`}>
          {severityLevel}
        </span>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ 
          fontSize: '13px', 
          color: '#0066cc',
          backgroundColor: 'rgba(0, 102, 204, 0.1)',
          padding: '6px 12px',
          borderRadius: '6px',
          display: 'inline-block',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          🧬 Gene: <strong>{drugRisk.gene}</strong>
        </span>
      </div>

      {drugRisk.risk && (
        <div style={{ 
          marginBottom: '15px',
          padding: '14px',
          background: styles.bg,
          borderRadius: '8px',
          borderLeft: `4px solid ${styles.border}`
        }}>
          <div style={{ fontSize: '11px', color: styles.text, marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
            ⚠️ Risk Assessment
          </div>
          <div style={{ fontSize: '14px', color: styles.text, fontWeight: 600 }}>
            {drugRisk.risk}
          </div>
        </div>
      )}

      <div style={{ 
        marginBottom: '12px',
        padding: '14px',
        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        borderRadius: '8px',
        borderLeft: '4px solid #10b981'
      }}>
        <div style={{ fontSize: '11px', color: '#166534', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
          ✓ Recommendation
        </div>
        <div style={{ fontSize: '14px', color: '#166534', fontWeight: 600 }}>
          {drugRisk.recommendation}
        </div>
      </div>

      {drugRisk.implications && (
        <div style={{ 
          fontSize: '13px',
          color: '#666',
          padding: '12px',
          backgroundColor: 'rgba(0, 102, 204, 0.05)',
          borderRadius: '8px',
          borderLeft: '4px solid #0066cc',
          lineHeight: '1.6'
        }}>
          <div style={{ fontSize: '11px', color: '#0066cc', marginBottom: '6px', textTransform: 'uppercase', fontWeight: 700 }}>
            ℹ️ Clinical Implications
          </div>
          {drugRisk.implications}
        </div>
      )}
    </div>
  );
};

export default DrugCard;

