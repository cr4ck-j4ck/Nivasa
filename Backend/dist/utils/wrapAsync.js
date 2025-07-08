"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = asyncWrapper;
function asyncWrapper(func) {
    return (req, res, next) => {
        func(req, res).catch((err) => {
            console.error("Error caught in asyncWrapper:", err);
            return next(err);
        });
    };
}
