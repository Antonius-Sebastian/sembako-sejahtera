import inquirer from "inquirer";
import addTransaction from "./service/addTransaction.js";
import viewProduct from "./service/product.js";
import { viewTransaction } from "./service/transaction.js";
import { viewProfit } from "./service/finance.js";

const main = async () => {
    // Loop the main menu
    while (true) {
        console.clear();
        console.log("Sembako Sejahtera");
        const { choice } = await inquirer.prompt({
            message: "Menu",
            name: "choice",
            type: "expand",
            choices: [
                { name: "Add Transaction", value: "a", key: "a" },
                { name: "View Product", value: "p", key: "p" },
                { name: "View Transaction", value: "t", key: "t" },
                { name: "Finance (Profit, Tax)", value: "f", key: "f" },
                { name: "Exit", value: "e", key: "e" },
            ],
        });
        switch (choice) {
            case "a":
                await addTransaction();
                break;
            case "p":
                await viewProduct();
                break;
            case "t":
                await viewTransaction();
                break;
            case "f":
                await viewProfit();
                break;
            case "e":
                console.log("Thank you for using this application!");
                process.exit(0);
                break;
            default:
                break;
        }
    }
};

await main();
