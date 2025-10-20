import { Search, X } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

type FilterBarProps = {
  query: {
    search?: string;
    page?: number;
    limit?: number;
    order?: string;
    status?: boolean;
    [key: string]: string | number | boolean | null | undefined;
  };
  loading: boolean;
  resultCount?: number;
  showStatus?: boolean;
  showOrder?: boolean;
  showStation?: boolean;
  stationList?: { id: number; name: string }[];
  onSearch: (val: string) => void;
  onChangeStatus?: (val: boolean) => void;
  onUpdate: (
    newQuery: Partial<
      Record<string, string | number | boolean | null | undefined>
    >
  ) => void;
  onReset: () => void;
};

export default function AdminFilter({
  query,
  loading,
  resultCount = 0,
  showStatus = true,
  showOrder = true,
  showStation = false,
  stationList = [],
  onSearch,
  onChangeStatus,
  onUpdate,
  onReset,
}: FilterBarProps) {
  const isFiltered =
    query.search ||
    query.page !== 1 ||
    query.limit !== 10 ||
    (showOrder && query.order !== "asc") ||
    (showStation && query.stationId && query.stationId !== 0) ||
    (showStatus && query.status !== true);

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={query.search || ""}
              onChange={(e) => onSearch(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            {query.search && !loading && (
              <button
                onClick={() => onUpdate({ search: "", page: 1 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Optional filters */}
          <div className="flex gap-3">
            {showStatus && (
              <select
                value={String(query.status)}
                onChange={(e) => onChangeStatus?.(e.target.value === "true")}
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 min-w-[120px]"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Ngưng hoạt động</option>
              </select>
            )}

            {showOrder && (
              <select
                value={query.order || "asc"}
                onChange={(e) => onUpdate({ order: e.target.value })}
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 min-w-[120px]"
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            )}

            {showStation && (
              <select
                value={String(query.stationId || "")}
                onChange={(e) =>
                  onUpdate({ stationId: Number(e.target.value) })
                }
                disabled={loading}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 min-w-[100px]"
              >
                <option value="">Tìm theo tên trạm</option>
                {stationList.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            )}

            {/* Items per page */}
            <select
              value={String(query.limit)}
              onChange={(e) =>
                onUpdate({ limit: Number(e.target.value), page: 1 })
              }
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50 min-w-[100px]"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}/trang
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            {loading ? (
              <span className="flex items-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Đang tải...</span>
              </span>
            ) : (
              `Tìm thấy ${resultCount} mục`
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
