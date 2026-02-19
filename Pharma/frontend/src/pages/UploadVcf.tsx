import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadVcf, getDrugCatalog } from '../services/api';

const UploadVcf: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableDrugs, setAvailableDrugs] = useState<string[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [loadingDrugs, setLoadingDrugs] = useState(true);
  const [manualDrugInput, setManualDrugInput] = useState('');
  const [inputMode, setInputMode] = useState<'select' | 'manual'>('select');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const drugs = await getDrugCatalog();
        setAvailableDrugs(drugs);
      } catch (err) {
        console.error('Failed to fetch drugs:', err);
      } finally {
        setLoadingDrugs(false);
      }
    };
    fetchDrugs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrugSelection = (drug: string) => {
    setSelectedDrugs((prev) =>
      prev.includes(drug)
        ? prev.filter((d) => d !== drug)
        : [...prev, drug]
    );
  };

  const toggleSelectAll = () => {
    if (!availableDrugs || availableDrugs.length === 0) return;
    
    if (selectedDrugs.length === availableDrugs.length) {
      setSelectedDrugs([]);
    } else {
      setSelectedDrugs([...availableDrugs]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a VCF file to upload');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine which drugs to send based on input mode
      let drugsToAnalyze: string[] | undefined = undefined;
      
      if (inputMode === 'select' && selectedDrugs.length > 0) {
        drugsToAnalyze = selectedDrugs;
      } else if (inputMode === 'manual' && manualDrugInput.trim()) {
        // Parse comma-separated drug names
        drugsToAnalyze = manualDrugInput
          .split(',')
          .map(drug => drug.trim().toUpperCase())
          .filter(drug => drug.length > 0);
      }

      const response = await uploadVcf(file, drugsToAnalyze);
      // Navigate to processing page with uploadId
      navigate(`/processing/${response.data.uploadId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload VCF file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload VCF File</h2>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Upload a VCF (Variant Call Format) file to begin pharmacogenomic analysis.
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="vcf-file">Select VCF File:</label>
            <input
              id="vcf-file"
              type="file"
              accept=".vcf,.vcf.gz"
              onChange={handleFileChange}
              className="form-control"
              disabled={loading}
            />
          </div>

          {file && (
            <div className="info">
              Selected file: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}

          <div className="form-group">
            <label htmlFor="drug-selection">Select Drugs to Analyze (Optional):</label>
            
            {/* Toggle between selection modes */}
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${inputMode === 'select' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setInputMode('select')}
                style={{ padding: '8px 16px', fontSize: '0px' }}
              >
                📋 Select from List
              </button>
              <button
                type="button"
                className={`btn ${inputMode === 'manual' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setInputMode('manual')}
                style={{ padding: '8px 16px', fontSize: '0px' }}
              >
                ✏️ Type Drug Names
              </button>
            </div>

            {/* Checkbox Selection Mode */}
            {inputMode === 'select' && (
              <>
                {loadingDrugs ? (
                  <p style={{ color: '#666', fontSize: '14px' }}>Loading drugs...</p>
                ) : availableDrugs && availableDrugs.length > 0 ? (
                  <>
                    <div style={{ marginBottom: '10px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={toggleSelectAll}
                        style={{ fontSize: '14px', padding: '6px 12px' }}
                      >
                        {selectedDrugs.length === availableDrugs.length ? 'Deselect All' : 'Select All'}
                      </button>
                      <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                        {selectedDrugs.length > 0 
                          ? `${selectedDrugs.length} drug(s) selected` 
                          : 'All drugs will be analyzed'}
                      </span>
                    </div>
                    <div
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '10px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        backgroundColor: '#f8f9fa',
                      }}
                    >
                      {availableDrugs.map((drug) => (
                        <div key={drug} style={{ marginBottom: '8px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'normal' }}>
                            <input
                              type="checkbox"
                              checked={selectedDrugs.includes(drug)}
                              onChange={() => handleDrugSelection(drug)}
                              style={{ marginRight: '8px' }}
                            />
                            {drug}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
                    No drugs available. All drugs will be analyzed by default.
                  </p>
                )}
              </>
            )}

            {/* Manual Input Mode */}
            {inputMode === 'manual' && (
              <div>
                <textarea
                  placeholder="Enter drug names separated by commas (e.g., WARFARIN, CLOPIDOGREL, SIMVASTATIN)"
                  value={manualDrugInput}
                  onChange={(e) => setManualDrugInput(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    fontSize: '14px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
                <p style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>
                  💡 Tip: Enter drug names in uppercase, separated by commas. 
                  {manualDrugInput.trim() && (
                    <span style={{ marginLeft: '10px', fontWeight: '600', color: '#007bff' }}>
                      {manualDrugInput.split(',').filter(d => d.trim()).length} drug(s) entered
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></span>
                Uploading...
              </>
            ) : (
              'Upload and Analyze'
            )}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>About VCF Files</h3>
        <ul style={{ paddingLeft: '20px', color: '#666' }}>
          <li>VCF files contain genetic variant information</li>
          <li>Supported formats: .vcf and .vcf.gz</li>
          <li>The file should contain variants from pharmacogenomic genes</li>
          <li>Analysis includes diplotype calling, phenotype prediction, and drug risk assessment</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadVcf;
