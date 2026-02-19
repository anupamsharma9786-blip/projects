"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: config_1.config.maxFileSize,
    },
    fileFilter: (req, file, cb) => {
        if (path_1.default.extname(file.originalname).toLowerCase() === '.vcf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only .vcf files are allowed'));
        }
    },
});
//# sourceMappingURL=multer.js.map