"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var auth_1 = __importDefault(require("../../middlewares/auth"));
var User_1 = __importDefault(require("../../models/User"));
var api_errors_1 = require("../../errors/api-errors");
var _a = require('express-validator'), check = _a.check, validationResult = _a.validationResult;
/**
 * @route  GET api/users
 * @des Gives list of users except sender, 25 limit
 * @access  Private
 *  */
/**
 * @route  GET api/users
 * @des Creates an user, and gives user data
 * @access  Public
 *  */
var UserController = /** @class */ (function () {
    function UserController() {
        var _this = this;
        this.route = '/';
        this.router = express.Router();
        this.getUsers = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var search, sender, users, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        search = decodeURI(req.query.search) || '';
                        sender = req.user.id;
                        return [4 /*yield*/, User_1.default.findUsersByQuery(search, sender)];
                    case 1:
                        users = _a.sent();
                        res.status(200).json({ users: users });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        res.status(500).json({ errors: [{ message: 'Server error' }] });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.regiserUser = function (req, res) {
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
            }
            var data = req.body;
            User_1.default.registerUser(data, function (_error, data) {
                var e = _error;
                console.log(data);
                if (!e)
                    return res.status(201).json(data);
                switch (e.message) {
                    case api_errors_1.ApiErrors.INCORRECT_DATA:
                        return res
                            .status(422)
                            .json({ errors: [{ message: api_errors_1.ApiErrors.INCORRECT_DATA }] });
                    case api_errors_1.ApiErrors.USER_ALREADY_EXISTS:
                        return res
                            .status(422)
                            .json({ errors: [{ message: api_errors_1.ApiErrors.USER_ALREADY_EXISTS }] });
                    default:
                        return res
                            .status(500)
                            .json({ errors: [{ message: 'Server error' }] });
                }
            });
        };
        this.router.get(this.route, auth_1.default, this.getUsers);
        this.router.post(this.route, [
            check('email', 'Enter correct email').isEmail(),
            check('password', 'Enter password with 6 or more characters').isLength({
                min: 6,
            }),
        ], this.regiserUser);
    }
    return UserController;
}());
exports.default = UserController;
