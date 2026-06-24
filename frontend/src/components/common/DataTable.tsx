/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  id?: string;
}

export function DataTable<T extends { id?: string }>({ columns, data, emptyMessage = "No data available.", id }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400 font-semibold" id={id}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs" id={id}>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col, idx) => (
                <th key={idx} className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, rowIdx) => (
              <tr key={(item as any).id || rowIdx} className="hover:bg-slate-50/50 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-4 py-3 text-xs">
                    {col.accessor(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
