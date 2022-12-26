async function createEvent(){
    var isGuia = await userIsGuia();
    
    if (isGuia == 1){
        await firebase.firestore().collection("eventos").add({
            idGuia: currentUser.uid,
            dateStart: null,
            dateFinish: null,
            location: null
        }).then(() => {
            console.log("sucesso")
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
    else{
        alert("Utilizador não é guia!")
    } 
}

async function joinEvent(){
    // TODO 
}

// Return open events
async function getValidEvents(){
    var eventosValidos = [];
    var arraySize = 0;

    await firebase.firestore().collection("eventos").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots~
            const data = doc.data();
            const dateFinish = data.dateFinish.toDate();

            // Check if valid event
            if (dateFinish > Date.now()) {
                eventosValidos[arraySize] = doc.data();
                arraySize++;
            }
        });
    });

    return eventosValidos;
}