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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var app_1 = require("./app");
var DB_interface_1 = require("./logic/db_interface/DB_interface");
var email_1 = require("./logic/email/email");
var admin = __importStar(require("firebase-admin"));
var child_process = __importStar(require("child_process"));
app_1.app.listen(process.env.PORT || 8080, function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1, service_account, error_2, proc, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 1, , 3]);
                app_1.app.locals.DEFAULT_DB_INTERFACE = new DB_interface_1.DB_interface({
                    connectionString: (0, DB_interface_1.get_db_uri)()
                }, true);
                return [3 /*break*/, 3];
            case 1:
                error_1 = _a.sent();
                console.log(error_1);
                return [4 /*yield*/, (0, email_1.send_generic_error_email)("Error initializing database: ", error_1)];
            case 2:
                _a.sent();
                process.exit(3);
                return [3 /*break*/, 3];
            case 3:
                _a.trys.push([3, 4, , 6]);
                service_account = {
                    type: process.env.FIREBASE_TYPE,
                    project_id: process.env.FIREBASE_PROJECT_ID,
                    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
                    private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
                    client_email: process.env.FIREBASE_CLIENT_EMAIL,
                    client_id: process.env.FIREBASE_CLIENT_ID,
                    auth_uri: process.env.FIREBASE_AUTH_URI,
                    token_uri: process.env.FIREBASE_TOKEN_URI,
                    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
                };
                app_1.app.locals.FIREBASE_APP = admin.initializeApp({
                    credential: admin.credential.cert(service_account),
                    storageBucket: process.env.FIREBASE_BUCKET_URL
                });
                return [3 /*break*/, 6];
            case 4:
                error_2 = _a.sent();
                console.log(error_2);
                return [4 /*yield*/, (0, email_1.send_generic_error_email)("Error initializing firebase: ", error_2)];
            case 5:
                _a.sent();
                process.exit(2);
                return [3 /*break*/, 6];
            case 6:
                _a.trys.push([6, 7, , 9]);
                proc = child_process.spawn("python3", ["./download.py"]);
                proc.on("exit", function (exit_code) {
                    if (exit_code === 0) {
                        app_1.app.locals.MODEL_READY_TO_USE = true;
                        console.log("Ready to use");
                    }
                    else {
                        console.log(exit_code);
                        process.exit(4);
                    }
                });
                return [3 /*break*/, 9];
            case 7:
                error_3 = _a.sent();
                console.log(error_3);
                return [4 /*yield*/, (0, email_1.send_generic_error_email)("Error downloading dropbox: ", error_3)];
            case 8:
                _a.sent();
                process.exit(4);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
