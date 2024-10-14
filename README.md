A simple expense tracker application to manage your finances. The application should allow users to add, delete, and view their expenses. The application should also provide a summary of the expenses.

Requirements
Application should run from the command line and should have the following features:

Users can add an expense with a description and amount.
Users can update an expense.
Users can delete an expense.
Users can view all expenses.
Users can view a summary of all expenses.
Users can view a summary of expenses for a specific month (of current year).

The list of commands and their expected output is shown below:

$ expense-tracker add --description "Lunch" --amount 20
# Expense added successfully (ID: 1)

$ expense-tracker add --description "Dinner" --amount 10
# Expense added successfully (ID: 2)

$ expense-tracker list
# ID  Date       Description  Amount
# 1   2024-08-06  Lunch        $20
# 2   2024-08-06  Dinner       $10

$ expense-tracker summary
# Total expenses: $30

$ expense-tracker delete --id 1
# Expense deleted successfully

$ expense-tracker summary
# Total expenses: $20

$ expense-tracker summary --month 8
# Total expenses for August: $20

Implementation
You can implement the application using any programming language of your choice. Here are some suggestions:

Use any programming language for any available module for parsing command arguments (e.g. python with the argparse, node.js with commander etc).
Use a simple text file to store the expenses data. You can use JSON, CSV, or any other format to store the data.
Add error handling to handle invalid inputs and edge cases (e.g. negative amounts, non-existent expense IDs, etc).
