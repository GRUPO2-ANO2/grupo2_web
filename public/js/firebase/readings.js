async function getUserReadings(){
    var readings = [];
    var readingsCount = 0;

    await firebase.firestore().collection("leituras").get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			var data = doc.data();

            if (data.idUtilizador == currentUser.uid){
                readings[readingsCount] = data;
                readingsCount++;
            }
		});
    });
    
    return readings;
}