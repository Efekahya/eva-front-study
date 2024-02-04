"use server";

import { GetSkuRefundRate } from "@/generated/types";
import { client } from "./client";

export interface ExtendedSaleData {
  item: {
    skuList: {
      refundRate?: number;
      sku?: string;
      productName?: string;
      qty?: number;
      shippingAmount?: number;
      amount?: number;
      refundPercantage?: number;
      qty2?: number;
      amount2?: number;
    }[];
    selectedDate?: string;
    TotalSale?: number;
    selectedDate2?: string;
    TotalSale2?: number;
  };
  Currency?: string;
}

type TableData = (
  selectedCategories: number[],
  categories: Highcharts.XAxisOptions["categories"],
  sellerId: string,
  marketplaceName: string,
  offset: number,
  requestedDays: number
) => Promise<ExtendedSaleData>;

const getTableData: TableData = async (
  selectedCategories: number[],
  categories: Highcharts.XAxisOptions["categories"],
  sellerId: string,
  marketplaceName: string,
  offset: number,
  requestedDays: number
) => {
  const { getDailySaleDetails, getSkuRefundRate } = client();

  const date1 = categories?.[selectedCategories[0]] ?? "";
  const date2 = categories?.[selectedCategories[1]] ?? "";

  const saleData =
    (await getDailySaleDetails({
      isDaysCompare: selectedCategories.length === 1 ? 0 : 1,
      pageNumber: offset,
      sellerId,
      marketplace: marketplaceName,
      salesDate: date1 ?? "",
      salesDate2: date2 ?? "",
    })) ?? {};

  const refundData = (await getSkuRefundRate({
    sellerId,
    marketplace: marketplaceName,
    skuList: saleData?.item?.skuList?.map((sku) => sku.sku ?? "") ?? [],
    requestedDay: requestedDays,
  })) as NonNullable<GetSkuRefundRate["Data"]>["item"];

  const saleDataWithRefundRate =
    saleData?.item?.skuList?.map((sku) => {
      const refundRate = refundData?.find((refund) => refund.sku === sku.sku);

      return {
        ...sku,
        refundRate: refundRate?.refundRate,
      };
    }) ?? [];

  const newSaleData = {
    ...saleData,
    item: {
      ...saleData?.item,
      skuList: saleDataWithRefundRate,
    },
  };
  return newSaleData;
};

export default getTableData;
