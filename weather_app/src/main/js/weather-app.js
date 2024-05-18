const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    console.error(`Error Code: ${error.code}, Error Message: ${error.message}`);
                    reject(error);
                }
            );
        } else {
            const errorMessage = "Geolocation API is not available in this browser.";
            console.error(errorMessage);
            reject(new Error(errorMessage));
        }
    });
};

getUserLocation()
    .then((coords) => {
        console.log(`Latitude: ${coords.latitude}, Longitude: ${coords.longitude}`);
    })
    .catch((error) => {
        console.error(`Failed to get user location: ${error.message}`);
    });
