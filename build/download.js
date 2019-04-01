"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var https_1 = __importDefault(require("https"));
exports.default = (function (url, w, progress) {
    if (progress === void 0) { progress = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    }; }
    return new Promise(function (resolve, reject) {
        var protocol = /^https:/.exec(url) ? https_1.default : http_1.default;
        progress(0);
        protocol
            .get(url, function (res1) {
            protocol = /^https:/.exec(res1.headers.location) ? https_1.default : http_1.default;
            protocol
                .get(res1.headers.location, function (res2) {
                var total = parseInt(res2.headers["content-length"], 10);
                var completed = 0;
                res2.pipe(w);
                res2.on("data", function (data) {
                    completed += data.length;
                    progress(completed / total);
                });
                res2.on("progress", progress);
                res2.on("error", reject);
                res2.on("end", resolve);
            })
                .on("error", reject);
        })
            .on("error", reject);
    });
});
