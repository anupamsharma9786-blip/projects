import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  analyzeDiplotype,
  analyzePhenotype,
  analyzeDrugRisk,
  generateReport,
} from '../services/api';

const ProcessingStatus: React.FC = () => {
  const { uploadId } = useParams<{ uploadId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<{
    diplotype: boolean;
    phenotype: boolean;
    drugRisk: boolean;
    report: boolean;
  }>({
    diplotype: false,
    phenotype: false,
    drugRisk: false,
    report: false,
  });

  const [completed, setCompleted] = useState<{
    diplotype: boolean;
    phenotype: boolean;
    drugRisk: boolean;
    report: boolean;
  }>({
    diplotype: false,
    phenotype: false,
    drugRisk: false,
    report: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleDiplotypeAnalysis = async () => {
    if (!uploadId) return;

    setLoading({ ...loading, diplotype: true });
    setError(null);

    try {
      await analyzeDiplotype(uploadId);
      setCompleted({ ...completed, diplotype: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze diplotypes');
      console.error('Diplotype analysis error:', err);
    } finally {
      setLoading({ ...loading, diplotype: false });
    }
  };

  const handlePhenotypeAnalysis = async () => {
    if (!uploadId) return;

    setLoading({ ...loading, phenotype: true });
    setError(null);

    try {
      await analyzePhenotype(uploadId);
      setCompleted({ ...completed, phenotype: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze phenotypes');
      console.error('Phenotype analysis error:', err);
    } finally {
      setLoading({ ...loading, phenotype: false });
    }
  };

  const handleDrugRiskAnalysis = async () => {
    if (!uploadId) return;

    setLoading({ ...loading, drugRisk: true });
    setError(null);

    try {
      await analyzeDrugRisk(uploadId);
      setCompleted({ ...completed, drugRisk: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze drug risks');
      console.error('Drug risk analysis error:', err);
    } finally {
      setLoading({ ...loading, drugRisk: false });
    }
  };

  const handleGenerateReport = async () => {
    if (!uploadId) return;

    setLoading({ ...loading, report: true });
    setError(null);

    try {
      await generateReport(uploadId);
      setCompleted({ ...completed, report: true });
      // Navigate to results page
      navigate(`/results/${uploadId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate report');
      console.error('Report generation error:', err);
    } finally {
      setLoading({ ...loading, report: false });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Processing Status</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Upload ID: <strong>{uploadId}</strong>
        </p>
        
        {error && <div className="error">{error}</div>}

        <div className="info" style={{ marginBottom: '20px' }}>
          Click the buttons below to run different analyses on your VCF file.
          Once all analyses are complete, generate the final report.
        </div>

        <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
          <h3>Analysis Steps</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>1. Diplotype Analysis</strong>
                {completed.diplotype && <span style={{ color: '#28a745', marginLeft: '10px' }}>✓ Completed</span>}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleDiplotypeAnalysis}
                disabled={loading.diplotype || completed.diplotype}
              >
                {loading.diplotype ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                    Processing...
                  </>
                ) : completed.diplotype ? (
                  'Completed'
                ) : (
                  'Run Diplotype Analysis'
                )}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>2. Phenotype Analysis</strong>
                {completed.phenotype && <span style={{ color: '#28a745', marginLeft: '10px' }}>✓ Completed</span>}
              </div>
              <button
                className="btn btn-primary"
                onClick={handlePhenotypeAnalysis}
                disabled={loading.phenotype || completed.phenotype}
              >
                {loading.phenotype ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                    Processing...
                  </>
                ) : completed.phenotype ? (
                  'Completed'
                ) : (
                  'Run Phenotype Analysis'
                )}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>3. Drug Risk Analysis</strong>
                {completed.drugRisk && <span style={{ color: '#28a745', marginLeft: '10px' }}>✓ Completed</span>}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleDrugRiskAnalysis}
                disabled={loading.drugRisk || completed.drugRisk}
              >
                {loading.drugRisk ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                    Processing...
                  </>
                ) : completed.drugRisk ? (
                  'Completed'
                ) : (
                  'Run Drug Risk Analysis'
                )}
              </button>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #ddd', paddingTop: '15px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>4. Generate Final Report</strong>
                {completed.report && <span style={{ color: '#28a745', marginLeft: '10px' }}>✓ Completed</span>}
              </div>
              <button
                className="btn btn-success"
                onClick={handleGenerateReport}
                disabled={loading.report || completed.report}
              >
                {loading.report ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                    Generating...
                  </>
                ) : completed.report ? (
                  'Report Generated'
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            ← Back to Upload
          </button>
          {completed.report && (
            <button
              className="btn btn-success"
              onClick={() => navigate(`/results/${uploadId}`)}
              style={{ marginLeft: '10px' }}
            >
              View Results →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
