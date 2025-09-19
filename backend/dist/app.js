"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = void 0;
const fastify_1 = __importDefault(require("fastify"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const buildApp = () => {
    const app = (0, fastify_1.default)({ logger: true });
    app.register(Promise.resolve().then(() => __importStar(require('@fastify/cors'))));
    app.register(Promise.resolve().then(() => __importStar(require('./middleware/auth'))));
    app.register(multipart_1.default, {
        attachFieldsToBody: true, // optional: merges files + fields into req.body
        limits: {
            fileSize: 10 * 1024 * 1024 // optional: 10MB max per file
        }
    });
    // healthcheck route
    app.get('/health', async () => ({ status: 'ok' }));
    // Register API routes
    app.register(Promise.resolve().then(() => __importStar(require('./routes/profile_route'))), { prefix: '/profile' });
    app.register(Promise.resolve().then(() => __importStar(require('./routes/address_route'))), { prefix: '/address' });
    app.register(Promise.resolve().then(() => __importStar(require('./routes/category_route'))), { prefix: '/category' });
    app.register(Promise.resolve().then(() => __importStar(require('./routes/product_route'))), { prefix: '/product' });
    app.register(Promise.resolve().then(() => __importStar(require('./routes/productList_route'))), { prefix: '/products' }); // Public ecommerce products
    return app;
};
exports.buildApp = buildApp;
