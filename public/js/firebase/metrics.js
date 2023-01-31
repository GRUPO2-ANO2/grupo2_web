// Calculates the total elevation gain (difference between the starting and ending altitude)
// of an event.
async function totalElevationGainedByEvent(eventID) {
    return new Promise((resolve, reject) => {
        getReadingsByEventID(eventID).then((readings) => {
            let totalElevation = 0;
            readings.forEach((reading) => {
                totalElevation += reading.altitude;
            });
            resolve(totalElevation);
        }).catch((error) => {
            reject(error);
        });
    });
}

// function to calculate the average o2 level of all readings for a specific event
async function averageO2ByEvent(eventID) {
    return new Promise((resolve, reject) => {
        getReadingsByEventID(eventID).then((readings) => {
            let sum = 0;
            readings.forEach((reading) => {
                sum += reading.o2;
            });
            resolve(sum / readings.length);
        }).catch((error) => {
            reject(error);
        });
    });
}

// function to get the number of events created by a specific guia
async function numEventsOwnedByGuia(guiaID) {
    return new Promise((resolve, reject) => {
        getEventsByGuia().then((events) => {
            resolve(events.length);
        }).catch((error) => {
            reject(error);
        });
    });
}

// function to get the number of readings done to a specific user
async function numReadingsOfUser(userID) {
    return new Promise(async (resolve) => {
        const readings = await getReadingsByUserID(userID);
        resolve(readings.length);
    });
}

// function to get the number of readings taken by guia
async function numReadingsByGuia(guiaID) {
    return new Promise(async (resolve, reject) => {
        try {
            const events = await getEventsByGuiaID(guiaID);
            let totalReadings = 0;
            for (const event of events) {
                const eventID = event.id;
                const readings = await getReadingsByEventID(eventID);
                totalReadings += readings.length;
            }
            resolve(totalReadings);
        } catch (error) {
            reject(error);
        }
    });
}

// function to get average altitude in every reading from a specific event
async function averageAltitudeByEvent(eventID) {
    return new Promise((resolve, reject) => {
        getReadingsByEventID(eventID).then((readings) => {
            let totalAltitude = 0;
            readings.forEach((reading) => {
                totalAltitude += reading.altitude;
            });
            let averageAltitude = totalAltitude / readings.length;
            resolve(averageAltitude);
        }).catch((error) => {
            reject(error);
        });
    });
}

// Calculates the average duration of events owned by a specific guia.
async function averageDurationOfEventsByGuia(guiaID) {
    return new Promise(async (resolve, reject) => {
        try {
            const events = await getEventsByGuiaID(guiaID);
            let totalDuration = 0;
            let eventCount = 0;
            events.forEach((event) => {
                totalDuration += event.dateFinish - event.dateStart;
                eventCount++;
            });
            resolve(totalDuration / eventCount);
        } catch (error) {
            reject(error);
        }
    });
}

// Gets the number of users who have taken readings in a specific event.
async function numUsersParticipatingInEvent(eventID) {
    return new Promise(async (resolve) => {
        var userCount = 0;
        const querySnapshot = await firebase.firestore().collection("leituras").where("idEvento", "==", eventID).get();
        for (const doc of querySnapshot.docs) {
            userCount++;
        }
        resolve(userCount);
    });
}

// Calculates the average height of users participating in a specific event.
async function averageHeightOfUsersInEvent(eventID) {
    return 0;
}

// Calculates the average weight of users participating in a specific event.
async function averageWeightOfUsersInEvent(eventID) {
    return 0;
}