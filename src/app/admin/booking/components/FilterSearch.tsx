import { LoadingSpinner } from "@/components/LoadingSpinner";
import { QueryParams, Station } from "@/types";
import { Search, X } from "lucide-react";

type FilterBarProps = {
  query: QueryParams;
  loading: boolean;
  resultCount?: number;
  onSearch: (val: string) => void;
  onChangeStatus?: (val: string) => void;
  onUpdateQuery: (
    newQuery: Partial<
      Record<string, string | number | boolean | null | undefined>
    >
  ) => void;
  onReset: () => void;
};

function FilterSearch({
  query,
  loading,
  resultCount = 0,
  onSearch,
  onChangeStatus,
  onUpdateQuery,
  onReset,
}: FilterBarProps) {
  const isFiltered =
    query.search ||
    query.page !== 1 ||
    query.limit !== 10 ||
    query.status !== "" ||
    query.order !== "asc";
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên xe..."
              value={query.search}
              onChange={(e) => onSearch(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            {query.search && !loading && (
              <button
                onClick={() => onUpdateQuery({ search: "", page: 1 })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            {/* Status filter */}
            <select
              value={String(query.status)}
              onChange={(e) => onChangeStatus?.(e.target.value)}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 min-w-[120px]"
            >
              <option value="">Trạng thái</option>
              <option value="RESERVED">Đã giữ chỗ</option>
              <option value="PENDING_PAYMENT">Chờ thanh toán</option>
              <option value="IN_PROGRESS">Đang thực hiện</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="EXPIRED">Hết hạn</option>
            </select>
            {/* Sort order */}
            <select
              value={query.order}
              onChange={(e) => onUpdateQuery({ order: e.target.value })}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 min-w-[120px]"
            >
              <option value="ASC">A → Z</option>
              <option value="DESC">Z → A</option>
            </select>

            {/* Items per page */}
            <select
              value={String(query.limit)}
              onChange={(e) =>
                onUpdateQuery({ limit: Number(e.target.value), page: 1 })
              }
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-50 disabled:text-gray-500 min-w-[100px]"
            >
              <option value={5}>5/trang</option>
              <option value={10}>10/trang</option>
              <option value={20}>20/trang</option>
              <option value={50}>50/trang</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            {loading ? (
              <span className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Đang tải...</span>
              </span>
            ) : (
              `Tìm thấy ${resultCount} trạm`
            )}
          </p>
          {isFiltered && !loading && (
            <button
              onClick={onReset}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterSearch;
