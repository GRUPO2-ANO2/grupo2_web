
async function createEvento(){
    var isGuia = await userIsGuia()
    
    if(isGuia == 1){
        await firebase.firestore().collection("eventos").add({
            idGuia: currentUser.uid,
            date: null,
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