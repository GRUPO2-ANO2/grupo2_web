async function createEvento() {
	var isGuia = await userIsGuia();

	if (isGuia == 1) {

		let dateStart = new Date(form.startDate().value);
		let dateFinish = new Date(form.finishDate().value);
		let registrations = parseInt(form.registrations().value);

		console.log(form.eventId().value);

		var event = await getEventData(form.eventId().value);

		console.log(event);

		await firebase.firestore().collection("eventos").add({
			idGuia: currentUser.uid,
			dateStart: dateStart,
			dateFinish: dateFinish,
			location: event.location,
			description: event.description,
			name: form.name().value,
			elevation: event.elevation,
			latitude: event.latitude,
			longitude: event.longitude,
			range: event.range,
			registrations: registrations,
			image: event.image,
		}).then(() => {
			console.log("sucesso")
		})
			.catch((error) => {
				console.error("Error writing document: ", error);
			});
	} else {
		alert("Utilizador não é guia!")
	}
}

async function joinEvent(idEvent) {
	var userEnrolled = await userIsEnrolledInEvent(idEvent);
	var isGuia = await userIsGuia();

	// dont allow guia's to enter events
	if (isGuia) {
		alert("Guia nao pode entrar evento");
		return;
	}

	// if user isnt enrolled yet, enroll him
	if (userEnrolled == false) {
		const date = new Date();
		await firebase.firestore().collection("eventosUtilizadores").add({
			idUtilizador: currentUser.uid,
			idEvento: idEvent,
			dateregistration: date
		}).then(() => {
			console.log(idEvent, "enrolled");
			window.history.go(-1);
		}).catch(error => {
			alert(getErrorMessage(error));
		});
	} else {
		console.log("user already enrolled");
	}
}

async function leaveEvent(idEvent) {
	var userEnrolled = await userIsEnrolledInEvent(idEvent);

	// if user enrolled remove him
	if (userEnrolled) {
		await firebase.firestore().collection("eventosUtilizadores").get().then((querySnapshot) => {
			querySnapshot.forEach(async (doc) => {
				const data = doc.data();
				const docIdEvento = data.idEvento;
				const docIdUtilizador = data.idUtilizador;

				if (docIdEvento == idEvent && docIdUtilizador == currentUser.uid) {
					await firebase.firestore().collection("eventosUtilizadores").doc(doc.id).delete().then(() => {
						console.log("left event " + doc.id);
						window.history.go(-1);
					}).catch((error) => {
						console.error("leaveEvent()", error);
					});
				}
			});
		});
	}
}

async function getEvent(idEvent) {
	return new Promise(async (resolve) => {
		const docE = await firebase.firestore().collection("eventos").doc(idEvent).get();
		var event = null;

		if (docE.exists) {
			event = docE.data();
			event.uid = docE.id;
		}

		resolve(event);
	});
}

// Does not need to make a promise
async function editEvent(idEvent, name, registrations, dateStart, dateFinish) {
	let dateStartAsDate = new Date(dateStart);
	let dateFinishAsDate = new Date(dateFinish);
	var owns = await userOwnsEvent(idEvent);

	

	if (owns) {
		await firebase.firestore().collection("eventos").doc(idEvent).update({
			name: name,
			registrations: registrations,
			dateStart: dateStartAsDate,
			dateFinish: dateFinishAsDate
		}).then(() => {
			console.log("edited");
		});
	} else {
		console.log("User doesnt own event");
	}
}

// Does not need to make a promise
async function removeEvent(idEvent) {
	var owns = await userOwnsEvent(idEvent);

	if (owns) {
		await firebase.firestore().collection("eventos").doc(idEvent).delete().then(() => {
			console.log("removed");
		}).catch((error) => {
			console.log("removeEvent():", error);
		});

		const querySnapshot = await firebase.firestore().collection("eventosUtilizadores").get();
		for (const doc of querySnapshot.docs) {
			data = doc.data();
			const docIdEvento = data.idEvento;

			if (docIdEvento == idEvent) {
				await firebase.firestore().collection("eventosUtilizadores").doc(data.id).delete();
			}
		}
	} else {
		console.log("User doesnt own event");
	}
}

