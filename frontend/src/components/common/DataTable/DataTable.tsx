import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileSpreadsheet,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

export interface ColumnDef {
  header: string;
  accessorKey?: string;
  cell?: (row: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  readonly title: string;
  readonly subtitle: string;
  readonly ButtonNewText: string;
  readonly data: any[];
  readonly columns: ColumnDef[];
  readonly searchFields: string[];
  readonly idKey: string;
  readonly isLoading: boolean;
  readonly handleExportCSV: () => void;
  readonly openModalNew: () => void;
  readonly openModalEdit: (payload: any) => void;
  readonly removeItem: (id: string | number) => void;
}

export default function DataTable({
  title,
  subtitle,
  ButtonNewText,
  data,
  columns,
  searchFields,
  idKey,
  isLoading,
  handleExportCSV,
  openModalNew,
  openModalEdit,
  removeItem,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;

    return data.filter((item) =>
      searchFields.some((field) =>
        String(item[field] || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm, searchFields]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, rowsPerPage, filteredData]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
          {title}
        </h2>
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded font-bold text-[10px] tracking-wider uppercase border border-blue-100">
            <Briefcase className="w-3 h-3" /> {subtitle}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar registro..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleExportCSV}
            title="Exportar CSV"
            className="p-2 border border-green-200 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            onClick={openModalNew}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-colors shadow-md shadow-teal-600/20 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> {ButtonNewText}
          </button>
        </div>
      </div>

      <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Gestión
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="py-8 text-center text-slate-400 text-sm"
                  >
                    Cargando datos...
                  </td>
                </tr>
              ) : currentTableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="py-8 text-center text-slate-400 text-sm"
                  >
                    No se encontraron registros.
                  </td>
                </tr>
              ) : (
                currentTableData.map((row) => (
                  <tr
                    key={row[idKey]}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {columns.map((col, index) => (
                      <td
                        key={index}
                        className={`py-4 px-6 text-sm text-slate-500 ${col.className || ""}`}
                      >
                        {col.cell
                          ? col.cell(row)
                          : row[col.accessorKey as string]}
                      </td>
                    ))}

                    <td className="py-4 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModalEdit(row)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "¿Seguro que deseas eliminar este registro?",
                              )
                            ) {
                              removeItem(row[idKey]);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600 absolute top-1/2 -translate-y-1/2 right-6 group-hover:opacity-0">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 py-3 px-6 flex items-center justify-between bg-slate-50/50 rounded-b-xl">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span>
              Mostrando{" "}
              {currentTableData.length > 0
                ? (currentPage - 1) * rowsPerPage + 1
                : 0}{" "}
              - {Math.min(currentPage * rowsPerPage, filteredData.length)} de{" "}
              {filteredData.length} registros
            </span>
            <div className="flex items-center gap-2">
              <label>FILAS:</label>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-teal-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 bg-teal-600 text-white font-bold rounded text-sm mx-1 shadow-sm">
              {currentPage}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
