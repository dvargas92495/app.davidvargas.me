import type { MigrationProps } from "fuegojs/types";
import getMysqlConnection from "fuegojs/utils/mysql";

export const migrate = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then((cxn) =>
    Promise.all([
      cxn.execute(
        `UPDATE revenue SET source = "ethereum" WHERE source = "etherscan"`
      ),
      cxn.execute(
        `UPDATE revenue SET source = "ethereum" WHERE source = "etherscan"`
      ),
      cxn.execute(
        `UPDATE revenue SET source = "ethereum" WHERE source = "etherscan"`
      ),
    ])
  );
};

export const revert = (args: MigrationProps) => {
  return getMysqlConnection(args.connection).then((cxn) =>
    Promise.all([
      cxn.execute(
        `UPDATE revenue SET source = "etherscan" WHERE source = "ethereum"`
      ),
      cxn.execute(
        `UPDATE revenue SET source = "etherscan" WHERE source = "ethereum"`
      ),
      cxn.execute(
        `UPDATE revenue SET source = "etherscan" WHERE source = "ethereum"`
      ),
    ])
  );
};
