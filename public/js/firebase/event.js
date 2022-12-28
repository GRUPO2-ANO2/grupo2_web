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
            console.log(idEvent, "enrolled");
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
            data.uid = doc.id;
            const dateFinish = data.dateFinish.toDate();

            // Check if valid event
            if (dateFinish > Date.now()) {
                eventosValidos[arraySize] = data;
                arraySize++;
            }
        });
    });

    return eventosValidos;
}


// used to check wether a user owns an event(for editting/removing purposes)
async function userOwnsEvent(idEvent){
    await firebase.firestore().collection("eventos").doc(idEvent).get().then((doc) => {
		if (doc.exists){
			return doc.data().idGuia == currentUser.uid;
		} else{
            return false;
		}
	}).catch((error) => {
		console.log("userOwnsEvent():", error);
	});

    return false;
}

async function editEvent(idEvent, location, dateStart, dateFinish){
    var owns = await userOwnsEvent(idEvent);

    if (owns){
        await firebase.firestore().collection("eventos").doc(idEvent).update({
            location: location,
            dateStart: dateStart,
            dateFinish: dateFinish
        }).then(() => {
            console.log("edited");
        });
    } else {
        console.log("User doesnt own event");
    }
}

async function removeEvent(idEvent){
    var owns = await userOwnsEvent(idEvent);

    if (owns){
        await firebase.firestore().collection("eventos").doc(idEvent).delete().then(() => {
            console.log("removed");
        }).catch((error) => {
            console.log("removeEvent():", error);
        });
    } else {
        console.log("User doesnt own event");
    }
}

async function showEvents() {
    var events = await getValidEvents();

    // Get the card container element
    const cardContainer = document.getElementById('card-container');
  
    // Create a row element
    const row = document.createElement('div');
    row.className = 'row';
  
    // Create a card for each item
    for (let i = 0; i < events.length; i++) {

      // Create a column
      const col = document.createElement('div');
      col.className = 'col-6 mt-3';
  
      // Create the card
      const card = document.createElement('div');
      card.id = `card-${i}`;
      card.className = `fw-bolder`;
      card.innerHTML = `
        <div class="card h-100">
          <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
          <div class="card-body p-4 bg-dark">
            <div class="text-center text-white">
              <h5>${events[i].location}</h2>
            </div>
          </div>
          <div class="card-footer p-4 pt-0 border-top-0 bg-dark">
            <div class="text-center "><button class="btn btn-outline-light mt-auto text-white" onclick="joinEvent('${events[i].uid}')"">Entrar Evento</button>
          </div>
        </div>
      `;
  
      // Append the card to the column
      col.appendChild(card);
  
      // Append the column to the row
      row.appendChild(col);
    }
    // Append the row to the card container
    cardContainer.appendChild(row);
  }
  