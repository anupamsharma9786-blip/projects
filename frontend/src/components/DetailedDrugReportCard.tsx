import React from 'react';
import { DetailedDrugReport } from '../services/api';

interface DetailedDrugReportCardProps {
  report: DetailedDrugReport;
}

const DetailedDrugReportCard: React.FC<DetailedDrugReportCardProps> = ({ report }) => {
  // Get color based on severity
  const getSeverityColor = (severity: string): string => {
    const sev = severity.toLowerCase();
    if (sev === 'critical') return '#dc3545'; // red
    if (sev === 'high') return '#fd7e14'; // orange
    if (sev === 'moderate') return '#ffc107'; // yellow
    return '#28a745'; // green for low
  };

  const getSeverityLabel = (severity: string): string => {
    const sev = severity.toLowerCase();
    if (sev === 'critical') return '🔴 CRITICAL';
    if (sev === 'high') return '🟠 HIGH';
    if (sev === 'moderate') return '🟡 MODERATE';
    return '🟢 LOW';
  };

  const getRiskLabelColor = (riskLabel: string): string => {
    const label = riskLabel.toLowerCase();
    if (label.includes('toxic') || label.includes('avoid')) return '#dc3545'; // red
    if (label.includes('dosage') || label.includes('reduce') || label.includes('adjust')) return '#17a2b8'; // cyan
    if (label.includes('caution')) return '#ffc107'; // yellow
    return '#28a745'; // green for safe
  };

  const getPhenotypeColor = (phenotype: string): string => {
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
        border: `3px solid ${getSeverityColor(report.risk_assessment.severity)}`,
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
      }}
    >
      {/* Drug Name and Risk Label Header */}
      <div
        style={{
          backgroundColor: getSeverityColor(report.risk_assessment.severity),
          color: '#fff',
          padding: '14px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontWeight: 'bold',
          fontSize: '18px',
          textAlign: 'center',
        }}
      >
        💊 {report.drug}
      </div>

      {/* Risk Assessment Section */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '14px',
          borderRadius: '8px',
          marginBottom: '14px',
          borderLeft: `4px solid ${getSeverityColor(report.risk_assessment.severity)}`,
        }}
      >
        {/* Severity Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>
            ⚡ AI RISK ASSESSMENT
          </span>
          <span
            style={{
              backgroundColor: getSeverityColor(report.risk_assessment.severity),
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            {getSeverityLabel(report.risk_assessment.severity)}
          </span>
        </div>

        {/* Risk Label */}
        <div
          style={{
            backgroundColor: getRiskLabelColor(report.risk_assessment.risk_label),
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          {report.risk_assessment.risk_label}
        </div>

        {/* Confidence Score */}
        <div style={{ fontSize: '12px', color: '#666' }}>
          Confidence Score:{' '}
          <span style={{ fontWeight: '600', color: '#495057' }}>
            {(report.risk_assessment.confidence_score * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Pharmacogenomic Profile */}
      <div style={{ marginBottom: '14px' }}>
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
            {report.pharmacogenomic_profile.primary_gene}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Diplotype:</span>
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
            {report.pharmacogenomic_profile.diplotype}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Phenotype:</span>
          <span
            style={{
              backgroundColor: getPhenotypeColor(report.pharmacogenomic_profile.phenotype),
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            {report.pharmacogenomic_profile.phenotype}
          </span>
        </div>
      </div>

      {/* Risk Description */}
      {report.clinical_recommendation.risk_description && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '6px' }}>
            ⚠️ RISK DESCRIPTION
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#495057' }}>
            {report.clinical_recommendation.risk_description}
          </div>
        </div>
      )}

      {/* Clinical Recommendation */}
      <div
        style={{
          backgroundColor: '#f0f8ff',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '12px',
          borderLeft: `4px solid #007bff`,
        }}
      >
        <div style={{ fontSize: '12px', color: '#0062cc', fontWeight: '600', marginBottom: '4px' }}>
          💊 CLINICAL RECOMMENDATION
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#004085', marginBottom: '8px' }}>
          {report.clinical_recommendation.recommendation}
        </div>

        {/* Dosage Adjustment */}
        {report.clinical_recommendation.dosage_adjustment && (
          <div
            style={{
              backgroundColor: '#fff8dc',
              padding: '10px',
              borderRadius: '6px',
              borderLeft: '3px solid #ff9800',
              marginTop: '8px',
              fontSize: '13px',
              lineHeight: '1.7',
              color: '#333',
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ fontWeight: '600', color: '#ff6f00', marginBottom: '6px' }}>📊 DOSAGE ADJUSTMENT GUIDANCE:</div>
            {report.clinical_recommendation.dosage_adjustment}
          </div>
        )}
      </div>

      {/* Explanation from LLM */}
      <div style={{ flex: 1, marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '6px' }}>ℹ️ EXPLANATION</div>
        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#495057' }}>
          {report.llm_generated_explanation.summary}
        </div>
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
          ⚠️ {report.llm_generated_explanation.disclaimer}
        </div>
      </div>

      {/* Quality Metrics Footer */}
      {report.quality_metrics && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #e9ecef',
            fontSize: '11px',
            color: '#999',
          }}
        >
          <span>✓ VCF Parsing: {report.quality_metrics.vcf_parsing_success ? 'Success' : 'Failed'}</span>
          <span style={{ marginLeft: '12px' }}>📊 Variants: {report.quality_metrics.variant_count}</span>
        </div>
      )}
    </div>
  );
};

export default DetailedDrugReportCard;
