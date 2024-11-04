import {
    addProduct,
    deleteProduct,
    updateProduct,
    getProduct,
} from "../models/productModel.js";
import inquirer from "inquirer";

const question = [
    {
        message: "Nama produk:",
        name: "nama",
        type: "input",
    },
    {
        message: "Berat produk:",
        name: "berat",
        type: "number",
    },
    {
        message: "Tipe berat:",
        name: "tipeBerat",
        type: "list",
        choices: [
            {
                name: "kg (kilogram)",
                value: "kg",
            },
            {
                name: "g (gram)",
                value: "g",
            },
            {
                name: "L (liter)",
                value: "L",
            },
        ],
    },
    {
        message: "Harga Beli:",
        name: "hargaBeli",
        type: "number",
    },
    {
        message: "Harga Jual:",
        name: "hargaJual",
        type: "number",
    },
    {
        message: "Stok:",
        name: "stok",
        type: "number",
    },
];

let productList = [];

const viewProduct = async () => {
    // Loop the menu
    let done = false;
    while (!done) {
        // Get product list
        productList = await getProduct();
        // Print product table
        console.clear();
        console.log("Product List");
        console.table(productList);

        const { choice } = await inquirer.prompt({
            message: "Menu",
            name: "choice",
            type: "expand",
            choices: [
                { name: "Add new Product", value: "a", key: "a" },
                { name: "Update Product", value: "u", key: "u" },
                { name: "Delete Product", value: "d", key: "d" },
                { name: "Exit", value: "e", key: "e" },
            ],
        });
        switch (choice) {
            case "a":
                await addNewProduct();
                await inquirer.prompt({
                    message: "Done",
                });
                break;
            case "u":
                await updateExistingProduct();
                await inquirer.prompt({
                    message: "Done",
                });
                break;
            case "d":
                await deleteExistingProduct();
                await inquirer.prompt({
                    message: "Done",
                });
                break;
            case "e":
                done = true;
            default:
                break;
        }
    }
};

const addNewProduct = async () => {
    const product = await inquirer.prompt(question);
    product.berat = `${product.berat} ${product.tipeBerat}`;
    delete product.tipeBerat;
    await addProduct(product);

    console.log("Operation summary:");
    console.table(product);
    console.log("Operation success. Added to the database.");
};

const updateExistingProduct = async () => {
    console.log("Update product");

    const { product } = await inquirer.prompt({
        message: "Select product:",
        name: "product",
        type: "list",
        choices: productList.map((product) => ({
            name: product.nama_produk,
            value: { ...product },
        })),
    });
    const newProduct = await inquirer.prompt(question);
    newProduct.berat = `${newProduct.berat} ${newProduct.tipeBerat}`;
    newProduct.no = product.no;
    delete newProduct.tipeBerat;

    await updateProduct(newProduct);
    console.log("Operation summary:");
    console.table(newProduct);
    console.log("Operation success. Updated the row.");
};

const deleteExistingProduct = async () => {
    console.log("Delete product");
    const { productNo } = await inquirer.prompt({
        message: "Select product:",
        name: "productNo",
        type: "list",
        choices: productList.map((product) => ({
            name: product.nama_produk,
            value: product.no,
        })),
    });

    await deleteProduct(productNo);
    console.log("Operation success. Deleted from the database.");
};

export default viewProduct;
