import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { createServer } from "node:http";
import { Server } from "socket.io";

import { ProductManager } from "./models/index.js";

import {
  prodRouter,
  cartRouter,
  homeRouter,
  realTimeRouter,
} from "./routes/index.js";

import { __dirname } from "./path.js";

const PORT = 8080;

const app = express();
const server = createServer(app);
const io = new Server(server);

const productManager = new ProductManager();

server.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

// ** Middlewares **
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ** Setting public **
app.use("/", express.static(path.join(__dirname, "/public")));

// ** Handlebars **
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// ** Socket **
io.on("connection", (socket) => {
  console.log("usuario conectado");

  socket.on("getProducts", async () => {
    const products = await productManager.getProducts();
    io.emit("prodsData", products);
  });

  socket.on("newProduct", async (newProd) => {
    console.log(newProd);
    await productManager.addProduct(newProd);
    const products = await productManager.getProducts();
    io.emit("prodsData", products);
  });
  socket.on("removeProduct", async (prodId) => {
    await productManager.deleteProduct(prodId);
    io.emit("productRemoved", prodId); // Emitir a todos los clientes que el producto ha sido eliminado
  });
});

// ** Routes / Endpoints **
app.use("/api/products", prodRouter);
app.use("/api/carts", cartRouter);

app.use("/home", homeRouter);
app.use("/realtimeproducts", realTimeRouter);