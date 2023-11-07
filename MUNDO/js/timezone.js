export
    async function getCoordinatesFromTimezone(timezone) {
        try {
            const baseURL = "https://nominatim.openstreetmap.org/search";
            const format = "json";
            const query = `timezone:${encodeURIComponent(timezone)}`;
            const limit = 1; // Limita a una única coincidencia
            const url = `${baseURL}?format=${format}&q=${query}&limit=${limit}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.length > 0) {
                const latitude = parseFloat(data[0].lat);
                const longitude = parseFloat(data[0].lon);
                return { latitude, longitude };
            } else {
                throw new Error("No se encontraron coordenadas para la zona horaria especificada.");
            }
        } catch (error) {
            console.error("Error al obtener coordenadas:", error);
            return null;
        }
    };

///< @todo: incorporar o eliminar la siguiente función:
/*timezoneSelector.addEventListener("change", async () => {
    const selectedTimezone = timezoneSelector.value;
    const coordinates = await getCoordinatesFromTimezone(selectedTimezone);
  
    if (coordinates) {
        moveGlobeToCoordinates(sphere, coordinates.latitude, coordinates.longitude);
        const currentTime = getCurrentTimeInTimezone(selectedTimezone);
        updateClock(clock, currentTime);
    }
});*/
      