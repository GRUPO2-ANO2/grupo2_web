// Makes a graph from a user in a specificEvent
async function makeGraphByEventUser(graphID, userID, eventID) {
    var allLeituras = await getReadingsByUserID(userID);
    allLeituras = allLeituras.filter(obj => obj.idEvento === eventID)
    if (allLeituras.length == 0) {
        alert("No leituras");
        return;
    }

    var xValues = allLeituras.map(obj => obj.o2)
    var yValues = allLeituras.map(obj => obj.altitude);

    new Chart(graphID, {
        type: "line",
        data: {
            labels: yValues,
            datasets: [{
                data: xValues,
                borderColor: "red",
                fill: false
            }]
        },
        options: {
            legend: { display: true },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'o2'
                    }
                }],
                yAxes: [{
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
        xValues.push(...filteredLeituras.map(obj => obj.o2));
        let yValues = filteredLeituras.map(obj => obj.altitude);

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
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'o2'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'altitude'
                    }
                }]
            }
        }
    });
}

// makes a graph that shows every reading in an event seperating by user
async function makeGraphByEvent(graphID, eventID) {
    var allLeituras = await getReadingsByEventID(eventID);
    if (allLeituras.length == 0) {
        alert("No leituras");
        return;
    }
    let userIds = Array.from(new Set(allLeituras.map(reading => reading.idUtilizador)));
    let datasets = [];
    let xValues = [];

    userIds.forEach(userId => {
        let filteredLeituras = allLeituras.filter(obj => obj.idUtilizador === userId);
        xValues.push(...filteredLeituras.map(obj => obj.o2));
        let yValues = filteredLeituras.map(obj => obj.altitude);

        datasets.push({
            data: yValues,
            label: "User " + userId,
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
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'o2'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'altitude'
                    }
                }]
            }
        }
    });
}

// makes a bar graph that shows how many events each month has
async function makeGraphEventsPerMonth(graphID) {
    currentUser = { uid: "IDtFlVMgYQhQX6kyceVczQc0Zzh1" }
    let events = await getEventsByGuia();
    if (events.length === 0) {
        alert("No events");
        return;
    }

    let monthCount = new Array(12).fill(0);
    events.forEach(event => {
        let eventDate = event.dateStart.toDate();
        let eventMonth = eventDate.getMonth();
        monthCount[eventMonth]++;
    });

    new Chart(graphID, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: monthCount,
                    backgroundColor: "blue",
                    borderColor: "black",
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: "# of events"
                        }
                    }
                ],
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: "Month"
                        }
                    }
                ]
            }
        }
    });
}