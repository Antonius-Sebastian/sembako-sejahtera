import inquirer from "inquirer";
import { getTransactionProfit } from "../models/transactionModel.js";
import IDR from "../utils/IDRFormatter.js";
const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
let transactionProfit = [];

const viewProfit = async () => {
    transactionProfit = await getTransactionProfit();
    transactionProfit.forEach((record) => {
        record.bulan = month[parseInt(record.bulan) - 1];
        record.profit = IDR.format(record.profit);
    });
    // Print product table
    console.clear();
    console.table(transactionProfit);
    await inquirer.prompt({ message: "Back" });
};

export { viewProfit };
