"use client";
import Highcharts from "highcharts";
import dynamic from "next/dynamic";
const HighchartsReact = dynamic(() => import("highcharts-react-official"), {
  ssr: false,
});
import ChevronDown from "../../assets/icons/ChevronDown";

import React, { useEffect } from "react";
import Dropdown from "../Dropdown";
import { useRouter, useSearchParams } from "next/navigation";
import getTableData, { ExtendedSaleData } from "@/utils/getTableData";
import Table from "../Table";

/**
 * @param date - YYYY-MM-DD
 * @returns Date in the format: Monday, 1-30-2021
 */
export const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = `${day}, ${
    d.getMonth() + 1
  }-${d.getDate()}-${d.getFullYear()}`;
  return formattedDate;
};

interface Item {
  profit: number | undefined;
  date: string | undefined;
  fbaAmount: number | undefined;
  fbmAmount: number | undefined;
  fbaShippingAmount: number | undefined;
}

interface ChartProps {
  sellerId: string;
  marketplaceName: string;
  items: Item[];
  series: Highcharts.SeriesOptionsType[];
}

const Chart = ({ sellerId, marketplaceName, items, series }: ChartProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = React.useState<number[]>([]);
  const [tableLoading, setTableLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [internalPage, setInternalPage] = React.useState(1);

  const [tableData, setTableData] = React.useState<ExtendedSaleData>();

  const onChangeSelectedDate = (value: string) => {
    router.push(`?range=${value}`);
  };

  const selectedCategoryHandler = (arr: number[], index: number) => {
    if (arr.includes(index)) {
      const filtered = arr.filter((item) => item !== index);
      if (filtered.length === 0) return;
      return filtered;
    } else if (arr.length === 2) {
      return [arr.slice(-1)[0], index];
    } else {
      return [...arr, index];
    }
  };

  const handleCategoryClick = async (index: number) => {
    let temp: number[] = [];
    setSelectedCategory((prev) => {
      temp = selectedCategoryHandler(prev, index) ?? [];
      return temp;
    });
  };

  useEffect(() => {
    async function fetchData() {
      setTableLoading(true);
      const data = await getTableData(
        selectedCategory ?? [],
        items.map((item) => item.date ?? ""),
        sellerId,
        marketplaceName,
        currentPage,
        Number(searchParams.get("range") ?? "7")
      );
      setTableLoading(false);
      setTableData(data);
    }
    fetchData();
  }, [
    currentPage,
    items,
    marketplaceName,
    sellerId,
    searchParams,
    selectedCategory,
  ]);

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: "Daily Sales",
      align: "left",
    },
    series: series,
    plotOptions: {
      column: {
        stacking: "normal",
      },
      series: {
        point: {
          events: {
            click: function () {
              const { index } = this as any;
              handleCategoryClick(index);
            },
          },
        },
      },
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: "Amount ($)",
      },
    },
    tooltip: {
      formatter: function () {
        const categoryIndex = this.point.x;
        const item = items[categoryIndex];
        return `Total Sales: ${
          (item.fbaAmount ?? 0) + (item.fbmAmount ?? 0)
        } <br>Shipping: ${item.fbaShippingAmount} <br>Profit: ${
          item.profit
        } <br>FBA Sales: ${item.fbaAmount} <br>FBM Sales: ${item.fbmAmount}`;
      },
    },

    xAxis: {
      categories: items.map((item) => formatDate(item.date ?? "") ?? ""),
      plotBands: selectedCategory
        ? selectedCategory.map((category, index) => ({
            from: category - 0.5,
            to: category + 0.5,
            color: `rgba(68, 170, ${255 * index}, 0.1)`,
          }))
        : [],
      labels: {
        rotation: -45,
      },
      scrollbar: {
        enabled: true,
      },
    },
  };

  const handleNextClick = () => {
    if (internalPage % 3 === 0) {
      setCurrentPage(currentPage + 1);
    }
    setInternalPage(internalPage + 1);
  };

  const handlePrevClick = () => {
    if (internalPage % 3 === 1) {
      setCurrentPage(currentPage - 1);
    }
    setInternalPage(internalPage - 1);
  };

  return (
    <>
      {tableLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center w-full h-full z-10">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="min-w-[768px] relative">
        <HighchartsReact highcharts={Highcharts} options={options} />

        {tableData && tableData.item.selectedDate !== "" && (
          <div className="relative overflow-x-auto shadow-md ">
            <Table
              selectedDate={tableData.item.selectedDate ?? ""}
              selectedDate2={tableData.item.selectedDate2 ?? ""}
              skuList={tableData.item.skuList}
              internalPage={internalPage}
              lastDays={searchParams.get("range") ?? "7"}
            />

            <div className="flex justify-end gap-2 p-4 bg-white">
              <button
                onClick={handlePrevClick}
                className="text-gray-500 disabled:opacity-50"
                disabled={internalPage === 1}
              >
                Previous
              </button>
              <div className="text-gray-500">{internalPage}</div>

              <button
                onClick={handleNextClick}
                className="text-gray-500 disabled:opacity-50"
                disabled={
                  tableData.item.skuList?.length < internalPage * 10 ||
                  tableData.item.skuList?.length === 0
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Dropdown
            data={["60", "30", "14", "7"]}
            onSelect={onChangeSelectedDate}
          >
            Last {searchParams.get("range") ?? "7"} days
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default Chart;
