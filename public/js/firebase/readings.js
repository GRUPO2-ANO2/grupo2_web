async function getUserReadings() {
	var readings = [];
	var readingsCount = 0;

	await firebase.firestore().collection("leituras").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			var data = doc.data();

			if (data.idUtilizador == currentUser.uid) {
				readings[readingsCount] = data;
				readingsCount++;
			}
		});
	});

	return readings;
}

async function getReadingsByUserID(userId) {
	return new Promise((resolve) => {
		var leituras = [];
		var numLeituras = 0;

		firebase.firestore().collection("leituras").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var docI = doc.data();
				var docUserId = docI.idUtilizador;
				docI.id = doc.id;

				if (docUserId == userId) {
					leituras[numLeituras] = docI;
					numLeituras++;
				}
			});
		}).then(() => {
			resolve(leituras);
		});
	});
}

async function getReadingsByEventID(eventID) {
	return new Promise((resolve) => {
		var leituras = [];
		var numLeituras = 0;

		firebase.firestore().collection("leituras").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var docI = doc.data();
				var docEventID = docI.idEvento;
				docI.id = doc.id;

				if (docEventID == eventID) {
					leituras[numLeituras] = docI;
					numLeituras++;
				}
			});
		}).then(() => {
			resolve(leituras);
		});
	});
}

// Get all readings done by a guia
async function getGuiasDoneReadings(guiaID) {
	var isGuia = await userIsGuia();
	var readings = [];
	var readingsCount = 0;

	// this check might be redundant if frontend done correctly
	if (isGuia) {
		await firebase.firestore().collection("leituras").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var data = doc.data();

				if (data.idGuia == guiaID) {
					readings[readingsCount] = data;
					readingsCount++;
				}
			});
		});
	} else {
		console.log("user isnt guia");
	}

	return readings;
}

// returns whether a reading is valid(its o2 is good enough to continue)
/*
altitude (metre) were respectively: 
99 (98–99) at 154m; 
99 (98–99) at 562m; 
98 (97–99) at 1400m; 
97 (96–98) at 2000m;
97 (96–99) at 2335m; 
96 (95–97) at 2500m; 
95 (94–96) at 2880m; 
93 (92–95) at 3250m; 
92 (90–93) at 3600m; 
90 (88–91) at 3950m; 
87 (85–89) at 4100m; 
87 (85–89) at 4338m; 
87 (85–89) at 4500m;
85 (83–88) at 4715m; 
81 (78–84) at 5100m.
*/
function isReadingValid(o2, altitude) {
	const readings = [
		{ range: [0, 154], o2Range: [98, 99] },
		{ range: [154, 562], o2Range: [98, 99] },
		{ range: [562, 1400], o2Range: [97, 99] },
		{ range: [1400, 2000], o2Range: [96, 98] },
		{ range: [2000, 2335], o2Range: [96, 99] },
		{ range: [2335, 2500], o2Range: [95, 97] },
		{ range: [2500, 2880], o2Range: [94, 96] },
		{ range: [2880, 3250], o2Range: [92, 95] },
		{ range: [3250, 3600], o2Range: [90, 93] },
		{ range: [3600, 3950], o2Range: [88, 91] },
		{ range: [3950, 4100], o2Range: [85, 89] },
		{ range: [4100, 4338], o2Range: [85, 89] },
		{ range: [4338, 4500], o2Range: [85, 89] },
		{ range: [4500, 4715], o2Range: [83, 88] },
		{ range: [4715, 5100], o2Range: [78, 84] }
	];

	for (let i = 0; i < readings.length; i++) {
		if (altitude >= readings[i].range[0] && altitude <= readings[i].range[1]) {
			if (o2 >= readings[i].o2Range[0] && o2 <= readings[i].o2Range[1]) {
				return true;
			} else {
				return false;
			}
		}
	}
	return false;
}


async function isReadingValidById(readingID) {
	return new Promise(async (resolve) => {
		var data = await firebase.firestore().collection("leituras").doc(readingID).get();
		var m = data.data().altitude;
		var o2 = data.data().o2;

		resolve(isReadingValid(o2, m));
	});
}