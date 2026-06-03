import {
  AlertTriangle,
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
  readonly onDelete: (row: any) => void;
  readonly actions?: (row: any) => React.ReactNode;
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
  onDelete,
  actions,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    row: any | null;
  }>({
    isOpen: false,
    row: null,
  });

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

  const triggerDelete = (row: any) => {
    setDeleteConfirm({ isOpen: true, row });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.row) {
      onDelete(deleteConfirm.row);
    }
    setDeleteConfirm({ isOpen: false, row: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, row: null });
  };

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
            type="button"
            onClick={handleExportCSV}
            title="Exportar CSV"
            className="p-2 border border-green-200 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={openModalNew}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-colors shadow-md shadow-teal-600/20 text-sm whitespace-nowrap cursor-pointer"
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
                {!actions && (
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Gestión
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={actions ? columns.length : columns.length + 1}
                    className="py-8 text-center text-slate-400 text-sm"
                  >
                    Cargando datos...
                  </td>
                </tr>
              ) : currentTableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={actions ? columns.length : columns.length + 1}
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
                      {actions ? (
                        <div className="flex items-center justify-end gap-2 relative z-10">
                          {actions(row)}
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                            <button
                              type="button"
                              onClick={() => openModalEdit(row)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4 pointer-events-none" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerDelete(row);
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4 pointer-events-none" />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="text-slate-400 hover:text-slate-600 absolute top-1/2 -translate-y-1/2 right-6 group-hover:opacity-0 group-hover:pointer-events-none cursor-pointer transition-opacity"
                          >
                            <MoreVertical className="w-5 h-5 pointer-events-none" />
                          </button>
                        </>
                      )}
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
                className="bg-white border border-slate-300 rounded px-2 py-1 outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4 pointer-events-none" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 pointer-events-none" />
            </button>
            <div className="px-3 py-1 bg-teal-600 text-white font-bold rounded text-sm mx-1 shadow-sm">
              {currentPage}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 pointer-events-none" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 border border-slate-200 bg-white rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4 pointer-events-none" />
            </button>
          </div>
        </div>
      </div>

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 animate-slide-up text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase mb-2">
              Confirmar Eliminación
            </h3>
            <p className="text-sm text-slate-500 mb-6 font-medium">
              ¿Estás seguro de que deseas eliminar este registro? Esta acción es
              permanente y no se puede deshacer.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer w-full"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-red-600/20 cursor-pointer w-full"
              >
                CONFIRMAR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
