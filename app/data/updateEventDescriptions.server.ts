import getMysqlConnection from "fuegojs/utils/mysql";

const updateRevenueProducts = (args: {
  data: Record<string, string[]>;
  searchParams: Record<string, string>;
}) => {
  const description = args.searchParams.description;
  const newDescription = args.data.newDescription?.[0];
  if (!description) throw new Error(`Must filter by an existing description.`);
  if (!newDescription)
    throw new Error(`Must list a new description to update to.`);
  return getMysqlConnection().then((con) =>
    con
      .execute(
        `UPDATE events 
          SET description = ?
          WHERE description = ?`,
        [newDescription, description]
      )
      .then(() => {
        con.destroy();
        return {
          success: true,
        };
      })
  );
};

export default updateRevenueProducts;
