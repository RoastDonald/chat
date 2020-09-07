"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDB = exports.Redis = exports.AbstractDatabase = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var redis_1 = __importDefault(require("redis"));
var RedisOptions = {
    port: 6379,
};
var AbstractDatabase = /** @class */ (function () {
    function AbstractDatabase() {
    }
    return AbstractDatabase;
}());
exports.AbstractDatabase = AbstractDatabase;
var Redis = /** @class */ (function (_super) {
    __extends(Redis, _super);
    function Redis() {
        var _this = _super.call(this) || this;
        _this.connect = function () {
            if (Redis.database)
                return Redis.database;
            try {
                Redis.database = redis_1.default.createClient(RedisOptions);
                _this.setListeners();
            }
            catch (e) {
                console.log(e);
                process.exit(1);
            }
        };
        _this.disconnect = function () {
            var _a;
            if (!Redis.database)
                return;
            (_a = Redis.database) === null || _a === void 0 ? void 0 : _a.quit();
        };
        _this.setListeners = function () {
            if (!Redis.database)
                return;
            Redis.database.on('connect', function () {
                console.log('redis connected');
            });
            Redis.database.on('error', function (err) {
                console.log(err);
            });
        };
        return _this;
    }
    return Redis;
}(AbstractDatabase));
exports.Redis = Redis;
var MongoDB = /** @class */ (function (_super) {
    __extends(MongoDB, _super);
    function MongoDB() {
        var _this = _super.call(this) || this;
        _this.connect = function () { return __awaiter(_this, void 0, void 0, function () {
            var settings, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        settings = {
                            useNewUrlParser: true,
                            useCreateIndex: true,
                            useFindAndModify: false,
                            useUnifiedTopology: true,
                        };
                        _a = MongoDB;
                        return [4 /*yield*/, mongoose_1.default.connect(process.env.DB_REMOTE || '', settings)];
                    case 1:
                        _a.database = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        console.log(e_1);
                        process.exit(1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this.disconnect = function () { return __awaiter(_this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!mongoose_1.default.connection) return [3 /*break*/, 2];
                        return [4 /*yield*/, mongoose_1.default.disconnect()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        process.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    return MongoDB;
}(AbstractDatabase));
exports.MongoDB = MongoDB;
