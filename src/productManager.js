import fs from "fs";

export default class ProductManager {
	#products;
	#path;

	constructor(fileName) {
		this.#products = [];
		this.#path = `${fileName}.json`;
	};

	getProducts() {
		// Validar la existencia del archivo:
		if (!fs.existsSync(this.#path)) {
			try {
				// De lo contrario, crearlo:
				fs.writeFileSync(this.#path, JSON.stringify(this.#products));
			} catch (err) {
				return `There has been a writing error when getting products: ${err}`;
			};
		};
		
		// Leer archivo + convertirlo en objeto:
		try {
			const data = fs.readFileSync(this.#path, "utf8");
			const dataArray = JSON.parse(data);
			return dataArray;
		} catch (err) {
			return `There has been a reading error when getting products: ${err}`;
		};
	};

	lastId() {
		const products = this.getProducts();

		// Obtener + devolver último ID:
		if (products.length > 0) {
			const lastId = products.reduce((maxId, product) => {
				return product.id > maxId ? product.id : maxId;
			}, 0);
			return lastId;
		};

		// Si el array está vacío, devolver 0:
		return 0;
	}

	addProduct(title, description, price, thumbnail, code, stock) {
		const products = this.getProducts();

		// Validar campos incompletos:
		if (!title || !description || !price || !thumbnail || !code || !stock) {
			return `Please fill all the fields to add a product`;
		};

		// Validar existencia del código:
		if (products.some((product) => product.code === code)) {
			return `The code ${code} already exists`;
		};

		// Si lo es, escribir el archivo:
		try {
			const id = this.lastId() + 1;
			const product = { id, title, description, price, thumbnail, code, stock };
			products.push(product);
			fs.writeFileSync(this.#path, JSON.stringify(products));
		} catch (err) {
			return `There has been a writing error when adding the product: ${err}`;
		};
	};

	getProductById(id) {
		const products = this.getProducts();
		const product = products.find(product => product.id === id);

		// Validar existencia del prducto:
		if (!product) {
			return `There isn't a product with the ID ${id}`;
		}

		return product;
	}

	updateProduct(id, field, value) {
		const products = this.getProducts();
		const product = products.find(product => product.id === id);

		// Validar el ID:
		if (!product) {
			return `There isn't a product with the ID ${id}`;
		};

		// Validar el campo:
		if (!(field in product)) {
			return `There isn't a field "${field}" in the product ${id}`;
		};

		// Validar el valor:
		if (!value) {
			return `This value is incorrect`;
		};

		// Si lo es, escribir el archivo:
		try {
			product[field] = value;
			fs.writeFileSync(this.#path, JSON.stringify(products));
		} catch (err) {
			return `There has been a writing error when updating the product: ${err}`;
		};
	};

	deleteProduct(id) {
		const products = this.getProducts();
		const productIndex = products.findIndex(product => product.id === id);

		// Validar el ID:
		if (productIndex === -1) {
			return `There isn't a product with the ID: ${id}`;
		};

		// Si lo es, escribir el archivo:
		try {
			products.splice(productIndex, 1);
			fs.writeFileSync(this.#path, JSON.stringify(products));
		} catch (err) {
			return `There has been a writing error when deleting the product: ${err}`;
		};
	};
};
