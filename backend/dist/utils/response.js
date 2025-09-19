"use strict";
// src/utils/response.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = success;
exports.fail = fail;
function success(data) {
    return { success: true, data };
}
function fail(error) {
    return { success: false, error };
}
