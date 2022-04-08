import React from "react";
import { Area, AreaChart, Tooltip, XAxis, YAxis } from "recharts";
import { LoaderFunction, useLoaderData } from "remix";
import listRevenue from "~/data/listRevenue.server";

const defaultColorScheme = [
  "#0f83ab",
  "#faa43a",
  "#ff4e4e",
  "#53cfc9",
  "#a2d925",
  "#decf3f",
  "#734fe9",
  "#cd82ad",
  "#006d92",
  "#de7c00",
  "#f33232",
  "#3f9a80",
  "#53c200",
  "#d7af00",
  "#4c26c9",
  "#d44d99",
];

const RevenuePage = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof listRevenue>>>();
  const revenueByDateByProduct: Record<string, Record<string, number>> = {};
  data.values.forEach(({ date, amount, product }) => {
    const month = `${new Date(date).getFullYear()}/${
      new Date(date).getMonth() + 1
    }`;
    if (revenueByDateByProduct[product]) {
      if (revenueByDateByProduct[product][month]) {
        revenueByDateByProduct[product][month] += amount;
      } else {
        revenueByDateByProduct[product][month] = amount;
      }
    } else {
      revenueByDateByProduct[product] = { [month]: amount };
    }
  });
  const chartData = Object.entries(revenueByDateByProduct).flatMap(
    ([product, revenue]) =>
      Object.entries(revenue).map(([month, amount]) => ({
        month,
        amount: amount / 100,
        product,
      }))
  );
  return (
    <AreaChart
      width={900}
      height={500}
      data={chartData}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <XAxis dataKey="month" />
      <YAxis />
      {Object.keys(revenueByDateByProduct).map((product, i) => (
        <Area
          key={product}
          dataKey="amount"
          stroke={defaultColorScheme[i]}
          fill={defaultColorScheme[i]}
          display={product}
        />
      ))}
      <Tooltip />
    </AreaChart>
  );
};

export const loader: LoaderFunction = () => {
  return listRevenue();
};

export default RevenuePage;
