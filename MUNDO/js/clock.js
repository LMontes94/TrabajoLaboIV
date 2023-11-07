export
    function updateClock(latitude, longitude) {
        const clockElement = document.getElementById("clock");
    
        try {
            const url = `https://worldtimeapi.org/api/timezone?lat=${latitude}&lng=${longitude}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.utc_offset) {
                        const utcOffset = data.utc_offset;
                        const localTime = new Date(new Date().getTime() + utcOffset * 1000);
                        const hours = localTime.getUTCHours().toString().padStart(2, '0');
                        const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
                        const seconds = localTime.getUTCSeconds().toString().padStart(2, '0');
                        const timeString = `${hours}:${minutes}:${seconds}`;
                        clockElement.textContent = timeString;
                    } else {
                        throw new Error("Error al obtener la hora local.");
                    }
                })
                .catch(error => {
                    console.error("Error al obtener la hora local:", error);
                });
        } catch (error) {
            console.error("Error al obtener la hora local:", error);
            // Puedes mostrar un mensaje de error en el reloj o realizar alguna otra acción en caso de error
        }
    };