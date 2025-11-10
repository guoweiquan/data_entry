"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const json5_1 = __importDefault(require("json5"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const enrollmentRoutes_1 = __importDefault(require("./routes/enrollmentRoutes"));
const migrations_1 = require("./db/migrations");
const config_1 = require("./config");
const requestIdMiddleware_1 = require("./middlewares/requestIdMiddleware");
const FALLBACK_JSON_MIME_TYPES = ["application/json", "text/json", "application/ld+json", "application/vnd.api+json"];
const captureRawBody = (request, response, buffer) => {
    if (buffer.length > 0) {
        request.rawBody = buffer.toString();
    }
};
const isJsonLikeContentType = (contentTypeHeader) => {
    if (!contentTypeHeader) {
        return true;
    }
    const normalizedContentType = contentTypeHeader.split(";")[0].trim().toLowerCase();
    return FALLBACK_JSON_MIME_TYPES.includes(normalizedContentType);
};
const createApp = () => {
    (0, migrations_1.runMigrations)();
    const app = (0, express_1.default)();
    app.use(requestIdMiddleware_1.requestIdMiddleware);
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({
        limit: "10mb",
        verify: captureRawBody,
        type: (incomingRequest) => isJsonLikeContentType(incomingRequest.headers["content-type"])
    }));
    app.use((error, request, response, next) => {
        if (error instanceof SyntaxError &&
            typeof error.status === "number" &&
            request.rawBody &&
            isJsonLikeContentType(request.headers["content-type"])) {
            try {
                request.body = json5_1.default.parse(request.rawBody);
                return next();
            }
            catch (json5Error) {
                return response.status(400).json({
                    code: 400,
                    message: "请求体解析失败",
                    details: json5Error.message
                });
            }
        }
        return next(error);
    });
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, morgan_1.default)("dev"));
    app.use("/api/enrollments", enrollmentRoutes_1.default);
    app.use((request, response) => {
        response.status(404).json({ code: 404, message: "资源不存在" });
    });
    app.use((error, request, response, next) => {
        console.error(error);
        response.status(500).json({ code: 500, message: "服务器内部错误" });
    });
    return app;
};
exports.createApp = createApp;
if (require.main === module) {
    const app = (0, exports.createApp)();
    app.listen(config_1.appConfig.port, () => {
        console.log(`Server started on port ${config_1.appConfig.port}`);
    });
}
