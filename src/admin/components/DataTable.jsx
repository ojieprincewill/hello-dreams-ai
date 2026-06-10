import React from "react";
import AdminCard from "./primitives/AdminCard";

const DataTable = ({ columns, data, emptyMessage = "No data found" }) => (
  <AdminCard padding="p-0" className="overflow-hidden">
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left" style={{ fontFamily: "Inter, sans-serif" }}>
        <thead>
          <tr className="border-b border-[#eaecf0] dark:border-[#2d2d2d] bg-[#efefef] dark:bg-[#2d2d2d]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-[12px] font-semibold text-[#667085] dark:text-[#aaa] uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!data?.length ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[#999] text-[14px]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-b border-[#eaecf0] dark:border-[#2d2d2d] hover:bg-[#f0f0f0] dark:hover:bg-[#252525] transition-colors duration-200"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-[14px] text-[#010413] dark:text-[#f7f7f7]"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </AdminCard>
);

export default DataTable;