// WARNING: Does not validate events
async function getEventsByUserID(userID) {
	return new Promise(async (resolve, reject) => {
		var events = [];
		var eventCount = 0;
		var enrolled = false;
		var data;

		const querySnapshot = await firebase.firestore().collection("eventosUtilizadores").get();
		for (const doc of querySnapshot.docs) {
			data = doc.data();
			const docIdEvento = data.idEvento;
			const docIdUtilizador = data.idUtilizador;

			// If user in document same as logged in
			if (docIdUtilizador == userID) {
				enrolled = await userIsEnrolledInEventById(docIdEvento, userID);
				// And if enrolled, add event
				if (enrolled) {
					events[eventCount] = await getEvent(docIdEvento);
					eventCount++;
				}
			}
		}
		resolve(events);
	});
}

// WARNING: Does not validate events
async function getEventsByUser() {
	return await getEventsByUserID(currentUser.uid);
}

async function getEventsByGuia() {
	if (await userIsGuia() == false) {
		alert("user is not guia");
		return null;
	}

	return new Promise(async (resolve) => {
		var events = [];
		var eventCount = 0;
		var owns = false;
		var data;

		const querySnapshot = await firebase.firestore().collection("eventos").get();
		for (const doc of querySnapshot.docs) {
			data = doc.data();
			const docIdEvento = doc.id;
			const docIdGuia = data.idGuia;

			// If user in document same as logged in
			if (docIdGuia == currentUser.uid) {
				owns = await userOwnsEvent(docIdEvento);
				// And if owns, add event
				if (owns) {
					events[eventCount] = await getEvent(docIdEvento);
					eventCount++;
				}
			}
		}
		resolve(events);
	});
}

// Return open events
async function getValidEvents() {
	return new Promise(async (resolve) => {
		var eventosValidos = [];
		var arraySize = 0;

		await firebase.firestore().collection("eventos").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots~
				const data = doc.data();
				data.uid = doc.id;
				const dateFinish = data.dateFinish.toDate();

				// Check if valid event
				if (isValidDate(dateFinish)) {
					eventosValidos[arraySize] = data;
					arraySize++;
				}
			});
		});

		resolve(eventosValidos);
	});
}

async function getEventsData() {
	return new Promise(async (resolve) => {
		var events = [];
		var arraySize = 0;

		await firebase.firestore().collection("dadosEventos").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots~
				const data = doc.data();
				data.uid = doc.id;

				events[arraySize] = data;
				arraySize++;
			});
		});

		resolve(events);
	});
}

async function getEventData(idEventData) {
	return new Promise(async (resolve) => {
		var event = [];

		const docE = await firebase.firestore().collection("dadosEventos").doc(idEventData).get();

		if (docE.exists) {
			event = docE.data();
			event.uid = docE.id;
		}

		console.log(event.location)

		resolve(event);
	});
}

// used to check wether a user owns an event(for editting/removing purposes)
async function userOwnsEvent(idEvent) {
	return new Promise(async (resolve) => {
		var data = await getEvent(idEvent);
		resolve(data.idGuia == currentUser.uid);
	});
}

function isValidDate(date) {
	return date > Date.now();
}

// Tudo daqui para baixo é melhor mudar de sitio
// porque o que fazemos neste ficheiro é fazer pedidos ao firebase
// relacionados a tabela evento

async function showEventDataList() {
	const events = await getEventsData();
	console.log(events);

	var data;

	// Create a card for each item
	for (let i = 0; i < events.length; i++) {

		// Create the card
		const table = document.getElementById('data');
		table.innerHTML += `
        <tr>
		    <td>
			    <option id="eventId" value="${events[i].uid}">
		            ${events[i].name}
				</option>
			</td>	
    	</tr>
        `;
	}
}

