import express from "express";

const app = express();
const port = 3000;

import ProductManager from "./productManager.js";
const productManager = new ProductManager("products");

// Extended para querys:
app.use(express.urlencoded({ extended: true }));

// Endpoint mostrar productos:
app.get("/products", async (req, res) => {
	try {
		const { limit } = req.query;
		const products = await productManager.getProducts();

		if (limit) {
      // Limitar array según valor de 'limit':
			const limitedProducts = products.slice(0, limit);
			return res.json(limitedProducts);
		} else {
			return res.json(products);
		};
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

// Endpoint mostrar producto según ID:
app.get("/products/:pid", async (req, res) => {
	try {
    // Tomar 'id', convertirlo en número entero y buscar el producto:
		const { pid } = req.params;
		const productId = parseInt(pid);
		const product = await productManager.getProductById(productId);

		return res.json(product);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	};
});

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});
