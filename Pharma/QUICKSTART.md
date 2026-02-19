# Quick Start Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Setup Environment Variables
The `.env` file is already configured with default values:
- MongoDB URI: mongodb://localhost:27017/pharma-vcf
- Port: 3000
- Max file size: 50MB

Update `.env` if needed.

## Step 3: Ensure MongoDB is Running
Make sure MongoDB is running locally or update MONGODB_URI with your cloud connection string.

For local MongoDB:
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## Step 4: Start the Development Server
```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server is running on port 3000
Environment: development
```

## Step 5: Test the API
Use the included sample.vcf file:

```bash
curl -X POST -F "file=@sample.vcf" http://localhost:3000/api/upload-vcf
```

You'll get a response with an uploadId. Use it to retrieve variants:

```bash
curl http://localhost:3000/api/variants/{uploadId}
```

See TESTING.md for more detailed testing examples.

## Build for Production
```bash
npm run build
npm start
```

The compiled JavaScript will be in the `dist/` folder.

## Project Structure
- `src/config/` - Configuration loading from environment
- `src/models/` - MongoDB schema using Mongoose
- `src/services/` - Business logic (VCF parsing, DB operations)
- `src/controllers/` - Request handlers
- `src/routes/` - API routes
- `src/middleware/` - Express middleware (multer, error handling)
- `src/index.ts` - Application entry point

## Features Implemented
✅ VCF file upload with multer  
✅ File type validation (.vcf only)  
✅ VCF parsing with vcf npm package  
✅ Variant data extraction (rsID, chromosome, position, ref, alt, genotype)  
✅ JSON conversion  
✅ MongoDB integration with Mongoose  
✅ POST /api/upload-vcf endpoint  
✅ GET /api/variants/:uploadId endpoint  
✅ Error handling and file size limits  
✅ Clean modular structure (routes, controllers, services, models)  
✅ TypeScript for type safety  
✅ Environment variable configuration  

## Next Steps
- Integrate with a frontend application
- Add authentication/authorization
- Implement pagination for variant retrieval
- Add data validation/filtering endpoints
- Deploy to production server
- Setup CI/CD pipeline
