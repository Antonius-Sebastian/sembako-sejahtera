import db from "../config/db.js";

const getProduct = async () => {
    let res = [];
    try {
        res = (await db.query("SELECT * FROM produk")).rows;
    } catch (error) {
        console.error("Error querying the database", error);
    }
    return res;
};

const addProduct = async (product) => {
    try {
        await db.query(
            "INSERT INTO produk (nama_produk, berat, harga_beli, harga_jual, stok) VALUES($1, $2, $3, $4, $5)",
            [
                product.nama,
                product.berat,
                product.hargaBeli,
                product.hargaJual,
                product.stok,
            ]
        );
    } catch (error) {
        console.error("Error inserting into the database", error);
    }
};

const updateProduct = async (product) => {
    try {
        await db.query(
            "UPDATE produk SET nama_produk = $1, berat = $2, harga_beli = $3, harga_jual = $4, stok = $5 WHERE no = $6",
            [
                product.nama,
                product.berat,
                product.hargaBeli,
                product.hargaJual,
                product.stok,
                product.no,
            ]
        );
    } catch (error) {
        console.error("Error querying the database", error);
    }
};

const deleteProduct = async (id) => {
    try {
        await db.query("DELETE FROM produk WHERE no = $1", [id]);
    } catch (error) {
        console.error("Error deleting the row", error);
    }
};

export { getProduct, addProduct, updateProduct, deleteProduct };
