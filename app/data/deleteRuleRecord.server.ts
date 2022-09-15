import getMysqlConnection from "fuegojs/utils/mysql";

const deleteRuleRecord = (uuid: string) => {
  return getMysqlConnection()
    .then((con) =>
      con
        .execute(`DELETE FROM rule_conditions WHERE rule_uuid = ?`, [uuid])
        .then(() =>
          con
            .execute(`DELETE FROM rules WHERE uuid = ?`, [uuid])
            .then(() => con.destroy())
        )
    )
    .then(() => ({ success: true }));
};

export default deleteRuleRecord;
