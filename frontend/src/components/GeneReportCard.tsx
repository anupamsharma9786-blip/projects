import React from 'react';
import { GeneReport } from '../services/api';

interface GeneReportCardProps {
  report: GeneReport;
}

const GeneReportCard: React.FC<GeneReportCardProps> = ({ report }) => {
  // Determine card color based on recommendation
  const getRecommendationColor = (recommendation: string) => {
    const rec = recommendation.toLowerCase();
    if (rec.includes('avoid') || rec.includes('contraindicated') || rec.includes('not recommended')) {
      return '#dc3545'; // red
    } else if (rec.includes('reduce') || rec.includes('caution') || rec.includes('monitor') || rec.includes('consider')) {
      return '#ffc107'; // yellow
    } else if (rec.includes('increase') || rec.includes('adjust')) {
      return '#17a2b8'; // cyan
    }
    return '#28a745'; // green for standard dosing
  };

  const getBorderColor = (recommendation: string) => {
    const rec = recommendation.toLowerCase();
    if (rec.includes('avoid') || rec.includes('contraindicated') || rec.includes('not recommended')) {
      return '#dc3545';
    } else if (rec.includes('reduce') || rec.includes('caution') || rec.includes('monitor') || rec.includes('consider')) {
      return '#ffc107';
    } else if (rec.includes('increase') || rec.includes('adjust')) {
      return '#17a2b8';
    }
    return '#28a745';
  };

  const getPhenotypeColor = (phenotype: string) => {
    const phen = phenotype.toLowerCase();
    if (phen.includes('poor') || phen.includes('ultra-rapid')) {
      return '#dc3545';
    } else if (phen.includes('intermediate') || phen.includes('rapid')) {
      return '#ffc107';
    } else if (phen.includes('unknown')) {
      return '#6c757d';
    }
    return '#28a745';
  };

  return (
    <div
      style={{
        border: `3px solid ${getBorderColor(report.recommendation)}`,
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
    >
      {/* Drug Name Header */}
      <div
        style={{
          backgroundColor: getRecommendationColor(report.recommendation),
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: 'bold',
          fontSize: '18px',
          textAlign: 'center',
        }}
      >
        💊 {report.drug}
      </div>

      {/* Gene and Phenotype */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Gene:</span>
          <span
            style={{
              backgroundColor: '#e9ecef',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#495057',
            }}
          >
            {report.gene}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Phenotype:</span>
          <span
            style={{
              backgroundColor: getPhenotypeColor(report.phenotype),
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            {report.phenotype}
          </span>
        </div>
      </div>

      {/* Recommendation */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px',
          borderLeft: `4px solid ${getRecommendationColor(report.recommendation)}`,
        }}
      >
        <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px' }}>
          📋 RECOMMENDATION
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#212529' }}>{report.recommendation}</div>
      </div>

      {/* Explanation */}
      <div style={{ flex: 1, marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '6px' }}>ℹ️ EXPLANATION</div>
        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#495057' }}>{report.explanation}</div>
      </div>

      {/* Disclaimer */}
      <div
        style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '6px',
          padding: '10px',
          marginTop: 'auto',
        }}
      >
        <div style={{ fontSize: '11px', color: '#856404', lineHeight: '1.5', fontStyle: 'italic' }}>
          ⚠️ {report.disclaimer}
        </div>
      </div>
    </div>
  );
};

export default GeneReportCard;
