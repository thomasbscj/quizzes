"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var quizz_routes_1 = require("./routes/quizz.routes");
var postgre_connect_1 = require("./postgre.connect");
dotenv.config();
var PORT = process.env.PORT;
var app = express();
try {
    (0, postgre_connect_1.initPG)();
}
catch (err) {
    console.log("Could not initiate Postgre ".concat(err));
}
app.use(express.json());
app.use("/quizzes", quizz_routes_1.default);
app.listen(PORT, function () {
    console.log("Server running in port: ".concat(PORT));
});
