export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve({latitude, longitude});
                },
                (error) => {
                    console.error(`Error Code: ${error.code}, Error Message: ${error.message}`);
                    reject(error);
                }
            );
        } else {
            resolve({latitude: 47.54, longitude: 7.64});
        }
    });
}