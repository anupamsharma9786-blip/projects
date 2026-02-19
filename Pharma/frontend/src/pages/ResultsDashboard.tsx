import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateReport, Report } from '../services/api';
import GeneCard from '../components/GeneCard';
import DrugCard from '../components/DrugCard';
import GeneReportCard from '../components/GeneReportCard';
import DetailedDrugReportCard from '../components/DetailedDrugReportCard';

const ResultsDashboard: React.FC = () => {
  const { uploadId } = useParams<{ uploadId: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!uploadId) return;

      setLoading(true);
      setError(null);

      try {
        const data = await generateReport(uploadId);
        setReport(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load report');
        console.error('Report fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [uploadId]);

  const handleDownloadJson = () => {
    if (!report) return;

    // Use detailedReports if available, otherwise fall back to legacy format
    const dataToExport = report.detailedReports || report;

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pharma-report-${uploadId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    if (!report) return;

    // Use detailedReports if available, otherwise fall back to legacy format
    const dataToExport = report.detailedReports || report;

    try {
      const dataStr = JSON.stringify(dataToExport, null, 2);
      await navigator.clipboard.writeText(dataStr);
      alert('Report copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      alert('Failed to copy to clipboard. Please try the download option.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">
            <span className="spinner"></span>
            <span>Loading report...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error">{error}</div>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← Back to Upload
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container">
        <div className="card">
          <div className="info">No report data available</div>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← Back to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Pharmacogenomics Report</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handleCopyToClipboard} title="Copy JSON to clipboard">
              📋 Copy JSON
            </button>
            <button className="btn btn-success" onClick={handleDownloadJson}>
              📥 Download JSON
            </button>
          </div>
        </div>
        <p style={{ color: '#666' }}>
          Upload ID: <strong>{uploadId}</strong>
        </p>
        {report.sampleId && (
          <p style={{ color: '#666' }}>
            Sample ID: <strong>{report.sampleId}</strong>
          </p>
        )}
        {report.selectedDrugs && report.selectedDrugs.length > 0 && (
          <div style={{ margin: '10px 0' }}>
            <span style={{ 
              backgroundColor: '#e7f3ff', 
              color: '#0066cc',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid #b3d9ff'
            }}>
              🎯 Filtered Results: {report.selectedDrugs.length} drug{report.selectedDrugs.length !== 1 ? 's' : ''} selected
            </span>
            <div style={{ 
              marginTop: '8px', 
              fontSize: '13px', 
              color: '#666',
              padding: '8px 12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              borderLeft: '3px solid #0066cc'
            }}>
              <strong>Selected drugs:</strong> {report.selectedDrugs.join(', ')}
            </div>
          </div>
        )}
        {(report.timestamp || report.createdAt) && (
          <p style={{ color: '#666', fontSize: '14px' }}>
            Generated: {new Date(report.timestamp || report.createdAt!).toLocaleString()}
          </p>
        )}
      </div>

      {/* Summary Section */}
      {(report.summary || report.explanation) && (
        <div className="card" style={{ backgroundColor: '#f0f8ff', borderLeft: '4px solid #007bff' }}>
          <h3 style={{ color: '#007bff', marginBottom: '15px' }}>📋 Summary</h3>
          <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px' }}>
            {report.summary || report.explanation}
          </p>
        </div>
      )}

      {/* Detailed Drug Reports Cards - WITH AI RISK ASSESSMENT */}
      {report.detailedReports && report.detailedReports.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '10px' }}>🧬 Drug-Gene Analysis Results (AI Risk Assessment)</h3>
          <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            {report.detailedReports.length} drug-gene interaction{report.detailedReports.length !== 1 ? 's' : ''} analyzed with AI-predicted risk assessment based on your genetic profile.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {report.detailedReports.map((detailedReport, index) => (
              <DetailedDrugReportCard key={index} report={detailedReport} />
            ))}
          </div>
        </div>
      )}

      {/* Gene Reports Cards - NEW FORMAT (Fallback if detailed reports not available) */}
      {!report.detailedReports && report.geneReports && report.geneReports.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '10px' }}>🧬 Drug-Gene Analysis Results</h3>
          <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            {report.geneReports.length} drug-gene interaction{report.geneReports.length !== 1 ? 's' : ''} analyzed based on your genetic profile.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {report.geneReports.map((geneReport, index) => (
              <GeneReportCard key={index} report={geneReport} />
            ))}
          </div>
        </div>
      )}

      {/* Legacy Gene Cards - Show if geneReports not available */}
      {!report.geneReports && (report.diplotypes || report.phenotypes) && (
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>🧬 Gene Information Cards</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {Array.from(
              new Set([
                ...(report.diplotypes?.map((d) => d.gene) || []),
                ...(report.phenotypes?.map((p) => p.gene) || []),
              ])
            ).map((gene) => {
              const diplotype = report.diplotypes?.find((d) => d.gene === gene);
              const phenotype = report.phenotypes?.find((p) => p.gene === gene);
              const drugCount = report.drugRisks?.filter((d) => d.gene === gene).length || 0;

              return (
                <GeneCard
                  key={gene}
                  gene={gene}
                  diplotype={diplotype?.diplotype}
                  phenotype={phenotype?.phenotype}
                  activityScore={phenotype?.activityScore}
                  drugCount={drugCount}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Legacy Drug Risk Cards - Show if geneReports not available */}
      {!report.geneReports && report.drugRisks && report.drugRisks.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '10px' }}>💊 Drug-Gene Interactions</h3>
          <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            Clinical recommendations based on your genetic profile. {report.drugRisks.length} drug interaction{report.drugRisks.length !== 1 ? 's' : ''} found.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {report.drugRisks.map((risk, index) => (
              <DrugCard key={index} drugRisk={risk} />
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← New Upload
          </button>
          <button className="btn btn-primary" onClick={handleCopyToClipboard}>
            📋 Copy Report (JSON)
          </button>
          <button className="btn btn-primary" onClick={handleDownloadJson}>
            📥 Download Report (JSON)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
