"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VcfController_1 = require("../controllers/VcfController");
const DiplotypeController_1 = require("../controllers/DiplotypeController");
const PhenotypeController_1 = require("../controllers/PhenotypeController");
const DrugRiskController_1 = require("../controllers/DrugRiskController");
const PipelineController_1 = require("../controllers/PipelineController");
const ReportController_1 = require("../controllers/ReportController");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
const vcfController = new VcfController_1.VcfController();
const diplotypeController = new DiplotypeController_1.DiplotypeController();
const phenotypeController = new PhenotypeController_1.PhenotypeController();
const drugRiskController = new DrugRiskController_1.DrugRiskController();
const pipelineController = new PipelineController_1.PipelineController();
const reportController = new ReportController_1.ReportController();
/**
 * POST /api/upload-vcf
 * Uploads and parses a VCF file
 */
router.post('/upload-vcf', multer_1.upload.single('file'), (req, res) => vcfController.uploadVcf(req, res));
/**
 * GET /api/uploads
 * Get all uploaded files (pagination: ?page=1&limit=10)
 */
router.get('/uploads', (req, res) => vcfController.getAllUploads(req, res));
/**
 * GET /api/variants/:uploadId
 * Retrieves variants for a specific upload
 */
router.get('/variants/:uploadId', (req, res) => vcfController.getVariants(req, res));
/**
 * POST /api/process-diplotype/:uploadId
 * Process variants and generate diplotypes
 */
router.post('/process-diplotype/:uploadId', (req, res) => diplotypeController.processDiplotype(req, res));
/**
 * GET /api/diplotypes/:uploadId
 * Retrieve diplotypes for a specific upload
 */
router.get('/diplotypes/:uploadId', (req, res) => diplotypeController.getDiplotypes(req, res));
/**
 * GET /api/supported-genes
 * Get list of supported genes for diplotype prediction
 */
router.get('/supported-genes', (req, res) => diplotypeController.getSupportedGenes(req, res));
/**
 * POST /api/process-phenotype/:uploadId
 * Process diplotypes and generate phenotypes
 */
router.post('/process-phenotype/:uploadId', (req, res) => phenotypeController.processPhenotype(req, res));
/**
 * GET /api/phenotypes/:uploadId
 * Retrieve phenotypes for a specific upload
 */
router.get('/phenotypes/:uploadId', (req, res) => phenotypeController.getPhenotypes(req, res));
/**
 * GET /api/phenotype-genes
 * Get list of supported genes with phenotype values
 */
router.get('/phenotype-genes', (req, res) => phenotypeController.getSupportedGenesWithPhenotypes(req, res));
/**
 * POST /api/process-drug-risk/:uploadId
 * Process phenotypes and generate drug risks
 */
router.post('/process-drug-risk/:uploadId', (req, res) => drugRiskController.processDrugRisk(req, res));
/**
 * GET /api/drug-risks/:uploadId
 * Retrieve drug risks for a specific upload
 */
router.get('/drug-risks/:uploadId', (req, res) => drugRiskController.getDrugRisks(req, res));
/**
 * GET /api/drug-risks/:uploadId/severity
 * Get drug risks filtered by severity level (?severity=critical,high,moderate,low)
 */
router.get('/drug-risks/:uploadId/severity', (req, res) => drugRiskController.getDrugRisksBySeverity(req, res));
/**
 * GET /api/drug-catalog
 * Get all available drugs and their associated genes
 */
router.get('/drug-catalog', (req, res) => drugRiskController.getDrugCatalog(req, res));
/**
 * POST /api/process-all/:uploadId
 * Execute complete pipeline: Variants → Diplotypes → Phenotypes → Drug Risks
 */
router.post('/process-all/:uploadId', (req, res) => pipelineController.processPipeline(req, res));
/**
 * GET /api/pipeline-result/:uploadId
 * Get complete pipeline result (all data from all stages)
 */
router.get('/pipeline-result/:uploadId', (req, res) => pipelineController.getPipelineResult(req, res));
/**
 * GET /api/pipeline-status/:uploadId
 * Check pipeline completion status
 */
router.get('/pipeline-status/:uploadId', (req, res) => pipelineController.getPipelineStatus(req, res));
/**
 * POST /api/generate-report/:uploadId
 * Generate AI-powered pharmacogenomics report with explanations
 */
router.post('/generate-report/:uploadId', (req, res) => reportController.generateReport(req, res));
/**
 * GET /api/report/:uploadId
 * Retrieve AI-generated report for a specific upload
 */
router.get('/report/:uploadId', (req, res) => reportController.getReport(req, res));
exports.default = router;
//# sourceMappingURL=vcfRoutes.js.map