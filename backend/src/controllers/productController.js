import ProductService from "../services/productService.js";
import prisma from "../config/db.js";

export const createProduct = async (req, res, next) => {
  try {
    const imageUrls = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    const colors = req.body.colors ? JSON.parse(req.body.colors) : [];

    const newProduct = await ProductService.createProduct(
      {
        name: req.body.name,
        description: req.body.description || "",
        price: parseFloat(req.body.price),
        is_part: req.body.is_part === "true",
        category: req.body.category,
        warranty: req.body.warranty || "",
        stock_quantity: parseInt(req.body.stock_quantity, 10),
        colors,
        status: req.body.status === "true",
      },
      imageUrls
    );

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const isPart = req.body.is_part === "true" || req.body.is_part === true;
    const stockQuantity = req.body.stock_quantity ? parseInt(req.body.stock_quantity, 10) : null;
    const price = req.body.price ? parseFloat(req.body.price) : null;
    const colors = req.body.colors ? JSON.parse(req.body.colors) : [];
    const newImages = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    const status = req.body.status === "true" || req.body.status === true;

    const updatedProduct = await ProductService.updateProduct(
      req.params.id,
      { 
        ...req.body, 
        is_part: isPart,
        stock_quantity: stockQuantity,
        price: price,
        colors,
        status
      },
      newImages
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์", error: error.message });
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

export const getRandomProducts = async (req, res, next) => {
  try {
    const count = req.query.count ? parseInt(req.query.count, 10) : 4;

    const products = await ProductService.getRandomProducts(count);

    return res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getAllParts = async (req, res, next) => {
  try {
    const parts = await ProductService.getAllParts();
    return res.json(parts);
  } catch (error) {
    next(error);
  }
};

export const getPriceTiers = async (req, res, next) => {
  try {
    const tiers = await ProductService.getPriceTiers(req.params.id);
    res.json(tiers);
  } catch (err) {
    next(err);
  }
};

export const addPriceTier = async (req, res, next) => {
  try {
    const tier = await ProductService.addPriceTier(req.params.id, req.body);
    res.status(201).json(tier);
  } catch (err) {
    next(err);
  }
};

export const updatePriceTier = async (req, res, next) => {
  try {
    const updated = await ProductService.updatePriceTier(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deletePriceTier = async (req, res, next) => {
  try {
    await ProductService.deletePriceTier(req.params.id);
    res.json({ message: "deleted" });
  } catch (err) {
    next(err);
  }
};

export const setBomItems = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const bomItems = req.body.bomItems;
    const result = await ProductService.setBomItems(productId, bomItems);
    res.status(200).json({ message: "BOM updated successfully", data: result });
  } catch (error) {
    next(error);
  }
};

export const getBomItems = async (req, res, next) => {
  try {
    const productId = Number(req.params.id);
    console.log("Fetching BOM items for product:", productId);

    // ดึงข้อมูล BOM จากตาราง bom_item โดยใช้ productId
    const bomItems = await prisma.bom_item.findMany({
      where: { productId },
      include: {
        part: true,
      },
    });

    res.status(200).json(bomItems);
  } catch (error) {
    console.error("Error fetching BOM items:", error);
    // ส่งข้อผิดพลาดกลับไปพร้อมรายละเอียด
    res.status(500).json({ error: error.message });
  }
};
