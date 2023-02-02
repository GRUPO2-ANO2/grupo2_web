$(document).ready(function () {
    $("#eventRegister").addClass("show active");
});

// Add an event listener to the event list container
const eventListContainer = document.getElementById('eventListContainer');
eventListContainer.addEventListener('click', (e) => {
    // Check if the target of the event is a list item
    if (e.target.classList.contains('list-group-item')) {
        // Get the event ID from the target
        const url = window.location.href;
        const eventId = url.split("#")[1].split("-")[1];

        // Call the makeGraphByEvent function with the new event ID
        makeGraphByEvent("guiaEventChart", eventId);
        showUserCount(eventId);
        showElevationGained(eventId);
    }
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