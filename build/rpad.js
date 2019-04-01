"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (text, len) {
    var t = text;
    if (t.length > len) {
        t = text.substr(0, len - 3) + "...";
    }
    return "" + t + new Array(len - t.length + 1).join(" ");
});
