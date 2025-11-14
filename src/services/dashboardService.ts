import api from "@/lib/axios";

export const getDashboardUserCountAPI = async () => {
  const res = await api.get("/dashboard/user-count");
  return res.data;
};
export const getDashboardStationCountAPI = async () => {
  const res = await api.get("/dashboard/station-count");
  return res.data;
};

export const getDashboardTopStationBookingAPI = async () => {
  const res = await api.get("/dashboard/top-stations");
  return res.data;
};

export const getDashboardTopStationRatingAPI = async () => {
  const res = await api.get("/dashboard/top-avg-rating-stations");
  return res.data;
};

export const getDashboardActiveMembershipByMonthCountAPI = async <T>(
  params: T
) => {
  const res = await api.get("/dashboard/active-user-membership-count", {
    params,
  });
  return res.data;
};

export const getDashboardBookingCompleteByMonthCountAPI = async <T>(
  params: T
) => {
  const res = await api.get("/dashboard/active-booking-count", {
    params,
  });
  return res.data;
};

export const getDashboardRevenueChartAPI = async <T>(params: T) => {
  const res = await api.get("/dashboard/revenue-chart", {
    params,
  });
  return res.data;
};

export const getDashboardTransactionChartAPI = async <T>(params: T) => {
  const res = await api.get("/dashboard/transaction-chart", {
    params,
  });
  return res.data;
};

export const getDashboardUserMembershipChartAPI = async <T>(params: T) => {
  const res = await api.get("/dashboard/user-membership", {
    params,
  });
  return res.data;
};
