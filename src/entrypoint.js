document.addEventListener('DOMContentLoaded', () => {
    
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    // Initialize Cloud Firestore through Firebase
    const db = firebase.firestore();

    // データ追加
    // db.collection("users").add({
    //     first: "Ada",
    //     last: "Lovelace",
    //     born: 1815
    // })
    //     .then(function(docRef) {
    //         console.log("Document written with ID: ", docRef.id);
    //     })
    //     .catch(function(error) {
    //         console.error("Error adding document: ", error);
    //     });

    // 読み込み
    let parameters = [];
    const conditionRef = db.collection("water_tank_condition");
    conditionRef
        .where('date', '>=', '2019-06-01')
        .where('date', '<=', '2019-06-30')
        .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const documentId = doc.id;
            const fields = doc.data();

            console.log(`${documentId} => ${fields}`);
            console.log(fields);

            parameters.push({
                date: documentId,
                water: fields.water_temperature,
                temperature: fields.temperature,
                humidity: '???',
            });
        });
    });

    var app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!',
            parameters: parameters,
        }
    });
});
