import React, { useMemo, useState } from "react";
import { Chart, ChartOptions } from "react-charts";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import listRevenue from "~/data/listRevenue.server";

const dateToMonth = (d: Date) =>
  `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;

const VIEWS = ["Total", "This Month"] as const;

// TODO split out "this month" into its own bar graph
const RevenuePage = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof listRevenue>>>();
  const thisMonth = useMemo(() => dateToMonth(new Date()), []);
  const { revenueByDateByProduct, monthArray } = useMemo(() => {
    const revenueByDateByProduct: Record<string, Record<string, number>> = {};
    const months = new Set<string>();
    data.values.forEach(({ date, amount, product }) => {
      const month = dateToMonth(new Date(date));
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
    const monthArray = Array.from(months);
    return { revenueByDateByProduct, monthArray };
  }, [data.values]);
  const areaChartData = Object.entries(revenueByDateByProduct).map(
    ([label, revenue]) => {
      return {
        label,
        data: monthArray
          .sort()
          .slice(0, -1)
          .map((month) => ({
            month,
            amount: (revenue[month] || 0) / 100,
          })),
      };
    }
  );
  const areaChartOptions = useMemo<
    Omit<ChartOptions<typeof areaChartData[number]["data"][number]>, "data">
  >(
    () => ({
      primaryAxis: { getValue: (data) => data.month },
      secondaryAxes: [{ getValue: (data) => data.amount, elementType: "area" }],
    }),
    []
  );
  const barChartData = Object.entries(revenueByDateByProduct).map(
    ([label, revenue]) => ({
      label,
      data: [
        {
          month: thisMonth,
          amount: (revenue[thisMonth] || 0) / 100,
        },
      ],
    })
  );
  const barChartOptions = useMemo<
    Omit<ChartOptions<typeof areaChartData[number]["data"][number]>, "data">
  >(
    () => ({
      primaryAxis: { getValue: (data) => data.month },
      secondaryAxes: [{ getValue: (data) => data.amount, elementType: "bar" }],
    }),
    []
  );
  const [view, setView] = useState<typeof VIEWS[number]>("Total");
  const Charts: Record<typeof VIEWS[number], React.ReactElement> = {
    Total: (
      <Chart
        options={{
          data: areaChartData,
          ...areaChartOptions,
        }}
      />
    ),
    "This Month": (
      <Chart
        options={{
          data: barChartData,
          ...barChartOptions,
        }}
      />
    ),
  };
  return (
    <>
      <div className="absolute top-3 right-3 p-4 bg-gray-100 rounded-md z-50 w-40">
        <h1 className={"font-semibold text-xl mb-2"}>View</h1>
        {VIEWS.map((v) => (
          <label className="block">
            <input
              type={"radio"}
              name={"view"}
              value={v}
              className="mr-4"
              checked={v === view}
              onChange={(e) => e.target.checked && setView(v)}
            />
            {v}
          </label>
        ))}
      </div>
      {Charts[view]}
    </>
  );
};

export const loader: LoaderFunction = () => {
  return listRevenue();
};

export default RevenuePage;
