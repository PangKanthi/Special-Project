import axios from "axios";

const API_URL = "http://localhost:1234/api/products";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const ProductService = {
  async fetchProducts() {
    try {
      const response = await axios.get(API_URL);
      return response.data || [];
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      throw new Error("ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาตรวจสอบการเชื่อมต่อ");
    }
  },

  async addProduct(product) {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description || "");
    formData.append("price", product.price);
    formData.append("is_part", product.is_part ? true : false);
    formData.append("category", product.category);
    formData.append("warranty", product.warranty || "");
    formData.append("stock_quantity", product.stock_quantity);
    formData.append("colors", JSON.stringify(product.colors));

    product.images.forEach((img) => {
      formData.append("images", img.file);
    });

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeaders().headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error adding product:", error);
      throw new Error("เกิดข้อผิดพลาดในการเพิ่มสินค้า กรุณาลองใหม่อีกครั้ง");
    }
  },

  async updateProduct(productId, updatedProduct) {
    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("description", updatedProduct.description || "");
    formData.append("price", parseFloat(updatedProduct.price).toFixed(2));
    formData.append("is_part", JSON.stringify(updatedProduct.is_part === true));
    formData.append("category", updatedProduct.category);
    formData.append("warranty", updatedProduct.warranty || "");
    formData.append("stock_quantity", parseInt(updatedProduct.stock_quantity, 10));
    formData.append("colors", JSON.stringify(updatedProduct.colors));

    if (updatedProduct.images.length > 0) {
      updatedProduct.images.forEach((img) => {
        if (img.file) formData.append("images", img.file);
      });
    }

    try {
      const response = await axios.put(`${API_URL}/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeaders().headers,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error updating product:", error);
      throw new Error("เกิดข้อผิดพลาดในการแก้ไขสินค้า กรุณาลองใหม่อีกครั้ง");
    }
  },

  async deleteProduct(productId) {
    try {
      const response = await axios.delete(`${API_URL}/${productId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      throw new Error("ไม่สามารถลบสินค้าได้ กรุณาลองใหม่");
    }
  },
};

export default ProductService;
