// src/hooks/useLocation.js
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function useLocation() {
  const [coords, setCoords]     = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // localização atual (opcional)
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão negada para acessar a localização");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude:  loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // geocodifica string de endereço
  const geocodeAddress = async (address) => {
    try {
      const result = await Location.geocodeAsync(address);
      return result;  // array de { latitude, longitude, ... }
    } catch (err) {
      throw new Error("Erro na geocodificação: " + err.message);
    }
  };

  return { coords, errorMsg, geocodeAddress };
}
