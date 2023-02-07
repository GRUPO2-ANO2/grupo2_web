const { UserDimensions } = require("firebase-functions/v1/analytics");

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

async function getAllUtilizadoresByEvent(idEvent) {
	return new Promise(async (resolve) => {
		var users = [];

		await firebase.firestore().collection("eventosUtilizadores").get().then(async (querySnapshot) => {
			// para lidar com todas as promessas que estão em ativo	
			const promises = [];

			querySnapshot.forEach((doc) => {
				var docEventId = doc.data().idEvento;
				var docUserId = doc.data().idUtilizador;

				if (docEventId === idEvent) {
					promises.push(getUserById(docUserId));
				}
			});

			// Esperar por todas as promessas
			const resolvedUsers = await Promise.all(promises);
			resolvedUsers.forEach((user) => {
				users.push(user);
			});

			resolve(users);
		});
	});
}

async function showData() {
	const isUser = await userIsGuia();

	if (isUser) {
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
	} else {
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
}

