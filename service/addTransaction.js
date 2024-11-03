import { deleteProduct, getProduct } from "../models/productModel.js";
import { addTransaction } from "../models/transactionModel.js";
import inquirer from "inquirer";
import IDR from "../utils/IDRFormatter.js";
// Formatter for 'IDR' currency

// Variable initialization
let productList = [];
const cart = [];
let clientName = "";
let totalPrice = 0;
let total_price = 0;

// Get the client's name
const getName = async () => {
    const { name } = await inquirer.prompt({
        name: "name",
        type: "input",
        message: "Enter client's name:",
        validate: (value) => {
            return value != "" || "Name can not be empty.";
        },
    });
    return name;
};

// Add product to cart
const addToCart = async () => {
    console.clear();
    let askAgain = true;
    while (askAgain) {
        viewProduct();
        let product;
        // Prompt produk
        try {
            product = await inquirer
                .prompt({
                    message: "Choose Product:",
                    name: "product",
                    type: "list",
                    choices: productList
                        .filter((element) => element.stok > 0)
                        .map((element) => ({
                            name: element.nama_produk,
                            value: { ...element },
                        })),
                })
                .then((res) => res.product);
        } catch (error) {
            break;
        }

        // Prompt jumlah produk
        let { qty } = await inquirer.prompt({
            message: "Amount:",
            name: "qty",
            type: "number",
            validate: (value) => {
                return value > 0 && value <= product.stok;
            },
        });

        // Calculate the total price and add 10% tax
        total_price = product.harga * qty;

        // Sum product's quantity and total price in cart (if product exists in cart)
        let exists = false;
        cart.forEach((element) => {
            if (element.no == product.no) {
                element.jumlah += qty;
                element.total_harga += total_price;
                exists = true;
            }
        });

        // Add new product to the cart if the product doesn't exists in cart
        if (!exists) {
            cart.push({
                ...product,
                jumlah: qty,
                total_harga: total_price,
            });
        }

        // Update produkList's stock
        productList.find((element) => element.no == product.no).stok -= qty;

        // Loop the process if the user want to add more product
        askAgain = await inquirer
            .prompt({
                message: "Do you want to add another product?",
                name: "askAgain",
                type: "confirm",
                default: true,
            })
            .then((res) => res.askAgain);
    }
    updateCartItems();
};

// Update cart item
const updateCart = async () => {
    console.log("Update cart");
    // Show client's cart
    viewCart();

    // Get the product that want to be updated
    const { updatedProduct } = await inquirer.prompt({
        message: "Choose Product:",
        name: "updatedProduct",
        type: "list",
        choices: cart.map((element) => ({
            name: element.nama_produk,
            value: element,
        })),
    });

    // Find the product's stocks
    const productStock = productList.find(
        (product) => product.no == updatedProduct.no
    ).stok;

    // Get the new amount
    const { qty } = await inquirer.prompt({
        message: "Enter new amount:",
        name: "qty",
        type: "number",
        validate: (value) => {
            return value > 0 && value <= productStock + updatedProduct.jumlah;
        },
    });

    // Update the value
    productList.find((p) => p.no == updatedProduct.no).stok +=
        updatedProduct.jumlah - qty;
    updatedProduct.jumlah = qty;
};

const deleteCart = async () => {
    console.log("Delete cart");
    // Show client's cart
    viewCart();

    // Get the product that want to be updated
    const { product } = await inquirer.prompt({
        message: "Choose Product:",
        name: "product",
        type: "list",
        choices: cart.map((element) => ({
            name: element.nama_produk,
            value: { ...element },
        })),
    });
    cart.splice(
        cart.findIndex((item) => item.no == product.no),
        1
    );
    productList.find((item) => item.no == product.no).stok += product.jumlah;
    console.log("Operation success. Item deleted from cart.");
};

const menu = async () => {
    let done = false;

    // Get the product list from database
    productList = await getProduct();
    productList.forEach((product) => {
        product.harga = product.harga_jual;
        delete product.harga_beli;
        delete product.harga_jual;
    });

    clientName = await getName();

    // Call add to cart for the first time
    await addToCart();

    // Loop until transaction is done
    while (!done) {
        console.clear();
        const { choice } = await inquirer.prompt({
            message: "Menu",
            name: "choice",
            type: "expand",
            choices: [
                { name: "Add Product", value: "a", key: "a" },
                { name: "Update Cart", value: "u", key: "u" },
                { name: "Delete Item", value: "x", key: "x" },
                { name: "View Cart", value: "c", key: "c" },
                { name: "Cancel", value: "q", key: "q" },
                { name: "Done", value: "d", key: "d" },
            ],
        });
        switch (choice) {
            case "a":
                await addToCart();
                break;
            case "u":
                await updateCart();
                break;
            case "c":
                viewCart();
                await inquirer.prompt({
                    message: "Back to menu",
                    name: "askAgain",
                    type: "input",
                });
                break;
            case "x":
                await deleteCart();
                await inquirer.prompt({
                    message: "Back to menu",
                    name: "askAgain",
                    type: "input",
                });
                break;
            case "d":
                done = true;
                cart.forEach(async (item) => await addTransaction(item));
                // Print transaction summary
                viewCart();
                console.log(`Total price     : ${IDR.format(totalPrice)}`);
                console.log(
                    `Tax             : ${IDR.format(
                        Number(totalPrice * 0.1).toFixed(2)
                    )}`
                );
                console.log(
                    `Price after tax : ${IDR.format(
                        Number(totalPrice * 1.1).toFixed(2)
                    )}\v`
                );
                await inquirer.prompt({
                    message: "Done",
                });
            default:
                done = true;
                break;
        }
    }
};

// Update cart items field (namaPelanggan, tanggal, stok) and update totalPrice
const updateCartItems = () => {
    const date = new Date().toLocaleDateString();
    cart.forEach((item) => {
        item.namaPelanggan = clientName;
        totalPrice += item.total_harga;
        item.tanggal = date;
        delete item.stok;
    });
};

// Print productList
const viewProduct = () => {
    console.log("Product List:");
    console.table(
        productList
            .filter((prod) => prod.stok > 0)
            .map((prod) => ({
                ...prod,
                harga: IDR.format(prod.harga),
            }))
    );
};

// Print cart
const viewCart = () => {
    console.clear();
    if (cart.length == 0) {
        console.log("There are no items on the cart.");
    } else {
        console.log("Your cart");
        console.table(
            cart.map((produk) => ({
                ...produk,
                harga: IDR.format(produk.harga),
                total_harga: IDR.format(produk.total_harga),
            }))
        );
    }
};

export default menu;
