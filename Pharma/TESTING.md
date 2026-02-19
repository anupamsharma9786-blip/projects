# API Testing Guide

## Testing the VCF Backend API

### Prerequisites
- Server running on `http://localhost:3000`
- A sample VCF file (included: `sample.vcf`)

## Test Cases

### 1. Health Check
Verify the server is running:

```bash
curl -X GET http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. Upload VCF File

**Using cURL:**
```bash
curl -X POST \
  -F "file=@sample.vcf" \
  http://localhost:3000/api/upload-vcf
```

**Using PowerShell (Windows):**
```powershell
$body = Get-Item 'sample.vcf'
$Form = @{
    file = $body
}
Invoke-WebRequest -Uri 'http://localhost:3000/api/upload-vcf' -Method Post -Form $Form
```

**Using JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:3000/api/upload-vcf', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => {
    console.log('Upload successful:', data);
    const uploadId = data.data.uploadId;
    // Use uploadId for the next request
  });
```

**Expected Response:**
```json
{
  "success": true,
  "message": "VCF file uploaded and parsed successfully",
  "data": {
    "uploadId": "upload_abc123def456",
    "filename": "sample.vcf",
    "uploadDate": "2024-01-15T10:30:00Z",
    "sampleId": "SAMPLE_001",
    "variantCount": 6
  }
}
```

### 3. Retrieve Variants Using Upload ID

Replace `upload_abc123def456` with the actual upload ID from the upload response:

**Using cURL:**
```bash
curl -X GET http://localhost:3000/api/variants/upload_abc123def456
```

**Using PowerShell:**
```powershell
Invoke-WebRequest -Uri 'http://localhost:3000/api/variants/upload_abc123def456' -Method Get
```

**Using JavaScript/Fetch:**
```javascript
const uploadId = 'upload_abc123def456';
fetch(`http://localhost:3000/api/variants/${uploadId}`)
  .then(response => response.json())
  .then(data => console.log('Variants:', data));
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "uploadId": "upload_abc123def456",
    "filename": "sample.vcf",
    "uploadDate": "2024-01-15T10:30:00Z",
    "sampleId": "SAMPLE_001",
    "variantCount": 6,
    "variants": [
      {
        "rsid": "rs1234567",
        "chromosome": "1",
        "position": 100000,
        "ref": "A",
        "alt": "G",
        "genotype": "0/1"
      },
      {
        "rsid": "rs7654321",
        "chromosome": "1",
        "position": 200000,
        "ref": "C",
        "alt": "T",
        "genotype": "1/1"
      }
    ]
  }
}
```

## Error Cases

### Invalid File Type
Upload a non-VCF file:

```bash
curl -X POST -F "file=@sample.txt" http://localhost:3000/api/upload-vcf
```

**Expected Response (400):**
```json
{
  "error": "Only .vcf files are accepted"
}
```

### File Too Large
Upload a file larger than the limit (default: 50MB):

**Expected Response (413):**
```json
{
  "error": "File size exceeds the maximum limit",
  "details": "Maximum file size is 50MB"
}
```

### Missing File
Upload without specifying a file:

```bash
curl -X POST http://localhost:3000/api/upload-vcf
```

**Expected Response (400):**
```json
{
  "error": "No file provided"
}
```

### Invalid Upload ID
Request variants with non-existent uploadId:

```bash
curl -X GET http://localhost:3000/api/variants/invalid_id
```

**Expected Response (404):**
```json
{
  "error": "Upload record not found"
}
```

## Quick Test Script

### Bash Script
```bash
#!/bin/bash

echo "Testing VCF Backend API"
echo "======================"

echo -e "\n1. Health Check:"
curl -X GET http://localhost:3000/health

echo -e "\n\n2. Uploading VCF File:"
RESPONSE=$(curl -X POST -F "file=@sample.vcf" http://localhost:3000/api/upload-vcf)
echo $RESPONSE

echo -e "\n\n3. Extracting uploadId and fetching variants:"
UPLOAD_ID=$(echo $RESPONSE | grep -o '"uploadId":"[^"]*' | cut -d'"' -f4)
echo "Upload ID: $UPLOAD_ID"

if [ ! -z "$UPLOAD_ID" ]; then
  echo -e "\n4. Retrieving variants:"
  curl -X GET http://localhost:3000/api/variants/$UPLOAD_ID
fi

echo -e "\n\nTests completed!"
```

### PowerShell Script
```powershell
Write-Host "Testing VCF Backend API"
Write-Host "======================" -ForegroundColor Cyan

Write-Host "`n1. Health Check:" -ForegroundColor Green
$healthResponse = Invoke-WebRequest -Uri "http://localhost:3000/health" -Method Get
$healthResponse.Content | ConvertFrom-Json

Write-Host "`n2. Uploading VCF File:" -ForegroundColor Green
$Form = @{ file = Get-Item 'sample.vcf' }
$uploadResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/upload-vcf" -Method Post -Form $Form
$uploadData = $uploadResponse.Content | ConvertFrom-Json
$uploadData

Write-Host "`n3. Extracting uploadId:" -ForegroundColor Green
$uploadId = $uploadData.data.uploadId
Write-Host "Upload ID: $uploadId"

Write-Host "`n4. Retrieving variants:" -ForegroundColor Green
$variantsResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/variants/$uploadId" -Method Get
$variantsResponse.Content | ConvertFrom-Json

Write-Host "`n`nTests completed!" -ForegroundColor Yellow
```

## Environment Setup for Testing

### Using Postman

1. **Create a new request**
   - Method: POST
   - URL: http://localhost:3000/api/upload-vcf
   - Tab: Body
   - Select "form-data"
   - Key: file (type: File)
   - Value: Select sample.vcf from your computer
   - Click "Send"

2. **Copy the uploadId from the response**

3. **Create another request**
   - Method: GET
   - URL: http://localhost:3000/api/variants/{uploadId}
   - Replace {uploadId} with the actual ID
   - Click "Send"

## Database Verification

To verify data storage in MongoDB:

```bash
# Using MongoDB CLI
mongosh

# Select database
use pharma-vcf

# View all uploads
db.variantuploads.find()

# View specific upload
db.variantuploads.findOne({ uploadId: "upload_abc123def456" })

# Count total uploads
db.variantuploads.countDocuments()
```

## Troubleshooting

### Server Won't Start
- Check MongoDB is running
- Verify port 3000 is available
- Check .env file is properly configured

### Upload Fails
- Ensure file is valid VCF format
- Check file size is under 50MB
- Verify file extension is .vcf

### Cannot Retrieve Variants
- Check uploadId is correct (from upload response)
- Verify MongoDB is running
- Check connectivity to database

### File Upload Hangs
- Check network connectivity
- Monitor server logs
- Verify file size limit in .env
