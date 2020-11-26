import express from "express";
import { promises } from "fs";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

global.fileName = "data/orders.json";

const { readFile, writeFile } = promises;
const app = express();
const axios = require('axios');

app.use(express.json());

app.listen(3000, async() =>{
    try {
        console.log("API started!");
    } catch (err) {
        console.log(err);
    }
});

// gets an order by its id
app.get("/:id", async (req, res) => {
    try {
        let data = await readFile(global.fileName, "utf8");
        let json = JSON.parse(data);

        let requestedOrder = json.orders.filter(
            (order) => order.id === parseInt(req.params.id, 10)
        );

        res.send(requestedOrder);
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
});