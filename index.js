import { Command } from "commander";
const program = new Command();

// add
program
  .command("add")
  .description("Add a new item")
  .option("--description <description>", "name of the expense")
  .option("--amount <amount>", "Amount of the item", parseFloat) // Use parseFloat to convert to a number
  .action((options) => {
    console.log(options);
    const { description, amount } = options;
    if (
      !description ||
      description.trim() === "" ||
      description === "--amount"
    ) {
      console.error("Error: Description is required and cannot be empty.");
      return;
    }

    // Validate that amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      console.error("Error: Amount must be a positive number.");
      return;
    }

    console.log(`Added item: ${description} with amount: ${amount}`);
  });

// delete
program
  .command("delete")
  .description("delete a record")
  .option("--id <id>", "id of the expense", parseInt)
  .action((options) => {
    console.log(options);
    const { id } = options;
    if (!id) {
      console.error("Error: Id is required and cannot be empty.");
      return;
    }

    // Validate that amount is a positive number
    if (typeof id !== "number" || id <= 0 || id % 2 != 0) {
      console.error("Error: Invalid id provided.");
      return;
    }

    console.log(`Deleted item with: ${id}`);
  });

//   get list
program
  .command("list")
  .description("get list of all expenses")
  .action((options) => {
    console.log(`List of expenses`);
  });

// summary
program
  .command("summary")
  .description("get summary of all expenses")
  .option("--month <month>", "summary for the month", parseInt)
  .action((options) => {
    const isEmpty = (options) => Object.entries(options).length === 0;
    const { month } = options;
    if (isEmpty(options)) {
      console.log("entire summary");
    } else if (!month) {
      console.log("Month should be a number");
    } else if (month > 1 && month < 13) {
      console.log("Summary for the month");
    } else {
      console.log("Please enter a valid month");
    }
  });

program.parse();

if (program.args[0] == "list" && program.args.length > 1) {
  console.error(
    'Error: The command "list" does not accept any additional arguments.'
  );
  process.exit(1);
}

const options = program.opts();
const limit = program.first ? 1 : undefined;
console.log(program.args[0].split(options.separator, limit));

// $ expense-tracker add --description "Lunch" --amount 20
// $ expense-tracker list
// $ expense-tracker summary
// $ expense-tracker delete --id 1
// $ expense-tracker summary
// $ expense-tracker summary --month 8
