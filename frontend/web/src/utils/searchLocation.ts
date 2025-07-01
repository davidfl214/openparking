export async function searchLocation( location: string ) {
    const encodedLocation = encodeURIComponent( location );
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&addressdetails=1&limit=1`

    try {
        const response = await fetch( url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if ( !response.ok ) {
            throw new Error( `Error fetching location: ${response.statusText}` );
        }

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                latitude: parseFloat( data[0].lat ),
                longitude: parseFloat( data[0].lon ),
            };
        } else {
            return {
                latitude: null,
                longitude: null,
            }
        }
    } catch ( error ) {
        return {
            latitude: null,
            longitude: null,
        };
    }
}