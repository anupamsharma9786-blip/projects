# Pharmacogenomics Analysis - Frontend

A React + TypeScript frontend application for pharmacogenomic analysis.

## Features

- **Upload VCF Files**: Upload genetic variant data in VCF format
- **Processing Pipeline**: Trigger diplotype, phenotype, and drug risk analyses
- **Results Dashboard**: View comprehensive reports with:
  - Gene information cards
  - Diplotype results
  - Phenotype predictions
  - Drug risk assessments
  - Clinical recommendations
- **JSON Export**: Download complete reports in JSON format

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Prerequisites

- Node.js 16+ and npm

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the frontend directory (or copy from `.env.example`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
# Build for production
npm run build
```

The build output will be in the `/dist` folder.

## Preview Production Build

```bash
# Preview production build locally
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorMessage.tsx
│   ├── pages/           # Page components
│   │   ├── UploadVcf.tsx
│   │   ├── ProcessingStatus.tsx
│   │   └── ResultsDashboard.tsx
│   ├── services/        # API service layer
│   │   └── api.ts
│   ├── App.tsx          # Main app component with routing
│   ├── main.tsx         # Application entry point
│   ├── index.css        # Global styles
│   └── vite-env.d.ts    # TypeScript definitions
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## API Endpoints

The frontend communicates with the following backend endpoints:

- `POST /api/upload-vcf` - Upload VCF file
- `POST /api/diplotype/{uploadId}` - Trigger diplotype analysis
- `POST /api/phenotype/{uploadId}` - Trigger phenotype analysis
- `POST /api/drug-risk/{uploadId}` - Trigger drug risk analysis
- `POST /api/generate-report/{uploadId}` - Generate final report

## Usage

1. **Upload VCF**: Navigate to the home page and upload a VCF file
2. **Process**: On the processing page, run each analysis step:
   - Diplotype Analysis
   - Phenotype Analysis
   - Drug Risk Analysis
3. **Generate Report**: Click "Generate Report" to compile results
4. **View Results**: Review the comprehensive dashboard with all findings
5. **Download**: Export the complete report as JSON

## License

See the main project LICENSE file.
