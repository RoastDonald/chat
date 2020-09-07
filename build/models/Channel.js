"use strict";
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
exports.Message = exports.Channel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var User_1 = __importDefault(require("./User"));
var MessageSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: Object,
        required: true,
    },
});
var ChannelSchema = new mongoose_1.default.Schema({
    messages: {
        type: [MessageSchema],
    },
    users: [{ type: Object }],
    creator: {
        type: String,
        required: true,
    },
});
ChannelSchema.statics.saveNewRoom = function (from, to, message) { return __awaiter(void 0, void 0, void 0, function () {
    var messageMod, channel, channelID_1, session_1, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                messageMod = new exports.Message({
                    content: message,
                    user: from,
                });
                channel = new exports.Channel({
                    creator: from.senderEmail,
                    users: [
                        { email: from.senderEmail, name: from.senderName },
                        { email: to.recieverEmail, name: to.recieverName },
                    ],
                    messages: [messageMod],
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                channelID_1 = null;
                return [4 /*yield*/, channel.save(function (err, doc) {
                        if (err)
                            throw Error(err);
                        channelID_1 = doc._id;
                    })];
            case 2:
                _a.sent();
                session_1 = null;
                return [4 /*yield*/, mongoose_1.default
                        .startSession()
                        .then(function (_session) { return __awaiter(void 0, void 0, void 0, function () {
                        var _id;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _id = channel._id;
                                    session_1 = _session;
                                    session_1.startTransaction();
                                    return [4 /*yield*/, User_1.default.findOneAndUpdate({ email: from.senderEmail }, { $addToSet: { channels: _id } }, { session: session_1 }, function (err) {
                                            if (err && session_1)
                                                return session_1.abortTransaction();
                                            console.log('1 SAVED');
                                        })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, User_1.default.findOneAndUpdate({ email: to.recieverEmail }, { $addToSet: { channels: _id } }, { session: session_1 }, function (err, doc) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!(err && session_1)) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, session_1.abortTransaction()];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                    case 2:
                                                        console.log('2 SAVED');
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!session_1) return [3 /*break*/, 2];
                                    return [4 /*yield*/, session_1.commitTransaction()];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); })
                        .then(function () {
                        if (session_1)
                            session_1.endSession();
                        return channelID_1;
                    })];
            case 3: return [2 /*return*/, _a.sent()];
            case 4:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
ChannelSchema.statics.saveMessage = function (message, channelID) { return __awaiter(void 0, void 0, void 0, function () {
    var messageDB;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(message, channelID);
                messageDB = new exports.Message(message);
                return [4 /*yield*/, exports.Channel.findOneAndUpdate({
                        _id: channelID,
                    }, {
                        $addToSet: { messages: messageDB },
                    }, function (err, doc) {
                        if (err)
                            throw err;
                        console.log(doc);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.Channel = mongoose_1.default.model('channels', ChannelSchema, 'channels');
exports.Message = mongoose_1.default.model('messages', MessageSchema, 'message');
exports.default = exports.Channel;
