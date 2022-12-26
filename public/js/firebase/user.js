const utilizadorDocRef = firebase.firestore().collection("utilizadores");
const eventoUtilizadorDocRef = firebase.firestore().collection("eventosUtilizadores");

async function userIsGuia(){
	var userDoc = await utilizadorDocRef.doc(currentUser.uid);

	// open doc
	return userDoc.get().then((doc) => {
		if (doc.exists){
            // isGuia is long datatype in firestore
			return doc.data().isGuia;
		} else{
			console.log("No collection for user registered");
		}
	}).catch((error) => {
		console.log("userIsGuia():", error);
	});
}

// No null check
async function getUserData(){
    return await utilizadorDocRef.doc(currentUser.uid);
}

async function userIsEnrolledInEvent(idEvent){
    
}