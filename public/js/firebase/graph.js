var chart = null;

// Makes a graph from a user in a specificEvent
async function makeGraphByEventUser(graphID, userID, eventID) {
    var allLeituras = await getReadingsByUserID(userID);
    allLeituras = allLeituras.filter(obj => obj.idEvento === eventID)
    if (allLeituras.length == 0) {
        console.log("No leituras");
        return;
    }
    var user = await getUserById(userID);
    var xValues = allLeituras.map(obj => obj.o2)
    var yValues = allLeituras.map(obj => obj.altitude);

    // Check if a chart already exists on the canvas
    if (graphID.chart) {
        // If a chart exists, destroy it
        graphID.chart.destroy();
    }

    new Chart(graphID, {
        type: "line",
        data: {
            labels: yValues,
            datasets: [{
                data: xValues,
                borderColor: "red",
                fill: false,
                label: user.name
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
        console.log("No leituras");
        return;
    }

    let events = await getEventsByUserID(userID);
    let eventIds = events.map(event => event.uid);
    let datasets = [];
    let xValues = [];
    var c = 0;
    eventIds.forEach(eventId => {
        let filteredLeituras = allLeituras.filter(obj => obj.idEvento === eventId);
        xValues.push(...filteredLeituras.map(obj => obj.o2));
        let yValues = filteredLeituras.map(obj => obj.altitude);
        
        datasets.push({
            data: yValues,
            label: "Event " + events[c].name,
            borderColor: getRandomColor(),
            fill: false
        });
        c++;
    });

    if (chart != null)
        chart.destroy();

    const ctx = document.getElementById(graphID);
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: xValues,
            datasets: datasets
        },
        options: {
            legend: { display: true },
            scales: {
                x: {
                    labelString: "o2",
                    ticks: { color: 'white', beginAtZero: true },
                    title: {
                        text: "O2",
                        display: true,
                        align: "center",
                        color: '#fff'
                    },
                    grid: {
                        color: 'white'
                    }
                },
                y: {
                    labelString: "altitude",
                    ticks: { color: 'white', beginAtZero: true },
                    title: {
                        text: "Altitude",
                        display: true,
                        align: "center",
                        color: '#fff'
                    },
                    grid: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

// makes a graph that shows every reading in an event seperating by user
async function makeGraphByEvent(graphID, eventID) {
    var allLeituras = await getReadingsByEventID(eventID);
    if (allLeituras.length == 0) {
        console.log("No leituras");
        return;
    }
    let userIds = Array.from(new Set(allLeituras.map(reading => reading.idUtilizador)));
    let datasets = [];
    let xValues = [];

    let promises = [];
    userIds.forEach(userId => {
        promises.push(getUserById(userId));
    });

    let users = await Promise.all(promises);

    users.forEach((user, index) => {
        let filteredLeituras = allLeituras.filter(obj => obj.idUtilizador === userIds[index]);
        xValues.push(...filteredLeituras.map(obj => obj.o2));
        let yValues = filteredLeituras.map(obj => obj.altitude);

        datasets.push({
            data: yValues,
            label: user.Name,
            borderColor: getRandomColor(),
            fill: false,
        });
    });

    if (chart != null) chart.destroy();

    const ctx = document.getElementById(graphID);
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: xValues,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    labelString: "o2",
                    ticks: { color: 'white', beginAtZero: true },
                    title: {
                        text: "O2",
                        display: true,
                        align: "center",
                        color: '#fff'
                    },
                    grid: {
                        color: 'white'
                    }
                },
                y: {
                    labelString: "altitude",
                    ticks: { color: 'white', beginAtZero: true },
                    title: {
                        text: "Altitude",
                        display: true,
                        align: "center",
                        color: '#fff'
                    },
                    grid: {
                        color: 'white'
                    }
                }
            }
        }
    });
}


// makes a bar graph that shows how many events each month has
async function makeGraphEventsPerMonth(graphID) {
    currentUser = { uid: "IDtFlVMgYQhQX6kyceVczQc0Zzh1" }
    let events = await getEventsByGuia();
    if (events.length === 0) {
        console.log("No events");
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

    chart.update();
}