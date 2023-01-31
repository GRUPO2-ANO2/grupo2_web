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
    return 0;
}

// function to get the number of events created by a specific guia
async function numEventsOwnedByGuia(guiaID) {
    return 0;
}

// function to get the number of readings done to a specific user
async function numReadingsOfUser(userID) {
    return 0;
}

// function to get the number of readings taken by guia
async function numReadingsByGuiaInEvent(guiaID) {
    return 0;
}

// function to get the number of readings taken by guia for a specific event
async function numReadingsByGuiaInEvent(guiaID, eventID) {
    return 0;
}

// function to get average altitude in every reading from a specific event
async function averageAltitudeByEvent(eventID) {
    return 0;
}

// Calculates the average duration of events owned by a specific guia.
async function averageDurationOfEventsByGuia(guiaID) {
    return 0;
}

// Gets the number of users who have taken readings in a specific event.
async function numUsersParticipatingInEvent(eventID) {
    return 0;
}

// Calculates the average height of users participating in a specific event.
async function averageHeightOfUsersInEvent(eventID) {
    return 0;
}

// Calculates the average weight of users participating in a specific event.
async function averageWeightOfUsersInEvent(eventID) {
    return 0;
}