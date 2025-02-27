import ProductService from "../services/productService.js";

export const createProduct = async (req, res, next) => {
  try {
    const imageUrls = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    const colors = req.body.colors ? JSON.parse(req.body.colors) : [];

    const newProduct = await ProductService.createProduct(
      { ...req.body, colors },
      imageUrls
    );

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const newImages = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    const colors = req.body.colors ? JSON.parse(req.body.colors) : [];

    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      { ...req.body, colors },
      newImages
    );

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};
