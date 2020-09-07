"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var mongoose_1 = __importDefault(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var api_errors_1 = require("../errors/api-errors");
var Channel_1 = require("./Channel");
var database_1 = require("../config/database");
var ObjectId = mongoose_1.default.Types.ObjectId;
var Schema = mongoose_1.default.Schema;
var UserSchema = new Schema({
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    channels: {
        type: [ObjectId],
        default: [],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
UserSchema.statics.findUserChannels = function (userID) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.aggregate([
                    {
                        $match: {
                            _id: ObjectId(userID),
                        },
                    },
                    {
                        $lookup: {
                            from: 'channels',
                            localField: 'channels',
                            foreignField: '_id',
                            as: 'result',
                        },
                    },
                    {
                        $project: {
                            result: true,
                            _id: false,
                        },
                    },
                ])];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
UserSchema.statics.findUsersByQuery = function (search, sender) { return __awaiter(void 0, void 0, void 0, function () {
    var users, userPromises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.find({ displayName: { $regex: search }, _id: { $nin: [ObjectId(sender)] } }, { email: '1', displayName: '1' }).limit(25)];
            case 1:
                users = _a.sent();
                userPromises = users.map(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                    var userSocket;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new Promise(function (res) {
                                    if (!database_1.Redis.database)
                                        return;
                                    database_1.Redis.database.hget(user._doc.email, 'socketID', function (err, reply) {
                                        if (err)
                                            throw Error('problem with redis');
                                        res(reply);
                                    });
                                })];
                            case 1:
                                userSocket = _a.sent();
                                return [2 /*return*/, __assign(__assign({}, user._doc), { status: !!userSocket })];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(userPromises)];
            case 2:
                users = _a.sent();
                return [2 /*return*/, users];
        }
    });
}); };
UserSchema.statics.registerUser = function (data, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var email, displayName, password, user, salt, _a, payload;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                email = data.email, displayName = data.displayName, password = data.password;
                if (!email || !displayName || !password)
                    return [2 /*return*/, cb(new Error(api_errors_1.ApiErrors.INCORRECT_DATA), null)];
                return [4 /*yield*/, User.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (user)
                    return [2 /*return*/, cb(new Error(api_errors_1.ApiErrors.USER_ALREADY_EXISTS), null)];
                user = new User({
                    displayName: displayName,
                    email: email,
                    password: password,
                });
                return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 2:
                salt = _b.sent();
                _a = user;
                return [4 /*yield*/, bcryptjs_1.default.hash(password, salt)];
            case 3:
                _a.password = _b.sent();
                return [4 /*yield*/, user.save(function (err, user) {
                        if (err)
                            throw err;
                        console.log(user.displayName + " is saved");
                    })];
            case 4:
                _b.sent();
                payload = {
                    user: {
                        id: user.id,
                    },
                };
                jsonwebtoken_1.default.sign(payload, 'secret', { expiresIn: 360000 }, function (error, token) {
                    if (error)
                        throw error;
                    if (!token)
                        return cb(new Error(api_errors_1.ApiErrors.INCORRECT_TOKEN), null);
                    cb(null, {
                        token: token,
                        displayName: displayName,
                        email: email,
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
UserSchema.statics.createNewChannel = function (data) {
    var _a = data.data, from = _a.from, to = _a.to, message = _a.message;
    var messageMod = new Channel_1.Message({
        content: message,
        user: from,
    });
    var channel = new Channel_1.Channel({
        creator: from.senderEmail,
        users: [
            { email: from.senderEmail, name: from.senderName },
            { email: to.recieverEmail, name: to.recieverName },
        ],
        messages: [messageMod],
        lastMessage: messageMod,
    });
    //start
    channel.save(function (err, doc) {
        if (err)
            throw err;
        console.log(doc);
    });
    var session = null;
    mongoose_1.default
        .startSession()
        .then(function (_session) { return __awaiter(void 0, void 0, void 0, function () {
        var _id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _id = channel._id;
                    session = _session;
                    session.startTransaction();
                    return [4 /*yield*/, User.findOneAndUpdate({ email: from.senderEmail }, { $addToSet: { channels: _id } }, { session: session }, function (err, doc) {
                            if (err)
                                return session.abortTransaction();
                            console.log('1 SAVED');
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, User.findOneAndUpdate({ email: to.recieverEmail }, { $addToSet: { channels: _id } }, { session: session }, function (err, doc) {
                            if (err)
                                return session.abortTransaction();
                            console.log('2 SAVED');
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); })
        .then(function () { return session.commitTransaction(); })
        .then(function () { return session.endSession(); });
};
UserSchema.statics.authUser = function (data, cb) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, user, isPassowrdValid, payload, u_display_name;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = data.email, password = data.password;
                console.log(1, email, password);
                if (!email || !password)
                    return [2 /*return*/, cb(new Error(api_errors_1.ApiErrors.INCORRECT_DATA), null)];
                return [4 /*yield*/, User.findOne({ email: email })];
            case 1:
                user = (_a.sent());
                if (!user)
                    return [2 /*return*/, cb(new Error(api_errors_1.ApiErrors.NOT_EXISTED_USER), null)];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                isPassowrdValid = _a.sent();
                if (!isPassowrdValid)
                    return [2 /*return*/, api_errors_1.ApiErrors.INVALID_PASSWORD];
                payload = {
                    user: {
                        id: user.id,
                    },
                };
                u_display_name = user.displayName;
                return [2 /*return*/, jsonwebtoken_1.default.sign(payload, 'secret', { expiresIn: 180000 }, function (err, token) {
                        if (err)
                            throw err;
                        if (!token)
                            return cb(new Error(api_errors_1.ApiErrors.INCORRECT_TOKEN), null);
                        console.log(4);
                        cb(null, {
                            token: token,
                            displayName: u_display_name,
                            email: email,
                        });
                    })];
        }
    });
}); };
var User = mongoose_1.default.model('user', UserSchema, 'users');
exports.default = User;
