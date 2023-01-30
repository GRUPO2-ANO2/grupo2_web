async function getApiDocById(id) {
    return new Promise((resolve, reject) => {
        var ref = firebase.firestore().collection("api");
        ref.doc(id).get()
            .then(doc => {
                if (!doc.exists) {
                    reject("Documento não existe");
                }
                resolve(doc.data());
            })
            .catch(error => {
                reject(error);
            });
    });
}

async function searchApiDocsByName(searchString, limit = 10) {
    return new Promise((resolve) => {
        var ref = firebase.firestore().collection("api");

        const query1 = ref.orderBy("name").startAt(searchString).endAt(searchString + "\uf8ff").limit(limit);
        const query2 = ref.orderBy("alternateNames").startAt(searchString).endAt(searchString + "\uf8ff").limit(limit);
        const allResults = [];

        query1.get().then(querySnapshot1 => {
            querySnapshot1.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                allResults.push(data);
            });
            query2.get().then(querySnapshot2 => {
                querySnapshot2.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    allResults.push(data);
                });
                resolve(allResults);
            });
        });
    })
}

async function searchApiDocsByCountry(countryCode, limit = 10) {
    return new Promise((resolve) => {
        var ref = firebase.firestore().collection("api");
        const query = ref.where("country_code", "==", countryCode).limit(limit);
        const allResults = [];

        query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                const data = doc.data();
                data.id = doc.id;
                allResults.push(data);
            });
            resolve(allResults);
        });
    });
}
