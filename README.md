# Sembako Sejahtera

Sembako Sejahtera is a simple command-line interface (CLI) application built with Node.js and PostgreSQL to manage inventory transactions, products, and finances for a basic inventory system.

## Table of Contents

-   [Sembako Sejahtera](#sembako-sejahtera)
    -   [Table of Contents](#table-of-contents)
    -   [Features](#features)
    -   [Installation](#installation)
    -   [Usage](#usage)

## Features

-   **Add Transaction**: Record a new transaction for a product.
-   **View Products**: Display a list of available products.
-   **Manage Products**: Add, update, or delete products from the inventory.
-   **View Transactions**: Display a list of past transactions.
-   **View Profit**: Calculate and view profit and tax based on transactions.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Antonius-Sebastian/sembako-sejahtera
    cd sembako-sejahtera
    ```
2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Set up environment variables**: Create a `.env` file in the project root with the following configuration:
    ```bash
    PG_USER="postgres"
    PG_HOST="localhost"
    PG_DATABASE="sembako_sejahtera"
    PG_TEST_DATABASE="sembako_sejahtera_test"
    PG_PASSWORD="yourpassword"
    PG_PORT="5432"
    ```
4. **Set up the database**: Import the `sembako_sejahtera.sql` file to create tables and initial data and `sembako_sejahtera.sql` for testing.

## Usage

To start the application, run:

```bash
npm start
```
