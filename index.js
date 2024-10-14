import { Command } from "commander";
import fs from "fs";
import csv from "fast-csv";
import path from "path";

const program = new Command();
const csvFilePath = path.resolve("expenses.csv");

// Function to initialize CSV file if it doesn't exist
const initializeCSV = () => {
  if (!fs.existsSync(csvFilePath)) {
    const headers = ["id", "description", "amount", "date"];
    const ws = fs.createWriteStream(csvFilePath);
    csv.write([headers], { headers: false }).pipe(ws);
  }
};

// Function to read expenses from CSV
const readExpenses = () => {
  const expenses = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv.parse({ headers: true }))
      .on("data", (row) => expenses.push(row))
      .on("end", () => resolve(expenses))
      .on("error", reject);
  });
};

// Function to write expenses to CSV
const writeExpenses = (expenses) => {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(csvFilePath);
    csv
      .write(expenses, { headers: true })
      .pipe(ws)
      .on("finish", resolve)
      .on("error", reject);
  });
};

// Initialize CSV file
initializeCSV();

// Add command
program
  .command("add")
  .description("Add a new item")
  .option("--description <description>", "name of the expense")
  .option("--amount <amount>", "Amount of the item", parseFloat)
  .action(async (options) => {
    const { description, amount } = options;

    if (!description || description.trim() === "") {
      console.error("Error: Description is required and cannot be empty.");
      return;
    }
    if (typeof amount !== "number" || amount <= 0) {
      console.error("Error: Amount must be a positive number.");
      return;
    }

    const expenses = await readExpenses();
    const newExpense = {
      id: expenses.length + 1,
      description,
      amount,
      date: new Date().toISOString()
    };
    expenses.push(newExpense);
    await writeExpenses(expenses);

    console.log(`Added item: ${description} with amount: ${amount}`);
  });

// Delete command
program
  .command("delete")
  .description("delete a record")
  .option("--id <id>", "id of the expense", parseInt)
  .action(async (options) => {
    const { id } = options;
    if (!id) {
      console.error("Error: Id is required and cannot be empty.");
      return;
    }

    const expenses = await readExpenses();
    const updatedExpenses = expenses.filter(
      (expense) => parseInt(expense.id) !== id
    );

    if (updatedExpenses.length === expenses.length) {
      console.error("Error: No expense found with the provided ID.");
      return;
    }

    await writeExpenses(updatedExpenses);
    console.log(`Deleted item with ID: ${id}`);
  });

// List command
program
  .command("list")
  .description("get list of all expenses")
  .action(async () => {
    const expenses = await readExpenses();
    console.log("List of expenses:");
    expenses.forEach((expense) => {
      console.log(
        `ID: ${expense.id}, Description: ${expense.description}, Amount: ${expense.amount}, Date: ${expense.date}`
      );
    });
  });

// Summary command
program
  .command("summary")
  .description("get summary of all expenses")
  .option("--month <month>", "summary for the month", parseInt)
  .action(async (options) => {
    const expenses = await readExpenses();
    const { month } = options;

    if (month && (month < 1 || month > 12)) {
      console.log("Please enter a valid month (1-12).");
      return;
    }

    let total = 0;
    expenses.forEach((expense) => {
      const expenseMonth = new Date(expense.date).getMonth() + 1; // Assuming you have a date field
      if (!month || expenseMonth === month) {
        total += parseFloat(expense.amount);
      }
    });

    console.log(`Total expenses: ${total}`);
  });

program.parse();
