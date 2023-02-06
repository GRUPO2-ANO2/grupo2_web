// Render graphs
async function updateGraph() {
    showGraph();
    makeGraphByUserAllEvents("userEventChart", currentUser.uid);
    showNumReadingsOfUser(currentUser.uid);
}

async function showGraph() {
    const div = document.getElementById("graph");
    div.innerHTML = `
    <div id="graphIn">
        <canvas id="userEventChart" style="width:100%;max-width:100%;"></canvas>
    </div>`
}