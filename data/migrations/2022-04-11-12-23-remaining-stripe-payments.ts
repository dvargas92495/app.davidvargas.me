import getMysqlConnection from "~/package/backend/mysql.server";
import type { MigrationProps } from "fuegojs/types";
import insertRevenueFromStripe from "~/data/insertRevenueFromStripe.server";

const IDS = [
  "pi_3Km2qQFHEvC1s7vk1B3vuCoh",
  "pi_3Km3bBFHEvC1s7vk00GZot5T",
  "pi_3KmWl0FHEvC1s7vk1imXaY88",
  "pi_3KmkKLFHEvC1s7vk1NR9Z7ib",
  "pi_3KmmfVFHEvC1s7vk0pF4eUbr",
  "pi_3Kn0W8FHEvC1s7vk0OctYtp8",
];

export const migrate = (args: MigrationProps) =>
  getMysqlConnection(args.connection).then((connection) =>
    Promise.all(
      IDS.map((id) => insertRevenueFromStripe({ id, connection: connection }))
    )
  );

export const revert = () => {
  return Promise.resolve();
};
