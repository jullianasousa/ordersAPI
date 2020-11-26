import express from "express";
import { promises } from "fs";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = express();
const axios = require('axios');
var consign = require('consign');

app.use(express.json());

consign().include('src/routes').then('src/models').then('src/controllers').into(app);

app.listen(3000, async() =>{
    try {
        console.log("API started!");
    } catch (err) {
        console.log(err);
    }
});