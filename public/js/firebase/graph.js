// Makes a graph from a user in a specificEvent
async function makeGraphByEventUser(graphID, userID, eventID) {
    var allLeituras = await getReadingsByUserID(userID);
    // filter
    allLeituras = allLeituras.filter(obj => obj.idEvento === eventID)
    if (allLeituras.length == 0) {
        alert("No leituras");
        return;
    }

    var xValues = allLeituras.map(obj => obj.altitude)
    var yValues = allLeituras.map(obj => obj.o2);

    new Chart(graphID, {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                data: yValues,
                borderColor: "red",
                fill: false
            }]
        },
        options: {
            legend: { display: true },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'o2'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'altitude'
                    }
                }]
            }
        }
    });
}

// Makes a graph from a user in all events
async function makeGraphByUserAllEvents(graphID, userID) {
    let allLeituras = await getReadingsByUserID(userID);
    if (allLeituras.length == 0) {
        alert("No leituras");
        return;
    }

    let events = await getEventsByUserID(userID);
    let eventIds = events.map(event => event.uid);
    let datasets = [];
    let xValues = [];

    eventIds.forEach(eventId => {
        let filteredLeituras = allLeituras.filter(obj => obj.idEvento === eventId);
        xValues.push(...filteredLeituras.map(obj => obj.altitude));
        let yValues = filteredLeituras.map(obj => obj.o2);

        datasets.push({
            data: yValues,
            label: "Event " + eventId,
            borderColor: getRandomColor(),
            fill: false
        });
    });

    new Chart(graphID, {
        type: "line",
        data: {
            labels: xValues,
            datasets: datasets
        },
        options: {
            legend: { display: true },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'o2'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'altitude'
                    }
                }]
            }
        }
    });
}

async function makeGraphByGuiaID(graphID, eventID, guiaID) {
    var allLeituras = await getAllReadings();
    allLeituras = allLeituras.filter(obj => obj.idEvento === eventID && obj.idGuia === guiaID)
    if (allLeituras.length == 0) {
        alert("No readings");
        return;
    }

    var xValues = allLeituras.map(obj => obj.altitude)
    var yValues = allLeituras.map(obj => obj.o2);

    new Chart(graphID, {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                data: yValues,
                borderColor: "red",
                fill: false
            }]
        },
        options: {
            legend: { display: true },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'o2'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'altitude'
                    }
                }]
            }
        }
    });
}