async function showEventsByGuia() {
	const events = await getEventsByGuia();

	// Get the card container element
	const cardContainer = document.getElementById('card-container');

	// Create a row element
	const row = document.createElement('div');
	row.className = 'row';

	// Create a card for each item
	for (let i = 0; i < events.length; i++) {

		// Create a column
		const col = document.createElement('div');
		col.className = 'col-4 mt-3';

		// cut string
		const cutDesc = events[i].description.substring(0, 100) + "...";

		// Create the card
		const card = document.createElement('div');
		card.id = `card-${events[i].uid}`;
		card.className = `fw-bolder`;
		card.innerHTML = `
		<div class="card" style="cursor: pointer;">
			<img src="${events[i].image}" class="card-img-top" alt="card-img">
			<div class="card-body">
				<h4 class="card-title">${events[i].name}</h4>
				<div class="scrollable">
					<h5 class="card-text">${cutDesc}</h5>
				</div>
			</div>
		</div>
        `;

		// Append the card to the column
		col.appendChild(card);

		// Append the column to the row
		row.appendChild(col);

		const numUsers = (await getAllUtilizadoresByEvent(events[i].uid)).length

		const dateStart = events[i].dateStart
		const dateStartAsDate = dateStart.toDate();

		const dateFinish = events[i].dateFinish
		const dateFinishAsDate = dateFinish.toDate();

		const options = {
			day: "2-digit",
			month: "2-digit",
			year: "numeric"
		};
		const dateStartAsString = dateStartAsDate.toLocaleDateString("pt-PT", options);
		const dateFinishAsString = dateFinishAsDate.toLocaleDateString("pt-PT", options);


		const formattedDateStart = dateStartAsString
			.split("/")
			.reverse()
			.join("-");

		const formattedDateFinish = dateFinishAsString
			.split("/")
			.reverse()
			.join("-");


		// Add an event listener to the card that opens eventInfo
		card.addEventListener('click', function() {
			let eventRegister = document.getElementById("editEvent");
			eventRegister.style.display = "block";
			editEventForm(events[i].uid);
		});
	}

	// Append the row to the card container
	cardContainer.appendChild(row);
}

async function editEventForm(eventId) {
	console.log(eventId);
	const event = await getEvent(eventId);

	const div = document.getElementById('editEventForm');

	const form = document.createElement('form');

	const label = document.createElement('label');
	label.className = `col-form-label`;
	label.innerHTML = `
	Nome do Evento: ${event.name};
	`;
	
	form.appendChild(label);
	div.appendChild(form);
}

async function showEventsByUser() {
	const events = await getEventsByUser();

	// Get the card container element
	const cardContainer = document.getElementById('card-container');

	// Create a row element
	const row = document.createElement('div');
	row.className = 'row';

	// Create a card for each item
	for (let i = 0; i < events.length; i++) {

		// Create a column
		const col = document.createElement('div');
		col.className = 'col-4 mt-3';

		// cut string
		const cutDesc = events[i].description.substring(0, 100) + "...";

		// Create the card
		const card = document.createElement('div');
		card.id = `card-${events[i].uid}`;
		card.className = `fw-bolder`;
		card.innerHTML = `
		<div class="card" style="cursor: pointer;">
			<img src="${events[i].image}" class="card-img-top" alt="card-img">
			<div class="card-body">
				<h4 class="card-title">${events[i].name}</h4>
				<div class="scrollable">
					<h5 class="card-text">${cutDesc}</h5>
				</div>
			</div>
		</div>
        `;

		// Append the card to the column
		col.appendChild(card);

		// Append the column to the row
		row.appendChild(col);

		const numUsers = (await getAllUtilizadoresByEvent(events[i].uid)).length

		const dateStart = events[i].dateStart
		const dateStartAsDate = dateStart.toDate();

		const dateFinish = events[i].dateFinish
		const dateFinishAsDate = dateFinish.toDate();

		const options = {
			day: "2-digit",
			month: "2-digit",
			year: "numeric"
		};
		const dateStartAsString = dateStartAsDate.toLocaleDateString("pt-PT", options);
		const dateFinishAsString = dateFinishAsDate.toLocaleDateString("pt-PT", options);


		const formattedDateStart = dateStartAsString
			.split("/")
			.reverse()
			.join("-");

		const formattedDateFinish = dateFinishAsString
			.split("/")
			.reverse()
			.join("-");


		// Add an event listener to the card that opens eventInfo
		card.addEventListener('click', function () {
			window.location.href = 'eventInfo.html?id=' + events[i].uid + '&page=' + "profile";
		});
	}

	// Append the row to the card container
	cardContainer.appendChild(row);
}

