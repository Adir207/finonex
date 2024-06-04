# Finonex Assignment

## Requirements
- Node.js
- PostgreSQL

## Setup
1. Install Node.js and PostgreSQL on your machine.
2. Create a PostgreSQL database and update the connection details in the `.env` file.
3. Create a `.env` file in the project directory with the following content:

    ```env
    # PostgreSQL Database Configuration
    DB_USER=your_user
    DB_HOST=localhost
    DB_NAME=your_db
    DB_PASSWORD=your_password
    DB_PORT=5432

    # Authorization Secret
    AUTH_SECRET=your_secret
    ```

    Replace `your_user`, `your_password`, `your_db`, and `your_secret` with your actual database credentials and desired authorization secret.

4. Run the database script to create the table: 

    ```sh
    psql -U your_user -d your_db -f db.sql
    ```

## Running the Server
1. Navigate to the project directory.
2. Install dependencies: 

    ```sh
    npm install
    ```

3. Start the server: 

    ```sh
    node server.js
    ```

## Running the Client
1. Ensure the `events.jsonl` file is present in the project directory with your event data.
2. Start the client: 

    ```sh
    node client.js
    ```

## Running the Data Processor
1. Ensure the `server_events.jsonl` file is present in the project directory with server-side event data.
2. Navigate to the project directory.
3. Start the data processor: 

    ```sh
    node data_processor.js
    ```

## Note
- Ensure you have the `.env` file correctly configured before running any scripts.
- The `events.jsonl` file should be in the same directory as your scripts and should contain the client-side event data in JSON Lines format.
- The `server_events.jsonl` file should be in the same directory as your scripts and should contain the server-side event data in JSON Lines format.
- Both `events.jsonl` and `server_events.jsonl` files are ignored by git and should be manually created with the appropriate event data.
