import axios from "@/lib/axios";

export const getCabinetsByStationId = async (stationId: number) => {
  try {
    const response = await axios.get(`cabinet`, {
      params: { stationId },
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching cabinets:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, message: errorMessage };
  }
};