async function showEvents() {
	var events = await getValidEvents();

	// Get the card container element
	const cardContainer = document.getElementById('card-container');

	// Create a row element
	const row = document.createElement('div');
	row.className = 'row';

	// Create a card for each item
	for (let i = 0; i < events.length; i++) {

		// Create a column
		const col = document.createElement('div');
		col.className = 'col-4 mt-3';

		// cut string
		const cutDesc = events[i].description.substring(0, 100) + "...";

		// Create the card
		const card = document.createElement('div');
		card.id = `card-${events[i].uid}`;
		card.className = `fw-bolder`;
		card.innerHTML = `
		<div class="card" style="cursor: pointer;">
			<img src="${events[i].image}" class="card-img-top" alt="card-img">
			<div class="card-body">
				<h4 class="card-title">${events[i].name}</h4>
				<div class="scrollable">
					<h5 class="card-text">${cutDesc}</h5>
				</div>
			</div>
		</div>
        `;

		// Append the card to the column
		col.appendChild(card);

		// Append the column to the row
		row.appendChild(col);


		// Add an event listener to the card that opens eventInfo
		card.addEventListener('click', function () {
			window.location.href = 'eventInfo.html?id=' + events[i].uid + '&page=' + "events";
		});

	}

	// Append the row to the card container
	cardContainer.appendChild(row);
}

