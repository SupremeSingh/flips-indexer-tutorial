# Starknet Transaction Indexer

An indexer for a Starknet smart contract that monitors and processes specific transactions, with optional PostgreSQL storage support. It is based on the [Apibara](https://www.apibara.com/) framework, and follows this [tutorial](https://github.com/SupremeSingh/apibara-starknet-tutorial).

## Description

This indexer monitors Starknet transactions looking for specific patterns in transaction calldata that match team-based coordinate placements. It processes transactions from block `841178` onwards and can output the data either to console or store it in a PostgreSQL database.

Each processed transaction contains:
    - Block number
    - Timestamp
    - Transaction hash
    - Signature
    - Sender
    - Coordinates
    - Team color

## Usage

### Runtime

Please create an API key with Apibara, and use it to run the following command in your terminal. Note the command has to be run from the root directory of the project.

```bash
apibara run --allow-env=.env indexer.js -A [API_KEY]
```

### Console Output
By default, the indexer will output processed transactions to the console.

### PostgreSQL Setup
To use PostgreSQL storage, please follow the tutorial provided by Apibara [here](https://www.apibara.com/docs/integrations/postgres). The table schema is as follows:

```sql
CREATE TABLE transactions (
    block_number BIGINT,
    timestamp BIGINT,
    transaction_hash TEXT,
    signature TEXT[],
    from_address TEXT,
    coordinates TEXT,
    team_color TEXT
);
```

Please also update the config in `indexer.js`:
```javascript
export const config = {
  // ... other config ...
  sinkType: "postgres",
  sinkOptions: {
    connectionString: "postgresql://your_user:your_password@localhost:5432/your_db_name",
    noTls: true,
    tableName: "transactions"
  }
};
```
and set up the environment variables for the connection string.

## Configuration

The indexer uses the following constants (defined in `constants.js`):

- `TEAMS`: Mapping of team IDs to colors (orange, green, red, blue, pink, purple)
- `STARTING_BLOCK`: The block number to start indexing from (`841178`)
- `TARGET_HEX`: The entry point for the 'flip' function to look for in transaction calldata

## Development

To modify the team colors or other constants, edit the `constants.js` file:
```javascript
export const TEAMS = {
    0: 'orange',
    1: 'green',
    2: 'red',
    3: 'blue',
    4: 'pink',
    5: 'purple',
};
export const STARTING_BLOCK = 841178;
export const TARGET_HEX = "0x016ef95138c9aa6fc0fc33afb9c61bb877a82fb413f53bdf8ae9520a2ef42d41";
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

