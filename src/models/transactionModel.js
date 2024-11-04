import db from "../config/db.js";

const getTransaction = async () => {
    let res = [];
    try {
        res = (
            await db.query(
                "SELECT t.id AS id_transaksi, no_produk, nama_produk, berat, jumlah, harga_jual AS harga, nama_pelanggan, tanggal FROM produk p JOIN transaksi t ON p.no = t.no_produk"
            )
        ).rows;
    } catch (error) {
        console.error("Error querying the database", error);
    }
    return res;
};

const getTransactionProfit = async () => {
    let res = [];
    try {
        res = (
            await db.query(
                "SELECT EXTRACT(MONTH from tanggal) as bulan, SUM((harga_jual - harga_beli) * jumlah) AS profit FROM produk p JOIN transaksi t ON p.no = t.no_produk GROUP BY bulan"
            )
        ).rows;
    } catch (error) {
        console.error("Error querying the database", error);
    }
    return res;
};

const addTransaction = async (item) => {
    try {
        await db.query(
            "INSERT INTO transaksi (nama_pelanggan, no_produk, jumlah, tanggal) VALUES($1, $2, $3, $4)",
            [item.namaPelanggan, item.no, item.jumlah, item.tanggal]
        );
    } catch (error) {
        console.error("Error inserting into the database", error);
    }
};

export { getTransaction, getTransactionProfit, addTransaction };
