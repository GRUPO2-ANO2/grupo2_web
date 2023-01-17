async function searchApiDocsByName(searchString) {
    return new Promise((resolve) => {
        var ref = firebase.firestore().collection("api");

        const query1 = ref.orderBy("name").startAt(searchString).endAt(searchString + "\uf8ff");
        const query2 = ref.orderBy("alternateNames").startAt(searchString).endAt(searchString + "\uf8ff");
        const allResults = [];

        query1.get().then(querySnapshot1 => {
            querySnapshot1.forEach(doc => {
                allResults.push(doc.data());
            });
            query2.get().then(querySnapshot2 => {
                querySnapshot2.forEach(doc => {
                    allResults.push(doc.data());
                });
                resolve(allResults);
            });
        });
    })
}

async function searchApiDocsByCountry(countryCode) {
    return new Promise((resolve) => {
        var ref = firebase.firestore().collection("api");
        const query = ref.where("country_code", "==", countryCode);
        const allResults = [];

        query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                allResults.push(doc.data());
            });
            resolve(allResults);
        });
    });
}