async function showEventInformations() {

	const urlParamsId = new URLSearchParams(window.location.search);
	const eventId = urlParamsId.get('id');
	const urlParamsPage = new URLSearchParams(window.location.search);
	const page = urlParamsPage.get('page');
	var event = await getEvent(eventId);

	// convert timestamp to Date
	const dateStart = event.dateStart
	const dateStartAsDate = dateStart.toDate();

	const dateFinish = event.dateFinish
	const dateFinishAsDate = dateFinish.toDate();

	const options = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	};
	const dateStartAsString = dateStartAsDate.toLocaleDateString("pt-PT", options);
	const dateFinishAsString = dateFinishAsDate.toLocaleDateString("pt-PT", options);


	const formattedDateStart = dateStartAsString
		.split("/")
		.reverse()
		.join("-");

	const formattedDateFinish = dateFinishAsString
		.split("/")
		.reverse()
		.join("-");

	const dateformattedDateFinish = new Date();
	const dateformattedDateStart = new Date();

	const numDays = Math.floor(((dateFinishAsDate.getTime() - dateStartAsDate.getTime()) / 86400000));


	var title = document.getElementById("title");
	var image = document.getElementById("img");
	var location = document.getElementById("location");
	var range = document.getElementById("range");
	var elevation = document.getElementById("elevation");
	var description = document.getElementById("description");
	var registrations = document.getElementById("registrations");
	var duration = document.getElementById("duration");
	var startDate = document.getElementById("dateStart");
	var finishDate = document.getElementById("dateFinish")
	var duration = document.getElementById("duration");
	var btn = document.getElementById("btn");

	image.innerHTML = `<img class="rounded" src="${event.image}">`;
	title.innerHTML = event.name;
	location.innerHTML = event.location;
	range.innerHTML = event.range;
	elevation.innerHTML = event.elevation;
	description.innerHTML = event.description;
	registrations.innerHTML = event.registrations;
	startDate.innerHTML = `Inicio: ${formattedDateStart}`;
	finishDate.innerHTML = `Fim: ${formattedDateFinish}`;

	duration.innerHTML = `${numDays} Dias`

	if (page == "events") {
		btn.innerHTML = `      
		<button class="btn btn-success" type="button" onclick="joinEvent('${event.uid}');">
			<i class="fas fa-check fa-fw"></i> 
			Entrar no Evento
		</button>
		  `
	} if (page == "profile") {
		btn.innerHTML = `      
		<button class="btn btn-danger" style="margin-top: 20px;" onclick="leaveEvent('${event.uid}');">
			<i class="fas fa-xmark fa-fw"></i> Sair do Evento 
		</button>
		  `
	} /*if (page == "admin") {
		btn.innerHTML = `      
			<button id="editEvent" class="btn btn-outline-success m-2" style="margin-top: 20px;">
				<i class="fa fa-edit"></i> Editar Evento 
			</button>
			<button class="btn btn-outline-danger m-2" style="margin-top: 20px;">
				<i class="fas fa-xmark fa-fw"></i> Remover Evento 
			</button>
		`;

	// Add an event listener to the button with the id "editEvent"
	document.getElementById("editEvent").addEventListener('click', function() {
		console.log("click");
		window.location.href = "admin.html";
		window.onload = function(){
			$('#editEvent').tab('show');
		};
	});


	}*/


	mapboxgl.accessToken = 'pk.eyJ1IjoiZ29uY2F2ZiIsImEiOiJjbGNrcm5oa20wN2k4M29xbDB2dThrbHFnIn0.WIf2lhzQBXsULjf5Dm4t1g';
	(async () => {
		const map = new mapboxgl.Map({
			container: 'map',
			zoom: 40,
			center: [event.longitude, event.latitude],
			pitch: 80,
			bearing: 180,
			interactive: false,
			style: 'mapbox://styles/mapbox/satellite-streets-v11'
		});

		await map.once('load');
		// Add fog
		map.setFog({
			'range': [-1, 1.5],
			'color': 'white',
			'horizon-blend': 0.1
		});

		// Add some 3d terrain
		map.addSource('mapbox-dem', {
			'type': 'raster-dem',
			'url': 'mapbox://mapbox.terrain-rgb',
			'tileSize': 512,
			'maxzoom': 14
		});
		map.setTerrain({
			'source': 'mapbox-dem',
			'exaggeration': 1.2
		});

		// Add two different day and night sky layers so that we may switch between
		// them during animation. We add a sky opacity transition to slightly animate
		// the opacity updates.
		map.addLayer({
			'id': 'sky-day',
			'type': 'sky',
			'paint': {
				'sky-type': 'gradient',
				'sky-opacity-transition': { 'duration': 500 }
			}
		});
		map.addLayer({
			'id': 'sky-night',
			'type': 'sky',
			'paint': {
				'sky-type': 'atmosphere',
				'sky-atmosphere-sun': [90, 0],
				'sky-atmosphere-halo-color': 'rgba(255, 255, 255, 0.5)',
				'sky-atmosphere-color': 'rgba(255, 255, 255, 0.2)',
				'sky-opacity': 0,
				'sky-opacity-transition': { 'duration': 500 }
			}
		});
		map.addLayer({
			"id": "countour-labels",
			"type": "symbol",
			"source": {
				type: 'vector',
				url: 'mapbox://mapbox.mapbox-terrain-v2'
			},
			"source-layer": "contour",
			'layout': {
				'visibility': 'visible',
				'symbol-placement': 'line',
				'text-field': ['concat', ['to-string', ['get', 'ele']], 'm']
			},
			'paint': {
				'icon-color': '#877b59',
				'icon-halo-width': 1,
				'text-color': '#877b59',
				'text-halo-width': 1
			}
		});
		map.addLayer({
			"id": "countours",
			"type": "line",
			"source": {
				type: 'vector',
				url: 'mapbox://mapbox.mapbox-terrain-v2'
			},
			"source-layer": "contour",
			'layout': {
				'visibility': 'visible',
				'line-join': 'round',
				'line-cap': 'round'
			},
			'paint': {
				'line-color': '#877b59',
				'line-width': 1
			}
		});
		map.scrollZoom.enable();

		// Run a timing loop to switch between day and night
		await map.once('idle');
		let lastTime = 0.0;
		let animationTime = 0.0;
		let cycleTime = 0.0;
		let day = true;

		const initialBearing = map.getBearing();

		function frame(time) {
			const elapsedTime = (time - lastTime) / 1000.0;

			animationTime += elapsedTime;
			cycleTime += elapsedTime;

			if (cycleTime > 10.0) {
				if (day) {
					map.setPaintProperty('sky-day', 'sky-opacity', 1);
					map.setPaintProperty('sky-night', 'sky-opacity', 0);
					map.setFog({ 'color': 'white' });
				} else {
					map.setPaintProperty('sky-day', 'sky-opacity', 0);
					map.setPaintProperty('sky-night', 'sky-opacity', 1);
					map.setFog({ 'color': 'rgba(66, 88, 106, 1.0)' });
				}

				day = !day;
				cycleTime = 0.0;
			}

			const rotation = initialBearing + animationTime * 2.0;
			map.setBearing(rotation % 360);

			lastTime = time;

			window.requestAnimationFrame(frame);
		}

		window.requestAnimationFrame(frame);
	})();
}