export interface GeocodingResult {
  lat: number;
  lng: number;
  formatted_address?: string;
}

export const geocodeAddress = async (
  address: string
): Promise<GeocodingResult | null> => {
  if (!address || address.trim().length < 5) {
    return null;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1&countrycodes=vn`
    );

    if (!response.ok) {
      throw new Error("Geocoding failed");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formatted_address: result.display_name,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// Alternative: Use a mock geocoding for demo purposes
export const mockGeocodeAddress = async (
  address: string
): Promise<GeocodingResult | null> => {
  if (!address || address.trim().length < 5) {
    return null;
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock coordinates for Ho Chi Minh City area
  const mockResults: { [key: string]: GeocodingResult } = {
    "quan 1": { lat: 10.7769, lng: 106.7009 },
    "quan 3": { lat: 10.7829, lng: 106.6934 },
    "quan 7": { lat: 10.7346, lng: 106.7197 },
    "thu duc": { lat: 10.8521, lng: 106.7716 },
    "binh thanh": { lat: 10.8012, lng: 106.7109 },
  };

  const lowerAddress = address.toLowerCase();

  for (const [key, coords] of Object.entries(mockResults)) {
    if (lowerAddress.includes(key)) {
      return coords;
    }
  }

  // Default to a random location in Ho Chi Minh City
  return {
    lat: 10.7769 + (Math.random() - 0.5) * 0.1,
    lng: 106.7009 + (Math.random() - 0.5) * 0.1,
  };
};
