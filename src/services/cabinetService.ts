import axios from "@/lib/axios";

export const getCabinetsByStationId = async (stationId: number) => {
  try {
    const response = await axios.get(`cabinet`, {
      params: { stationId },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cabinets:", error);
    return { success: false, message: error.message };
  }
};
