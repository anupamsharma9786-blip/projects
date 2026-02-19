"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhenotypeController = void 0;
const PhenotypeService_1 = require("../services/PhenotypeService");
const Diplotype_1 = require("../models/Diplotype");
const Phenotype_1 = require("../models/Phenotype");
const phenotypeService = new PhenotypeService_1.PhenotypeService();
class PhenotypeController {
    /**
     * Process diplotypes and generate phenotypes for a specific upload
     */
    async processPhenotype(req, res) {
        try {
            const { uploadId } = req.params;
            if (!uploadId) {
                res.status(400).json({ error: 'uploadId is required' });
                return;
            }
            console.log(`[PhenotypeController] Processing phenotypes for uploadId: ${uploadId}`);
            // Get the diplotype record
            const diplotypeRecord = await Diplotype_1.Diplotype.findOne({ uploadId });
            if (!diplotypeRecord) {
                console.error(`[PhenotypeController] Diplotype record not found for uploadId: ${uploadId}`);
                res.status(404).json({
                    error: 'Diplotype record not found',
                    uploadId: uploadId,
                    hint: 'Please process diplotypes first using POST /api/process-diplotype/:uploadId',
                });
                return;
            }
            console.log(`[PhenotypeController] Found diplotype record with ${diplotypeRecord.diplotypes.length} genes`);
            // Convert diplotypes to phenotypes
            const phenotypes = phenotypeService.convertDiplotypesToPhenotypes(diplotypeRecord.diplotypes);
            // Save phenotypes to database
            let phenotypeRecord = await Phenotype_1.Phenotype.findOne({ uploadId });
            if (phenotypeRecord) {
                // Update existing record
                phenotypeRecord.phenotypes = phenotypes;
                await phenotypeRecord.save();
            }
            else {
                // Create new record
                phenotypeRecord = new Phenotype_1.Phenotype({
                    uploadId,
                    sampleId: diplotypeRecord.sampleId,
                    phenotypes,
                });
                await phenotypeRecord.save();
            }
            res.status(200).json({
                success: true,
                message: 'Phenotypes processed successfully',
                data: {
                    uploadId,
                    sampleId: diplotypeRecord.sampleId,
                    phenotypes: phenotypes.map((p) => ({
                        gene: p.gene,
                        diplotype: p.diplotype,
                        phenotype: p.phenotype,
                    })),
                },
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`[PhenotypeController] Error processing phenotypes: ${errorMessage}`);
            res.status(500).json({
                error: 'Failed to process phenotypes',
                details: errorMessage,
            });
        }
    }
    /**
     * Get phenotypes for a specific upload
     */
    async getPhenotypes(req, res) {
        try {
            const { uploadId } = req.params;
            if (!uploadId) {
                res.status(400).json({ error: 'uploadId is required' });
                return;
            }
            const phenotypeRecord = await Phenotype_1.Phenotype.findOne({ uploadId });
            if (!phenotypeRecord) {
                res.status(404).json({
                    error: 'No phenotype data found for this upload',
                    hint: 'Please process phenotypes first using POST /api/process-phenotype/:uploadId',
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: {
                    uploadId,
                    sampleId: phenotypeRecord.sampleId,
                    phenotypes: phenotypeRecord.phenotypes,
                    createdAt: phenotypeRecord.createdAt,
                    updatedAt: phenotypeRecord.updatedAt,
                },
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                error: 'Failed to retrieve phenotypes',
                details: errorMessage,
            });
        }
    }
    /**
     * Get supported genes and their phenotype values
     */
    async getSupportedGenesWithPhenotypes(req, res) {
        try {
            const genes = phenotypeService.getSupportedGenes();
            const geneInfo = genes.map((gene) => ({
                gene,
                phenotypes: phenotypeService.getPhenotypesForGene(gene),
            }));
            res.status(200).json({
                success: true,
                data: {
                    supportedGenes: geneInfo,
                    total: genes.length,
                },
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                error: 'Failed to retrieve supported genes',
                details: errorMessage,
            });
        }
    }
}
exports.PhenotypeController = PhenotypeController;
//# sourceMappingURL=PhenotypeController.js.map