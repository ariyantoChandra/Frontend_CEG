const API_BASE_URL = "https://api.cegubaya.com";

const colorMapping = {
  "Kolom Destilasi": "orange",
  "Crystallizer": "blue",
  "Reactor": "purple",
  "Heat Exchanger": "cyan",
  "Boiler": "emerald",
  "Spray Dryer": "rose",
};


export const mapEquipmentData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((item) => {
    const color = colorMapping[item.name] || "blue";
    const imageUrl = item.image_path
      ? `${API_BASE_URL}/${item.image_path}`
      : null;

    return {
      id: item.id,
      name: item.name,
      color,
      description: item.description,
      image: imageUrl,
    };
  });
};
