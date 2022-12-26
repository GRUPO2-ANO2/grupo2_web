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
    
    // Get the card container element
    const cardContainer = document.getElementById('card-container');
    cardContainer.classList.add('row gx-4 gx-lg-5 row-cols-2 justify-content-center');
        
    // Iterate through the data and create a card for each item
    for (let i = 0; i < events.length; i++) {

        const div = document.createElement('div');
        div.className = `container px-4 px-lg-5 mt-5`

        const div2 = document.createElement('div');
        div2.className = `row gx-4 gx-lg-5 row-cols-2 justify-content-center`

        const div3 = document.createElement('div');
        div3.className = `col mx-5`

        const div4 = document.createElement('div');
        div4.className = `card h-100`

        const div5 = document.createElement('div');
        div5.className = `card-body p-4`

        const div6 = document.createElement('div');
        div6.className = `text-center`

        const card = document.createElement('div');
        card.id = `card-${i}`;
        card.className = `fw-bolder`
        card.innerHTML = `
        <h5>${events[i].location}</h2>
        `;


        /*div6.appendChild(card);
        div5.appendChild(div6);*/
        div6.appendChild(card);
        div5.appendChild(div6);
        div4.appendChild(div5);
        div3.appendChild(div4);
        document.body.appendChild(div3);
    }
}