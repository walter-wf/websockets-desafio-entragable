import { Router } from "express";

import { ProductManager } from "../models/index.js";

const homeRouter = Router();
const productManager = new ProductManager();

homeRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.status(200).render("pages/home", {
      js: "/home.js",
      styles: "/styles",
      titulo: "Home",
      products: products,
      error: null,
    });
  } catch (error) {
    res.status(500).render("pages/home", {
      js: "/home.js",
      styles: "/styles",
      titulo: "Home",
      products: [],
      error: `Hubo un error: ${error}`,
    });
  }
});

export { homeRouter };