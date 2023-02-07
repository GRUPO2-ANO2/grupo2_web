// Render graphs
async function updateGraph() {
    showGraph();
    makeGraphByUserAllEvents("userEventChart", currentUser.uid);
    showNumReadingsOfUser(currentUser.uid);
    showPercentageValidByUser(currentUser.uid);
    showValidAndInvalidCountByUserValid(currentUser.uid);
    showValidAndInvalidCountByUserInvalid(currentUser.uid);
}

async function showGraph() {
    const div = document.getElementById("graph");
    div.innerHTML = `
    <div id="graphIn">
        <canvas id="userEventChart" style="width:100%;max-width:100%;"></canvas>
    </div>`
}

async function updateGraphGuia() {
    showGraphGuia();
    makeGraphEventsPerMonth("guiaEventBarChart");
}

async function showGraphGuia() {
    const div = document.getElementById("graph");
    div.innerHTML = `
    <div id="graphIn">
        <canvas id="guiaEventBarChart" style="width:100%;max-width:100%;"></canvas>
    </div>`
}