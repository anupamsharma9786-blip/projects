# Frontend Setup Guide

## Quick Start

Follow these steps to get the frontend running:

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

The `.env` file is already created with default values:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Adjust the API URL if your backend is running on a different port.

### 4. Start the development server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### 5. Build for production

```bash
npm run build
```

The production build will be output to the `/dist` folder.

## Features Implemented

### Pages

1. **Upload VCF Page** (`/`)
   - File upload form
   - Accepts .vcf and .vcf.gz files
   - Calls `POST /api/upload-vcf`
   - Redirects to processing page after upload

2. **Processing Status Page** (`/processing/:uploadId`)
   - Four action buttons:
     - Run Diplotype Analysis
     - Run Phenotype Analysis
     - Run Drug Risk Analysis
     - Generate Final Report
   - Loading states for each operation
   - Completion indicators
   - Navigation to results page

3. **Results Dashboard** (`/results/:uploadId`)
   - Comprehensive report display
   - Gene information cards
   - Diplotype results table
   - Phenotype results table
   - Drug risk assessment table with color-coded levels
   - Explanation text
   - JSON download button

### Technical Features

✅ **React + TypeScript** - Full type safety
✅ **Axios** - API communication with proper error handling
✅ **Environment Variables** - API base URL configurable via `.env`
✅ **Build Output** - Configured to output to `/dist` folder
✅ **Loading States** - All API calls show loading indicators
✅ **Error Handling** - User-friendly error messages
✅ **Responsive Design** - Card-based layout
✅ **Routing** - React Router for navigation

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /api/upload-vcf` - Upload VCF file (multipart/form-data)
- `POST /api/diplotype/{uploadId}` - Trigger diplotype analysis
- `POST /api/phenotype/{uploadId}` - Trigger phenotype analysis
- `POST /api/drug-risk/{uploadId}` - Trigger drug risk analysis
- `POST /api/generate-report/{uploadId}` - Generate and fetch report

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Loading.tsx      # Loading spinner
│   │   └── ErrorMessage.tsx # Error display
│   ├── pages/               # Page components
│   │   ├── UploadVcf.tsx             # Upload page
│   │   ├── ProcessingStatus.tsx      # Processing page
│   │   └── ResultsDashboard.tsx      # Results page
│   ├── services/
│   │   └── api.ts           # Axios API service
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Type definitions
├── .env                     # Environment variables
├── .env.example             # Example environment config
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## Development Workflow

1. **Start Backend**: Ensure your backend server is running on `http://localhost:3000`
2. **Start Frontend**: Run `npm run dev` in the frontend directory
3. **Open Browser**: Navigate to `http://localhost:5173`
4. **Upload VCF**: Test the upload functionality
5. **Process**: Trigger analyses
6. **View Results**: Check the results dashboard

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically try the next available port.

### API Connection Issues

- Verify the backend is running
- Check the `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Next Steps

- Customize styling in `src/index.css`
- Add more detailed error messages
- Implement data visualization (charts/graphs)
- Add user authentication if needed
- Add pagination for large datasets
- Implement search/filter functionality
