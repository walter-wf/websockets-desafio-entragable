import { promises as fs } from "fs";
import { join } from "path";
import { __dirname } from "../path.js";

const CARTS_PATH = join(__dirname, "db", "carts.json");
const PRODUCTS_PATH = join(__dirname, "db", "products.json");

const readCartFile = await fs.readFile(CARTS_PATH, "utf-8");

export class CartManager {

  #generateCartId(carts) {
    const existingIds = carts.map((cart) => cart.id);
    let newId = 1;
    while (existingIds.includes(newId)) {
      newId++;
    }
    return newId;
  }

  // Get Cart
  async getCarts() {
    try {
      return JSON.parse(readCartFile);
    } catch (error) {
      console.log("Error al leer el carrito", error);
      return [];
    }
  }

  // Get Cart by id
  async getCartById(cartId) {
    const carts = await this.getCarts();
    return carts.find((cart) => cart.id === cartId);
  }

  // Create Cart
  async createCart() {
    const carts = await this.getCarts();
    const newCartId = this.#generateCartId(carts);
    const newCart = {
      id: newCartId,
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(CARTS_PATH, JSON.stringify(carts));
    return newCart;
  }

  //Delete cart by id
  async deleteCart(cartId) {
    const intCartId = parseInt(cartId);
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === intCartId);
  
      if (cartIndex === -1) {
        console.log(`El carrito con el id: ${intCartId} no encontrado`);
        return false;
      } else {
        carts.splice(cartIndex, 1);
        await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));
        return true;
      }
    } catch (error) {
      console.log(`Hubo un error al borrar el carrito ${error}`);
      return false;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      const carts = await this.getCarts();
      const products = await this.getProducts();

      const cartIndex = carts.findIndex(
        (cart) => parseInt(cart.id) === parseInt(cartId)
      );
      const product = products.find(
        (prod) => parseInt(prod.id) === parseInt(productId)
      );

      if (cartIndex === -1 || !product) {
        console.log("Carrito o producto no encontrado.");
        return false;
      }

      const existingProduct = carts[cartIndex].products.find(
        (prod) => parseInt(prod.id) === parseInt(productId)
      );

      if (existingProduct) {
        console.log("Producto existente:");
        existingProduct.quantity += parseInt(quantity);
      } else {
        console.log("Agregar producto al carrito.");
        carts[cartIndex].products.push({
          id: parseInt(productId),
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnail: product.thumbnail,
          code: product.code,
          quantity: parseInt(quantity),
        });
      }

      await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));
      return true;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      return false;
    }
  }
  // Eliminar productos del cart
  async removeProductFromCart(cartId, productId) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        console.log("Carrito no encontrado.");
        return false;
      }

      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (prod) => prod.id === productId
      );

      if (productIndex === -1) {
        console.log("Producto no encontrado en el carrito.");
        return false;
      }

      cart.products.splice(productIndex, 1);
      await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));

      return true;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return false;
    }
  }
  // Leer productos
  async getProducts() {
    try {
      const content = await fs.readFile(PRODUCTS_PATH, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.error("No se leyeron los productos:", error);
      return [];
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const carts = await this.getCarts();

      const cartIndex = carts.findIndex((cart) => cart.id === cartId);

      if (cartIndex === -1) {
        console.log("Carrito no encontrado.");
        return false;
      }

      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex(
        (prod) => prod.id === productId
      );

      if (productIndex === -1) {
        console.log("Producto no encontrado en el carrito.");
        return false;
      }

      cart.products[productIndex].quantity = parseInt(newQuantity);
      await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2));

      return true;
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto:", error);
      return false;
    }
  }
}