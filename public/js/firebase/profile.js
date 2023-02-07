// Render graphs
async function updateGraph() {
    showStatsDataUser();
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
    showStatsDataGuia();
    showGraphGuia();
    makeGraphEventsPerMonth("guiaEventBarChart");
    ShowNumEventsOwnedByGuia(currentUser.uid);
}

async function showGraphGuia() {
    const div = document.getElementById("graph");
    div.innerHTML = `
    <div id="graphIn">
        <canvas id="guiaEventBarChart" style="width:100%;max-width:100%;"></canvas>
    </div>`
}

async function showStatsDataUser() {

		document.getElementById("showData").innerHTML = 
			`
			<div class="container px-4 mt-5">
				<div class="row">
					<div class="col-auto">
						<div id="numReadingsOfUser" class="statCard"> 

						</div>
					</div>
					<div class="col-auto">
						<div id="validAndInvalidCountByUserValid" class="statCard"> 

						</div>
					</div>
					<div class="col-auto">
						<div id="validAndInvalidCountByUserInvalid" class="statCard"> 

						</div>
					</div>
					<div class="col-auto">
						<div id="percentageValidByUser" class="statCard"> 

						</div>
					</div>
				</div>
				<div class="justify-content-center" id="graphCard">
					<!--  -->
					<div class="card">
						<div class="card-body">
							<div id="graph" class="">
							</div>
						</div>
					</div>
				</div>
			</div>`;
}

async function showStatsDataGuia() {
		document.getElementById("showData").innerHTML = 
		`
		<div class="container px-4 mt-5">
			<div class="row">
				<div class="col-auto">
					<div id="numEventsOwnedByGuia" class="statCard"> 

					</div>
				</div>
				<div class="col-auto">
					<div id="validAndInvalidCountByUserValid" class="statCard"> 

					</div>
				</div>
				<div class="col-auto">
					<div id="validAndInvalidCountByUserInvalid" class="statCard"> 

					</div>
				</div>
				<div class="col-auto">
					<div id="percentageValidByUser" class="statCard"> 

					</div>
				</div>
			</div>
			<div class="justify-content-center" id="graphCard">
				<!--  -->
				<div class="card">
					<div class="card-body">
						<div id="graph" class="">
						</div>
					</div>
				</div>
			</div>
		</div>`;

}
