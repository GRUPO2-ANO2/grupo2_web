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

async function joinEvent(idEvent){
    var userEnrolled = await userIsEnrolledInEvent(idEvent);

    // if user isnt enrolled yet, enroll him
    if (userEnrolled == false){
        await firebase.firestore().collection("eventosUtilizadores").add({
            idUtilizador: currentUser.uid,
            idEvento: idEvent
        }).then(() => {
            console.log("enrolled");
        }).catch(error => {
            alert(getErrorMessage(error));
        });
    } else {
        console.log("user already enrolled");
    }
}

async function leaveEvent(idEvent){
    var userEnrolled = await userIsEnrolledInEvent(idEvent);

    // if user enrolled remove him
    if (userEnrolled){
        await firebase.firestore().collection("eventosUtilizadores").get().then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                const data = doc.data();
                const docIdEvento = data.idEvento;
                const docIdUtilizador = data.idUtilizador;
                
                if (docIdEvento == idEvent && docIdUtilizador == currentUser.uid){
                    await firebase.firestore().collection("eventosUtilizadores").doc(doc.id).delete().then(() => {
                        console.log("left event " + doc.id);
                    }).catch((error) => {
                        console.error("leaveEvent()", error);
                    });
                }
            });
        });
    }
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

    //showEvents.apply(null, eventosValidos);
    showEvents(eventosValidos);
    //return eventosValidos;
}

async function showEvents(events){
    var event = "";
    var location = "";
    var timeStamp = 0;
    var dateFormat = 0;
    //var dateFinish = "";
    for (var i = 0; i < events.length; i++){
        location = events[i].location;
        dateStart = events[i].dateStart;
        dateFinish = events[i].dateFinish;

        timeStamp = events[i].dateStart;
        dateFormat = new Date(timeStamp);

        document.getElementById("location").innerHTML = events[i].location;
        document.getElementById("description").innerHTML = dateFormat;
        //document.getElementById("description").innerHTML = events[i].dateFinish;
    }

    return event;
}