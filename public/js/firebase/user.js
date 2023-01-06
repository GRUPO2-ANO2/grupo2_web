async function userIsGuia() {
	var userDoc = await firebase.firestore().collection("utilizadores").doc(currentUser.uid);

	// open doc
	return userDoc.get().then((doc) => {
		if (doc.exists) {
			// isGuia is long datatype in firestore
			return doc.data().isGuia;
		} else {
			console.log("No collection for user registered");
		}
	}).catch((error) => {
		console.log("userIsGuia():", error);
	});
}

// No null check
async function getUserData() {
	return await firebase.firestore().collection("utilizadores").doc(currentUser.uid);
}

async function userIsEnrolledInEvent(idEvent) {
	var userEnrolled = false;

	await firebase.firestore().collection("eventosUtilizadores").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			var docEventId = doc.data().idEvento;

			if (docEventId == idEvent) {
				// check for users
				var docUserId = doc.data().idUtilizador;

				if (docUserId == currentUser.uid) {
					userEnrolled = true;
				}
			}
		});
	});

	return userEnrolled;
}

async function getUserById(idUser){
	return await firebase.firestore().collection("utilizadores").doc(idUser).get()
}

async function getAllUtilizadoresByEvent(idEvent) {
	var users = [];
	var numUsers = 0;

	await firebase.firestore().collection("eventosUtilizadores").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			var docEventId = doc.data().idEvento;
			var docUserId = doc.data().idUtilizador;

			if (docEventId == idEvent) {
				users[numUsers] = getUserById(docUserId);
				numUsers++;
			}
		});
	});

	return users;
}