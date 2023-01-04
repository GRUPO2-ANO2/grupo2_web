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

async function getEventsByUser(){
    return new Promise(async (resolve, reject) => {
        var events = [];
        var eventCount = 0;
        var enrolled = false;
        var data;

        const querySnapshot = await firebase.firestore().collection("eventosUtilizadores").get();
        for (const doc of querySnapshot.docs) {
            data = doc.data();
            const docIdEvento = data.idEvento;
            const docIdUtilizador = data.idUtilizador;

            // If user in document same as logged in
            if (docIdUtilizador == currentUser.uid){
                enrolled = await userIsEnrolledInEvent(docIdEvento);
                // And if enrolled, add event
                if(enrolled){   
                    const docE = await firebase.firestore().collection("eventos").doc(docIdEvento).get();
                    if (docE.exists){
                        events[eventCount] = docE.data();
                        events[eventCount].uid = docE.id;
                        eventCount++;
                    }
                }
            }
        }
        resolve(events);
    });
}


async function showEventsByUser() {
    const events = await getEventsByUser();
    console.log(events.length);

    // Get the card container element
    const cardContainer = document.getElementById('card-container');

    // Create a row element
    const row = document.createElement('div');
    row.className = 'row';

    // Create a card for each item
    for (let i = 0; i < events.length; i++) {

      // Create a column
      const col = document.createElement('div');
      col.className = 'col-4 mt-3';

      // Create the card
      const card = document.createElement('div');
      card.id = `card-${i}`;
      card.className = `fw-bolder`;
      card.innerHTML = `
        <div class="card h-100">
          <img class="card-img-top" src="${events[i].image}" alt="..." />
          <div class="card-img-overlay">
            <div class="text-center text-white">
              <h5>${events[i].location}</h2>
            </div>
          </div>
        </div>
        `;

      // Append the card to the column
      col.appendChild(card);

      // Append the column to the row
      row.appendChild(col);

      const modalContainer = document.getElementById('modal-container');

      // Create the modal element
      const modal = document.createElement('div');
        modal.className = `modal-content`;
        modal.innerHTML = `
        <div class="card">
          <div class="modal" id="modal-${events[i].uid}" tabindex="-1" aria-labelledby="modal-${events[i].uid}" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
              <div class="modal-content bg-dark text-white">
                <div class="modal-header border-0">
                  <button class="btn-close" type="button" onclick="hideModal('modal-${events[i].uid}');" aria-label="Close"></button>
                </div>
                <div class="modal-body pb-5">
                  <div class="row justify-content-center text-center">
                    <div class="col-lg-8">
                      <h5 class="modal-title text-secondary text-uppercase mb-0 text-center">${events[i].location}</h5>
                      <img class="img-fluid rounded mb-5" style="margin-top: 20px;" src="${events[i].image}" />
                      <div class="row">
                        <div class="col-md-4">
                          <h5>Localização</h5>
                          <p>${events[i].location}</p>
                          <h5>Data Inicio</h5>
                          <p>${events[i].dateStart}</p>
                          <h5>Data Fim</h5>
                          <p>${events[i].dateFinish}</p>
                        </div>
                        <div class="col-md-8 ms-auto">
                          <h5>Descrição</h5>
                          <p>${events[i].description}</p>
                        </div>
                      </div>
                      <div class="row d-grid gap-2 col-6 mx-auto">
                        <button class="btn btn-sm btn-success" style="margin-top: 20px;" onclick="joinEvent('${events[i].uid}')">
                          <i class="fas fa-xmark fa-fw"></i> Entrar </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;      

        // Append the modal to the document body
        modalContainer.appendChild(modal);


        // Add an event listener to the card that opens the modal when clicked
        card.addEventListener('click', function() {
            var modalElement = document.getElementById(`modal-${events[i].uid}`);
            modalElement.style.display = 'block';
        });
    }

    // Append the row to the card container
    cardContainer.appendChild(row);
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
            if (isValidDate(dateFinish)) {
                eventosValidos[arraySize] = data;
                arraySize++;
            }
        });
    });

    return eventosValidos;
}

function isValidDate(date){
    return date > Date.now();
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
      col.className = 'col-4 mt-3';

      // Create the card
      const card = document.createElement('div');
      card.id = `card-${i}`;
      card.className = `fw-bolder`;
      card.innerHTML = `
        <div class="card h-100">
          <img class="card-img-top" src="${events[i].image}" alt="..." />
          <div class="card-img-overlay">
            <div class="text-center text-white">
              <h5>${events[i].location}</h2>
            </div>
          </div>
        </div>
        `;

      // Append the card to the column
      col.appendChild(card);

      // Append the column to the row
      row.appendChild(col);

      const modalContainer = document.getElementById('modal-container');

      // Create the modal element
      const modal = document.createElement('div');
        modal.innerHTML = `
        <div class="modal" id="modal-${events[i].uid}" tabindex="-1" aria-labelledby="modal-${events[i].uid}" aria-hidden="true" onload="hideModal('modal-${events[i].uid}');">
            <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
                <div class="modal-content bg-dark text-white">
                    <div class="modal-header border-0">
                        <button class="btn-close" type="button" onclick="hideModal('modal-${events[i].uid}');" aria-label="Close"></button>
                    </div>
                    <div class="modal-body pb-5">
                        <div class="row justify-content-center text-center">
                            <div class="col-lg-8">
                                <h5 class="modal-title text-secondary text-uppercase mb-0 text-center">${events[i].location}</h5>
                                <img class="img-fluid rounded mb-5" style="margin-top: 20px;" src="${events[i].image}" />
                                <div class="row">
                                    <div class="col-md-4">
                                        <h5>Localização</h5>
                                        <p>${events[i].location}</p>
                                        <h5>Data Inicio</h5>
                                        <p>${events[i].dateStart}</p>
                                        <h5>Data Fim</h5>
                                        <p>${events[i].dateFinish}</p>
                                    </div>
                                <div class="col-md-8 ms-auto">
                                    <h5>Descrição</h5>
                                    <p>${events[i].description}</p>
                                </div>
                                <div class="row d-grid gap-2 col-6 mx-auto">
                                    <button class="btn btn-sm btn-success" style="margin-top: 20px;" onclick="joinEvent('${events[i].uid}')">
                                        <i class="fas fa-xmark fa-fw"></i> Entrar 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;      
        // Append the modal to the document body
        modalContainer.appendChild(modal);


        // Add an event listener to the card that opens the modal when clicked
        card.addEventListener('click', function() {
            var modalElement = document.getElementById(`modal-${events[i].uid}`);
            modalElement.style.display = 'block';
        });

    }

    // Append the row to the card container
    cardContainer.appendChild(row);
}

