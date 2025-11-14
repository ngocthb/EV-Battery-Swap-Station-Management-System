import React from "react";
import { Membership } from "@/types/index";

interface MembershipCardProps {
  membership: Membership;
  onSelect: (id: number) => void;
  isLoading?: boolean;
  isSelected?: boolean;
  currentMembership?: Membership | null;
  isCurrentPlan?: boolean;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  membership,
  onSelect,
  isLoading = false,
  isSelected = false,
  currentMembership = null,
  isCurrentPlan = false,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const isPopular = membership.name === "Premium";

  // Determine membership hierarchy (lower number = lower tier)
  const getMembershipTier = (name: string): number => {
    const tiers: { [key: string]: number } = {
      Basic: 1,
      Premium: 2,
      VIP: 3,
      Vip: 3,
    };
    return tiers[name] || 0;
  };

  // Check if this is an upgrade, downgrade, or new subscription
  const getButtonState = () => {
    if (!currentMembership) {
      return {
        text: "Chọn gói này",
        disabled: false,
        isUpgrade: false,
        isDowngrade: false,
      };
    }

    if (isCurrentPlan) {
      return {
        text: "Gói hiện tại",
        disabled: true,
        isUpgrade: false,
        isDowngrade: false,
      };
    }

    const currentTier = getMembershipTier(currentMembership.name);
    const targetTier = getMembershipTier(membership.name);

    if (targetTier > currentTier) {
      return {
        text: "Nâng cấp gói",
        disabled: false,
        isUpgrade: true,
        isDowngrade: false,
      };
    } else {
      return {
        text: "Không thể hạ cấp",
        disabled: true,
        isUpgrade: false,
        isDowngrade: true,
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div
      className={`relative rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-xl ${
        isPopular
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-white"
          : "border-gray-200 bg-white hover:border-blue-300"
      } ${isSelected ? "ring-4 ring-blue-400" : ""} ${
        isCurrentPlan ? "ring-2 ring-green-500" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
          <span className="rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white shadow-lg">
            Phổ biến nhất
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white shadow-lg">
            Đang sử dụng
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="mb-2 text-2xl font-bold text-gray-900">
          {membership.name}
        </h3>
        <p className="mb-6 text-sm text-gray-600">{membership.description}</p>

        <div className="mb-8">
          <span className="text-5xl font-extrabold text-gray-900">
            {formatPrice(membership.price || 0)}
          </span>
          <span className="text-gray-600">
            /{membership.duration || 30} ngày
          </span>
        </div>

        <ul className="mb-8 space-y-4 text-left">
          <li className="flex items-start">
            <svg
              className="mr-3 h-6 w-6 flex-shrink-0 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">
              {membership.swapLimit === null ||
              membership.swapLimit === undefined
                ? "Không giới hạn đổi pin"
                : `${membership.swapLimit} lần đổi pin/tháng`}
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="mr-3 h-6 w-6 flex-shrink-0 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">
              Thời hạn {membership.duration || 30} ngày
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="mr-3 h-6 w-6 flex-shrink-0 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">Hỗ trợ 24/7</span>
          </li>
        </ul>

        <button
          onClick={() => onSelect(membership.id)}
          disabled={isLoading || buttonState.disabled}
          className={`w-full rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300 ${
            buttonState.isUpgrade
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
              : isPopular && !buttonState.disabled
              ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
              : buttonState.disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="mr-2 h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </span>
          ) : (
            buttonState.text
          )}
        </button>

        {buttonState.isDowngrade && (
          <p className="mt-2 text-sm text-red-600">
            Chỉ có thể nâng cấp gói, không thể hạ cấp
          </p>
        )}
      </div>
    </div>
  );
};

export default MembershipCard;
