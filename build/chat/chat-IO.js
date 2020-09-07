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
exports.ChatManager = void 0;
var Channel_1 = __importDefault(require("../models/Channel"));
var database_1 = require("../config/database");
var ClientEventTypes;
(function (ClientEventTypes) {
    ClientEventTypes["AUTH"] = "client:auth";
    ClientEventTypes["MESSAGE"] = "client:message";
    ClientEventTypes["CREATE_CHANNEL"] = "client:onFirstMessage";
    ClientEventTypes["LOG_OUT"] = "client:logout";
    ClientEventTypes["POCK_USER"] = "client:pock-user";
    ClientEventTypes["DISCONNECT"] = "disconnect";
})(ClientEventTypes || (ClientEventTypes = {}));
var ServerEventTypes;
(function (ServerEventTypes) {
    ServerEventTypes["MESSAGE"] = "server:message";
    ServerEventTypes["CREATE_CHANNEL"] = "server:onFirstMessage";
    ServerEventTypes["POCK_USER"] = "server:pock-user";
})(ServerEventTypes || (ServerEventTypes = {}));
var ChatManager = /** @class */ (function () {
    function ChatManager(io) {
        var _this = this;
        this.getIOServer = function () {
            return ChatManager.io;
        };
        this.onConnect = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                ChatManager.io.on('connection', function (socket) { return new ConnectedUser(socket); });
                ChatManager.io.on('disconnect', this.onDisconnect);
                return [2 /*return*/];
            });
        }); };
        this.onDisconnect = function () {
            console.log('host went down');
        };
        //init chat
        ChatManager.io = io;
        this.onConnect();
    }
    return ChatManager;
}());
exports.ChatManager = ChatManager;
var ConnectedUser = /** @class */ (function () {
    function ConnectedUser(socket) {
        var _this = this;
        this.socket = socket;
        this.host = ChatManager.io;
        this.userEmail = '';
        this.setListeners = function () {
            _this.socket.on(ClientEventTypes.AUTH, _this.onAuth);
            _this.socket.on(ClientEventTypes.CREATE_CHANNEL, _this.onNewRoom);
            _this.socket.on(ClientEventTypes.MESSAGE, _this.onMessage);
            _this.socket.on(ClientEventTypes.POCK_USER, _this.onPockUser);
            _this.socket.on(ClientEventTypes.LOG_OUT, _this.onLogout);
            _this.socket.on(ClientEventTypes.DISCONNECT, _this.onDisconnect);
        };
        this.onDisconnect = function () {
            var redis = database_1.Redis.database;
            if (!redis || _this.userEmail || _this.userEmail)
                return;
            redis.hdel(_this.userEmail, 'socketID', function (err, isDeleted) {
                if (err)
                    throw err;
                if (isDeleted) {
                }
            });
        };
        this.onLogout = function (data) {
            var redis = database_1.Redis.database;
            if (!redis || !_this.host)
                return;
            var email = data.data.email;
            if (!email)
                return console.log('somenone else logout');
            redis.hdel(email, 'socketID', function (err, isDeleted) {
                if (err)
                    throw err;
                if (isDeleted)
                    console.log('user went offline');
            });
        };
        this.onPockUser = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var redis, _a, email, sender, isOnline;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        redis = database_1.Redis.database;
                        if (!redis || !this.host)
                            return [2 /*return*/];
                        _a = data.data, email = _a.email, sender = _a.sender;
                        return [4 /*yield*/, new Promise(function (res) {
                                redis.hget(email, 'socketID', function (err, reply) {
                                    if (err)
                                        throw err;
                                    res(!!reply);
                                });
                            })];
                    case 1:
                        isOnline = _b.sent();
                        ChatManager.io
                            .to(this.socket.id)
                            .emit(ServerEventTypes.POCK_USER, isOnline);
                        return [2 /*return*/];
                }
            });
        }); };
        this.onAuth = function (data) {
            var _a;
            var redis = database_1.Redis.database;
            if (!redis)
                return;
            var email = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.email;
            _this.userEmail = email;
            try {
                redis.hset(email, 'socketID', _this.socket.id);
            }
            catch (e) {
                console.log(e);
            }
        };
        this.onMessage = function (data) {
            var redis = database_1.Redis.database;
            if (!redis || !_this.host)
                return;
            var _a = data.data, _b = _a.from, senderEmail = _b.senderEmail, senderName = _b.senderName, to = _a.to, message = _a.message, channelID = _a.channelID, meta = _a.meta;
            to.forEach(function (user) {
                redis.hget(user.email, 'socketID', function (err, socket) {
                    if (err)
                        throw err;
                    if (socket) {
                        if (!meta)
                            meta = { channelID: channelID, message: message };
                        _this.host.to(socket).emit('server:message', meta);
                    }
                });
            });
            var msg = {
                content: message,
                user: {
                    senderName: senderName,
                    senderEmail: senderEmail,
                },
            };
            Channel_1.default.saveMessage(msg, channelID);
        };
        this.onNewRoom = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var redis, _a, from, to, message;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        redis = database_1.Redis.database;
                        if (!redis || !this.host)
                            return [2 /*return*/];
                        _a = data.data, from = _a.from, to = _a.to, message = _a.message;
                        return [4 /*yield*/, Channel_1.default.saveNewRoom(from, to, message).then(function (channelID) {
                                var clientRoom = {
                                    _id: channelID,
                                    creator: from.senderEmail,
                                    users: [
                                        { email: from.senderEmail, name: from.senderName },
                                        { email: to.recieverEmail, name: to.recieverName },
                                    ],
                                    messages: [
                                        {
                                            content: message,
                                            timestamp: new Date(),
                                            user: {
                                                senderEmail: from.senderEmail,
                                                senderName: from.senderName,
                                            },
                                        },
                                    ],
                                };
                                _this.socket.emit(ServerEventTypes.CREATE_CHANNEL, clientRoom);
                                //if online, emit event
                                redis.hget(to.recieverEmail, 'socketID', function (err, socket) {
                                    if (err)
                                        throw err;
                                    if (socket) {
                                        _this.host
                                            .to(socket)
                                            .emit(ServerEventTypes.CREATE_CHANNEL, clientRoom);
                                    }
                                });
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.setListeners();
    }
    return ConnectedUser;
}());
