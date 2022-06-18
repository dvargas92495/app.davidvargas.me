import getMysqlConnection from "~/package/backend/mysql.server";

const updateRevenueProducts = (args: {
  data: Record<string, string[]>;
  searchParams: Record<string, string>;
}) => {
  const product = args.searchParams.product;
  const newProduct = args.data.newProduct?.[0];
  if (!product) throw new Error(`Must filter by an existing product.`);
  if (!newProduct) throw new Error(`Must list a new product to update to.`);
  return getMysqlConnection().then((con) =>
    con
      .execute(
        `UPDATE revenue 
          SET product = ?
          WHERE product = ?`,
        [newProduct, product]
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
