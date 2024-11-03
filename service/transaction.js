import inquirer from "inquirer";
import {
    getTransaction,
    getTransactionProfit,
} from "../models/transactionModel.js";

let transactionList = [];

const viewTransaction = async () => {
    transactionList = await getTransaction();
    // Print product table
    console.clear();
    console.log("Transaction List");
    console.table(transactionList);

    await inquirer.prompt({ message: "Back" });
};

export { viewTransaction };
