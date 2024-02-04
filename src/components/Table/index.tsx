import { ExtendedSaleData } from "@/utils/getTableData";
import React from "react";
import { formatDate } from "../Chart";
import ChevronDown from "@/assets/icons/ChevronDown";

interface TableData {
  selectedDate: string | null;
  selectedDate2: string | null;
  skuList: ExtendedSaleData["item"]["skuList"];
  internalPage: number;
  lastDays: string;
}

const Table = ({
  selectedDate,
  selectedDate2,
  skuList,
  internalPage,
  lastDays,
}: TableData) => {
  return (
    <table className="w-full text-sm text-left text-gray-500 min-w-[1400px]">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="pl-2">SKU</th>
          <th>Product Name</th>
          <th className="text-end p-2">
            <div>{formatDate(selectedDate ?? "")}</div>
            <div>Sales / Units</div>
            <div>Average Price</div>
          </th>
          {selectedDate2 && selectedDate2 !== "" && (
            <th className="text-end p-2">
              <div>{formatDate(selectedDate2)}</div>
              <div>Sales / Units</div>
              <div>Average Price</div>
            </th>
          )}
          {selectedDate2 && selectedDate2 !== "" && <th></th>}
          <th className="text-end pr-2">
            <div>SKU Refund Rate </div>
            <div>(Last {lastDays} days)</div>
          </th>
        </tr>
      </thead>
      <tbody className="px-4">
        {skuList
          ?.slice((internalPage - 1) * 10, internalPage * 10)
          .map(
            ({ sku, productName, amount, amount2, qty, qty2, refundRate }) => (
              <tr
                className="odd:bg-white even:bg-gray-50  border-b px-4"
                key={sku}
              >
                <td className="pl-2">{sku}</td>
                <td>{productName}</td>
                <td className="text-green-600 text-end p-2">
                  <div>
                    ${amount} / {qty}
                  </div>
                  <div>${((amount ?? 0) / (qty ?? 1)).toFixed(2)}</div>
                </td>
                {selectedDate2 && selectedDate2 !== "" && (
                  <td className="text-blue-400 text-end p-2">
                    <div>
                      ${amount2} / {qty2}
                    </div>
                    <div>${((amount2 ?? 0) / (qty2 ?? 1)).toFixed(2)}</div>
                  </td>
                )}
                {selectedDate2 && selectedDate2 !== "" && (
                  <td className="text-start px-4">
                    <ChevronDown
                      width={14}
                      height={14}
                      className={
                        (amount ?? 0) / (qty ?? 1) <
                        (amount2 ?? 0) / (qty2 ?? 1)
                          ? "transform rotate-180 fill-green-500"
                          : " fill-red-500"
                      }
                    />
                  </td>
                )}

                <td className="text-end pr-2">{refundRate}%</td>
              </tr>
            )
          )}
      </tbody>
    </table>
  );
};

export default Table;
