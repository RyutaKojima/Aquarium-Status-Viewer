const moment = require('moment');

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
    const parameters = [];
    const conditionRef = db.collection("water_tank_condition");

    const fetchDate = moment().startOf('date');
    const formatForDetectChange = momentObject => momentObject.format('YYYY-MM-DD');
    // const fetchDate = moment().startOf('month');
    // const formatForDetectChange = momentObject => momentObject.format('YYYY-MM');
    
    const forDetectChange = formatForDetectChange(fetchDate);
    while (forDetectChange === formatForDetectChange(fetchDate)) {
        console.log(fetchDate.format('YYYY-MM-DDTHH:mm'));

        conditionRef
            .doc(fetchDate.format('YYYY-MM-DDTHH:mm'))
            // .where('date', '==', fetchDate.format('YYYY-MM-DD'))
            // .where('time', '==', fetchDate.format('HH:mm'))
            .get().then((doc) => {
                const documentId = doc.id;
                const fields = doc.exists ? doc.data() : {};
                const nowDate = moment(documentId);

                // console.log(`${documentId} => ${fields}`);
                // console.log(fields);

                parameters.push({
                    date: nowDate.format('YYYY-MM-DD HH:mm'),
                    water: fields.hasOwnProperty('water_temperature') ? fields.water_temperature : 0,
                    temperature: fields.hasOwnProperty('temperature') ? fields.temperature : 0,
                    humidity: 0,
                });
            });

        // 次の時間に進める
        fetchDate.add(1, 'hour');
    }
    console.log(fetchDate.format());
    
    // conditionRef
    //     .where('date', '>=', '2019-06-12')
    //     .where('date', '<=', '2019-06-12')
    //     .where('time', '==', 'xx:00')
    //     .get().then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         const documentId = doc.id;
    //         const fields = doc.data();
    //
    //         console.log(`${documentId} => ${fields}`);
    //         console.log(fields);
    //
    //         parameters.push({
    //             date: documentId,
    //             water: fields.water_temperature,
    //             temperature: fields.temperature,
    //             humidity: '???',
    //         });
    //     });
    // });

    const app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!',
            parameters: parameters,
        }
    });
});
