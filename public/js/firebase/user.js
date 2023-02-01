async function userIsGuia() {
	return new Promise(async (resolve) => {
		var userDoc = await firebase.firestore().collection("utilizadores").doc(currentUser.uid);

		userDoc.get().then((doc) => {
			if (doc.exists) {
				resolve(doc.data().isGuia);
			} else {
				console.log("No collection for user registered");
				resolve(0);
			}
		}).catch((error) => {
			console.log("userIsGuia():", error);
			resolve(0);
		});
	});
}

// No null check
async function getUserData() {
	return new Promise(async (resolve) => {
		var data = await firebase.firestore().collection("utilizadores").doc(currentUser.uid);
		resolve(data);
	});
}

async function getUserDataById(userId) {
	return new Promise(async (resolve) => {
		var data = await firebase.firestore().collection("utilizadores").doc(userId);
		resolve(data);
	});
}

async function userIsEnrolledInEvent(idEvent) {
	return new Promise(async (resolve) => {
		var userEnrolled = false;

		await firebase.firestore().collection("eventosUtilizadores").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var docEventId = doc.data().idEvento;

				if (docEventId == idEvent) {
					var docUserId = doc.data().idUtilizador;

					if (docUserId == currentUser.uid) {
						userEnrolled = true;
					}
				}
			});
		});

		resolve(userEnrolled);
	});
}

async function userIsEnrolledInEventById(idEvent, idUser) {
	return new Promise(async (resolve) => {
		var userEnrolled = false;

		await firebase.firestore().collection("eventosUtilizadores").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var docEventId = doc.data().idEvento;

				if (docEventId == idEvent) {
					var docUserId = doc.data().idUtilizador;

					if (docUserId == idUser) {
						userEnrolled = true;
					}
				}
			});
		});

		resolve(userEnrolled);
	});
}

async function getUserById(idUser) {
	return new Promise(async (resolve) => {
		var data = await firebase.firestore().collection("utilizadores").doc(idUser).get();
		data.uid = idUser;
		resolve(data.data());
	})
}

function getAllUtilizadoresByEvent(idEvent) {
	return new Promise((resolve) => {
		var users = [];
		var numUsers = 0;

		firebase.firestore().collection("eventosUtilizadores").get().then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				var docEventId = doc.data().idEvento;
				var docUserId = doc.data().idUtilizador;

				if (docEventId == idEvent) {
					getUserById(docUserId).then((user) => {
						users[numUsers] = user;
						numUsers++;
					});
				}
			});
		}).then(() => {
			resolve(users);
		});
	});
}