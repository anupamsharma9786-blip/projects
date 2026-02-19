"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const vcfRoutes_1 = __importDefault(require("./routes/vcfRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Connect to MongoDB
const connectDatabase = async () => {
    try {
        await mongoose_1.default.connect(config_1.config.mongodbUri);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};
// Routes
app.use('/api', vcfRoutes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// Serve static files from the React frontend dist folder
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
// Handle React Router - send index.html for all non-API routes
app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api') || req.path === '/health') {
        return next();
    }
    res.sendFile(path_1.default.join(__dirname, '../dist/index.html'));
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// 404 handler for API routes
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'API route not found' });
    }
    else {
        res.status(404).json({ error: 'Not found' });
    }
});
// Start server
const startServer = async () => {
    await connectDatabase();
    app.listen(3000, () => {
        console.log(`Server is running on port ${config_1.config.port}`);
        console.log(`Environment: ${config_1.config.nodeEnv}`);
    });
};
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=index.js.map