import { client } from "@/utils/client";
import Chart from "../components/Chart";
import Highcharts from "highcharts";

async function getParsedDailySales(
  range: 60 | 30 | 14 | 7,
  marketplaceName: string,
  storeId: string
) {
  "use server";
  const { getDailySales } = client();

  const sales = await getDailySales({
    day: range,
    marketplace: marketplaceName,
    sellerId: storeId,
  });
  const latestRemovedSales = sales?.item?.slice(0, -1);

  const items = latestRemovedSales?.map(
    ({ profit, date, fbaAmount, fbmAmount, fbaShippingAmount }) => ({
      profit,
      date,
      fbaAmount,
      fbmAmount,
      fbaShippingAmount,
    })
  );

  return items;
}

export default async function Home({
  searchParams: { range },
}: Readonly<{
  searchParams: { range?: 60 | 30 | 14 | 7 };
}>) {
  const { login, getUser } = client();

  // TODO: Add some kind of logic to get the user's credentials
  await login({
    Email: process.env.USERNAME,
    Password: process.env.PASSWORD,
  });

  const userResponse = await getUser({ email: process.env.USERNAME });

  const marketplaceName = userResponse?.user?.store?.[0].marketplaceName;
  const storeId = userResponse?.user?.store?.[0].storeId;

  const calculatedRange = (
    [60, 30, 14, 7].includes(Number(range)) ? Number(range) : 7
  ) as 60 | 30 | 14 | 7;

  const items = await getParsedDailySales(
    calculatedRange,
    marketplaceName ?? "",
    storeId ?? ""
  );

  const series: Highcharts.Options["series"] = [
    {
      name: "Profit",
      data: items?.map(({ profit }) => profit),
      type: "column" as "networkgraph", // This is a bug in the type definition
    },
    {
      name: "FBA Sales",
      data: items?.map(({ fbaAmount }) => fbaAmount),
      type: "column" as "networkgraph",
    },
    {
      name: "FBM Sales",
      data: items?.map(({ fbmAmount }) => fbmAmount),
      type: "column" as "networkgraph",
    },
  ];

  return (
    <div className="overflow-auto">
      <Chart
        items={items ?? []}
        series={series}
        sellerId={storeId ?? ""}
        marketplaceName={marketplaceName ?? ""}
      />
    </div>
  );
}
