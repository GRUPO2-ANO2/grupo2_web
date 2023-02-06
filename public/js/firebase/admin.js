$(document).ready(function () {
    $("#eventRegister").addClass("show active");
});

// Render graphs
async function renderEvent() {
    var eventoDefault = await getEventsByGuia();
    var eventoDefaultId = eventoDefault[0].uid;
    makeGraphByEvent("guiaEventChart", eventoDefaultId);
    showUserCount(eventoDefaultId);
    showElevationGained(eventoDefaultId);
}

async function updateEvent() {

}

async function dashboardEvent(eventId) {
    console.log("Event id: " + eventId);
    makeGraphByEvent("guiaEventChart", eventId);
    showUserCount(eventId);
    showElevationGained(eventId);
}