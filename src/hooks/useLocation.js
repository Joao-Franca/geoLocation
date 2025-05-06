import * as Location from "expo-location";
import { useEffect, useState } from "react";

// Função para remover acentos de uma string
const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export default function useLocation() {
  const [coords, setCoords] = useState(null);
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
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  // geocodifica string de endereço
  const geocodeAddress = async (address) => {
    try {
      // Normaliza o endereço removendo acentos e caracteres especiais
      const normalizedAddress = removeAccents(address);
      const result = await Location.geocodeAsync(normalizedAddress);

      if (!result || result.length === 0) {
        // Tenta novamente com o endereço original se a versão sem acentos falhar
        const fallbackResult = await Location.geocodeAsync(address);
        return fallbackResult || [];
      }

      return result;
    } catch (err) {
      throw new Error("Erro na geocodificação: " + err.message);
    }
  };

  return { coords, errorMsg, geocodeAddress };
}
