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

// creates a new order with an id, product, buyer's name, email and cep
app.post("/order", async (req, res) => {
    let order = req.body;
    try {
        let data = await readFile(global.fileName, "utf8");
        let json = JSON.parse(data);

        order = { id: json.nextId, ...order };
        json.orders.push(order);
        json.nextId++;

        await writeFile(global.fileName, JSON.stringify(json));
        res.send("Order successfully added!");
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
});

// updates order according to its id
app.put("/order", async (req, res) => {
    let newOrder = req.body;
    try{
        let data = await readFile(global.fileName, "utf8");
        let json = JSON.parse(data);

        let index = json.orders.findIndex((order) => order.id === newOrder.id);

        json.orders[index].product = newOrder.product;
        json.orders[index].buyer = newOrder.buyer;
        json.orders[index].email = newOrder.email;
        json.orders[index].cep = newOrder.cep;

        await writeFile(global.fileName, JSON.stringify(json));
        res.send("Order updated sucessfully! \nThe new order is: " + JSON.stringify(newOrder));
    } catch(err) {
        res.status(400).send({ err: err.message })
    }
});

// deletes an order according to its id
app.delete("/:id", async (req, res) => {
    try{
        let data = await readFile(global.fileName, "utf8");
        let json = JSON.parse(data);

        let allOrders = json.orders.filter(
            (order) => order.id !== parseInt(req.params.id, 10)
        );
        json.orders = allOrders;

        await writeFile(global.fileName, JSON.stringify(json));

        res.send(`${req.params.id} foi excluído`);
    } catch(err) {
        res.status(400).send({ err: err.message })
    }
});

// gets person by its id and returns this person's address
app.post("/address", async (req, res) => {
    let findAddress = req.body;

    try {
        let data = await readFile(global.fileName, "utf8");
        let json = JSON.parse(data);

        let requestedCep = json.orders.find(
            (order) => order.cep === findAddress.cep
        );
        
        axios.get(`https://brasilapi.com.br/api/cep/v1/${requestedCep.cep}`).then(value => {res.send(value.data)});
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
});