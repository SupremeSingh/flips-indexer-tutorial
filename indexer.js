import { hash } from "https://esm.run/starknet@5.14";
import { TEAMS, TARGET_HEX, STARTING_BLOCK } from "./constants.js";

export const config = {
  streamUrl: "https://mainnet.starknet.a5a.ch",
  startingBlock: STARTING_BLOCK,
  network: "starknet",
  finality: "DATA_STATUS_PENDING",
  filter: {
    header: { weak: true },
    transactions: [
      {
        invokeV1: {},
      },
    ],
  },
  sinkType: "console",
  sinkOptions: {},
  /* 
  sinkOptions: {
    connectionString: Deno.env.get('POSTGRES_CONNECTION_STRING'),
    noTls: true,
    tableName: "transactions",
  },
  */
};

export default function transform({ header, transactions }) {

  const { blockNumber, timestamp } = header;

  const transformedTransactions = transactions
    .map(({ transaction }) => {
      const { meta, invokeV1 } = transaction;

      const index = invokeV1.calldata.indexOf(TARGET_HEX);

      if (index !== -1 && invokeV1.calldata.length > index + 4) {
        const followingCalldataDecimal = invokeV1.calldata
          .slice(index + 2, index + 5)
          .map(hexValue => parseInt(hexValue, 16));

        // Generate (x,y) coordinates from first 2 values of the followingCalldataDecimal
        const coordinates = `${followingCalldataDecimal[0]},${followingCalldataDecimal[1]}`;

        const teamColor = TEAMS[followingCalldataDecimal[2]] || 'unknown';

        return {
          block_number: blockNumber,                         // Block number
          timestamp: timestamp,                              // Timestamp
          transactionHash: meta.hash,                        // Transaction hash
          signature: meta.signature,                         // Signature of the transaction
          fromAddress: invokeV1.senderAddress,               // Sender address
          coordinates: coordinates,                          // Coordinates
          team_color: teamColor                              // Team color
        };
      }
      return null;
    })
    .filter(item => item !== null); // Filter out any null results

  return transformedTransactions;
}
