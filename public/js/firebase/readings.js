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