"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var morgan_1 = __importDefault(require("morgan"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var chat_IO_1 = require("./chat/chat-IO");
var auth_1 = __importDefault(require("./routes/api/auth"));
var profile_1 = __importDefault(require("./routes/api/profile"));
var users_1 = __importDefault(require("./routes/api/users"));
var App = /** @class */ (function () {
    function App() {
        this.app = express_1.default();
        this.http = http_1.default.createServer(this.app);
        this.io = socket_io_1.default(this.http);
        this.ChatManager = new chat_IO_1.ChatManager(this.io);
    }
    App.prototype.start = function () {
        if (process.env.NODE_ENV === 'production') {
            //not ready yet
        }
        else {
            this.middlewares();
            this.routes();
            this.handleErrors();
            this.http.listen(App.PORT, function () { });
        }
    };
    App.prototype.middlewares = function () {
        this.app.use(morgan_1.default('combined'));
        this.app.use(express_1.default.json());
        this.app.use(helmet_1.default());
    };
    App.prototype.routes = function () {
        this.app.use('/api/auth', new auth_1.default().router);
        this.app.use('/api/users', new users_1.default().router);
        this.app.use('/api/profile', new profile_1.default().router);
    };
    App.prototype.handleErrors = function () {
        process.on('beforeExit', function () {
            console.log('closing');
        });
    };
    App.PORT = process.env.PORT || 4001;
    return App;
}());
exports.App = App;
