"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getString = void 0;
const server_1 = require("react-dom/server");
const he_1 = require("he");
const getString = (component) => {
    return (0, he_1.unescape)((0, server_1.renderToString)(component)).split("<!-- -->").join(`
  `);
};
exports.getString = getString;
