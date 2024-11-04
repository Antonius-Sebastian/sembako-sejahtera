import {
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../src/models/productModel.js";
import db from "../src/config/db.js";

beforeAll(async () => {
    // Initialize the database
    await db.query(`
        INSERT INTO produk (nama_produk, berat, harga_beli, harga_jual, stok)
        VALUES
            ('Product A', 500, 1000, 1500, 20),
            ('Product B', 200, 500, 800, 50),
            ('Product C', 300, 700, 1200, 30);
    `);
});

afterAll(async () => {
    // Clear test data and close the database connection
    await db.query("TRUNCATE produk RESTART IDENTITY CASCADE");
    await db.end();
});

describe("Product Model", () => {
    test("should retrieve all products", async () => {
        const products = await getProduct();
        expect(Array.isArray(products)).toBe(true);
    });

    test("should add a product", async () => {
        const product = {
            nama: "Test Product",
            berat: 500,
            hargaBeli: 10000,
            hargaJual: 15000,
            stok: 10,
        };

        await addProduct(product);

        const products = await getProduct();
        const addedProduct = products.find(
            (p) => p.nama_produk === product.nama
        );
        expect(addedProduct).toBeDefined();
        expect(addedProduct.nama_produk).toBe("Test Product");
    });

    test("should update a product", async () => {
        const product = {
            no: 4, // Use the correct product ID for your test
            nama: "Updated Product",
            berat: 600,
            hargaBeli: 11000,
            hargaJual: 16000,
            stok: 15,
        };

        await updateProduct(product);

        const products = await getProduct();
        const updatedProduct = products.find((p) => p.no === product.no);
        expect(updatedProduct).toBeDefined();
        expect(updatedProduct.nama_produk).toBe("Updated Product");
    });

    test("should delete a product", async () => {
        const productId = 1; // Use the correct product ID for your test

        await deleteProduct(productId);

        const products = await getProduct();
        const deletedProduct = products.find((p) => p.no === productId);
        expect(deletedProduct).toBeUndefined();
    });
});
