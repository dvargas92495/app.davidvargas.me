import getMysqlConnection from "~/package/backend/mysql.server";

const searchExpenses = () =>
  getMysqlConnection()
    .then((con) =>
      con
        .execute(
          `SELECT date, amount, description, uuid, code 
          FROM expenses 
          ORDER BY date` // LIMIT ?, ?`,
          //[Number(index) * Number(size), size]
        )
        .then((a) => {
          con.destroy();
          return a;
        })
    )
    .then((a) => {
      const values = a as {
        date: Date;
        amount: number;
        product: string;
        uuid: string;
      }[];
      return {
        data: values.map((v) => ({
          ...v,
          date: v.date.toLocaleString(),
          amount: `$${(v.amount / 100).toFixed(2)}`,
        })),
        columns: [
          { Header: "Date", accessor: "date" },
          { Header: "Description", accessor: "description" },
          { Header: "Amount", accessor: "amount" },
          { Header: "Code", accessor: "code" },
        ],
      };
    });

export default searchExpenses;
