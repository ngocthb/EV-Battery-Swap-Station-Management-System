import { QueryParams } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  data: unknown[];
  query: QueryParams;
  onUpdateQuery: (
    newQuery: Partial<
      Record<string, string | number | boolean | null | undefined>
    >
  ) => void;
  loading: boolean;
}
function PaginationTable({
  data,
  query,
  onUpdateQuery,
  loading,
}: PaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          Hiển thị{" "}
          <span className="font-medium">
            {Array.isArray(data) ? data.length : 0}
          </span>{" "}
          tủ trên trang {query.page}
        </div>
        <div className="text-sm text-gray-500">({query.limit} tủ/trang)</div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() =>
            onUpdateQuery({ page: Math.max(1, (query.page as number) - 1) })
          }
          disabled={(query.page as number) <= 1 || loading}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border ${
            (query.page as number) <= 1 || loading
              ? "text-gray-400 bg-white border-gray-200 cursor-not-allowed"
              : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-500"
          } transition-colors`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Trước
        </button>

        <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
          Trang {query.page}
        </div>

        <button
          onClick={() => onUpdateQuery({ page: (query.page as number) + 1 })}
          disabled={
            loading ||
            (Array.isArray(data) && data.length < (query.limit as number))
          }
          className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border ${
            loading ||
            (Array.isArray(data) && data.length < (query.limit as number))
              ? "text-gray-400 bg-white border-gray-200 cursor-not-allowed"
              : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-500"
          } transition-colors`}
        >
          Sau
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

export default PaginationTable;
