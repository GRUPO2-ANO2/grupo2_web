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
async function numReadingsInEvent(eventID) {
    return new Promise(async (resolve) => {
        var readingsCount = 0;
        const querySnapshot = await firebase.firestore().collection("leituras").where("idEvento", "==", eventID).get();
        for (const doc of querySnapshot.docs) {
            readingsCount++;
        }
        resolve(readingsCount);
    });
}

// Calculates the average height of users participating in a specific event.
async function averageHeightOfUsersInEvent(eventID) {
    return new Promise(async (resolve) => {
        var heightSum = 0;
        var numUsers = 0;

        const querySnapshot = await firebase.firestore().collection("eventosUtilizadores").where("idEvento", "==", eventID).get();
        for (const doc of querySnapshot.docs) {
            var user = await getUserById(doc.data().idUtilizador);
            heightSum += user.data().Height;
            numUsers++;
        }

        resolve(heightSum / numUsers);
    });
}

// Calculates the average weight of users participating in a specific event.
async function averageWeightOfUsersInEvent(eventID) {
    return new Promise(async (resolve) => {
        var weightSum = 0;
        var numUsers = 0;

        const querySnapshot = await firebase.firestore().collection("eventosUtilizadores").where("idEvento", "==", eventID).get();
        for (const doc of querySnapshot.docs) {
            var user = await getUserById(doc.data().idUtilizador);
            weightSum += user.data().Weight;
            numUsers++;
        }

        resolve(weightSum / numUsers);
    });
}

async function percentageLeituraValidByEvent(eventID) {
    return new Promise(async (resolve) => {
        const querySnapshot = await firebase.firestore().collection("eventosUtilizadores").where("idEvento", "==", eventID).get();
        for (const doc of querySnapshot.docs) {
            
        }
    })
}

async function showUserCount(eventID) {
    const count = await numReadingsInEvent(eventID);
    const container = document.querySelector('#participantesBody');

    // Remove existing cards
    while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

    // Create a new card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem';

    // Create the card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    // Create the title for the card
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = 'Participantes';
    cardBody.appendChild(title);

    // Create the card text
    const text = document.createElement('p');
    text.classList.add('card-text');
    text.textContent = `${count}`;
    cardBody.appendChild(text);

    // Append the card to the desired location in your HTML
    container.appendChild(card);
}


async function showElevationGained(eventID) {
    const elevation = await totalElevationGainedByEvent(eventID);
    const container = document.querySelector('#elevationBody');
  
    // Remove existing cards
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  
    // Create a new card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '18rem';
  
    // Create the card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);
  
    // Create the title for the card
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = 'Elevation';
    cardBody.appendChild(title);
  
    // Create the card text
    const text = document.createElement('p');
    text.classList.add('card-text');
    text.textContent = `${elevation} meters`;
    cardBody.appendChild(text);
  
    // Append the card to the desired location in your HTML
    container.appendChild(card);
}
  
  

