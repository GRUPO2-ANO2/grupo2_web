$(document).ready(function () {
    $("#eventRegister").addClass("show active");
});

// Render graphs
async function renderEvent() {
    var eventoDefault = await getEventsByGuia();
    var eventoDefaultId = eventoDefault[0].uid;
    updateGraph(eventoDefaultId);
}

async function dashboardEvent(eventId) {
    console.log("Event id: " + eventId);
    updateGraph(eventId);
}

async function updateGraph(eventId){
    makeGraphByEvent("guiaEventChart", eventId);
    showUserCount(eventId);
    showElevationGained(eventId);
    showPercentageLeituraValid(eventId);
    showAverageHeightOfUsersInEvent(eventId);
    showAllUtilizadoresByEvent(eventId);
    showGraph(eventId);
}


async function showGraph(eventId) {
    const event = await getEvent(eventId);
    const div = document.getElementById("graph");
    div.innerHTML = ` 
    <h1 class="text-center">${event.name}</h1>
    <div id="graphIn">
    <canvas id="guiaEventChart" style="width:100%;max-width:100%;"></canvas>
  </div>`
}
