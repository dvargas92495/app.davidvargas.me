import React, { useMemo } from "react";
import { Chart, ChartOptions } from "react-charts";
import { LoaderFunction, useLoaderData } from "remix";
import listRevenue from "~/data/listRevenue.server";

// TODO split out "this month" into its own bar graph
const RevenuePage = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof listRevenue>>>();
  const revenueByDateByProduct: Record<string, Record<string, number>> = {};
  const months = new Set<string>();
  data.values.forEach(({ date, amount, product }) => {
    const month = `${new Date(date).getFullYear()}/${(
      new Date(date).getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
    months.add(month);
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
  const chartData = Object.entries(revenueByDateByProduct).map(
    ([label, revenue]) => ({
      label,
      data: Array.from(months)
        .sort()
        .map((month) => ({
          month,
          amount: (revenue[month] || 0) / 100,
        })),
    })
  );
  const chartOptions = useMemo<
    Omit<ChartOptions<typeof chartData[number]["data"][number]>, "data">
  >(
    () => ({
      primaryAxis: { getValue: (data) => data.month },
      secondaryAxes: [{ getValue: (data) => data.amount, elementType: "area" }],
    }),
    []
  );
  return (
    <Chart
      options={{
        data: chartData,
        ...chartOptions,
      }}
    ></Chart>
  );
};

export const loader: LoaderFunction = () => {
  return listRevenue();
};

export default RevenuePage;
