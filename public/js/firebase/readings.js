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

// Get all readings done by a guia
async function getGuiasDoneReadings() {
	var isGuia = await userIsGuia();
	var readings = [];
	var readingsCount = 0;

	// this check might be redundant if frontend done correctly
	if (isGuia) {
		await firebase.firestore().collection("leituras").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var data = doc.data();

				if (data.idGuia == currentUser.uid) {
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