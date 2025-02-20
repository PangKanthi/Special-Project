import ProductService from "../services/productService.js";

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
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
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

export const addProductToKit = async (req, res, next) => {
  try {
    const { kitId } = req.body;
    const result = await ProductService.addProductToKit(req.params.id, kitId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const removeProductFromKit = async (req, res, next) => {
  try {
    const { kitId } = req.body;
    await ProductService.removeProductFromKit(req.params.id, kitId);
    res.json({ message: "Product removed from installation kit" });
  } catch (error) {
    next(error);
  }
};
