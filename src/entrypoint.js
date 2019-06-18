import Vue from 'vue'
import moment from 'moment';

import datePickerComponent from './datePickerComponent'
import dataChart from './dataChart'

Vue.config.devtools = true;

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

    // const fetchDate = moment().startOf('date');
    // const formatForDetectChange = momentObject => momentObject.format('YYYY-MM-DD');
    // const fetchDate = moment().startOf('month');
    const fetchDate = moment().startOf('week');
    const formatForDetectChange = momentObject => momentObject.format('YYYY-ww');

    const app = new Vue({
        el: '#app',
        data: {
            parameters: parameters,
            fetchDate: fetchDate.format(),
            chartData : {},
            chartOptions: {
                responsive: true,
            },
        },
        components: {
            datePickerComponent,
            dataChart,
        },
        created: function() {
            this.loadFireStore(fetchDate);
        },
        methods: {
            setFetchDate: function (value){
                this.fetchDate = value;
                this.loadFireStore(moment(this.fetchDate));
            },
            loadFireStore: function (originFetchDate) {
                const fetchDate = originFetchDate.clone();
                const chartProtLabel = [];
                const chartProtData = [];
                this.parameters.length = 0;

                const poromises = [];
                const forDetectChange = formatForDetectChange(fetchDate);
                while (forDetectChange === formatForDetectChange(fetchDate)) {
                    const promise = conditionRef
                        .doc(fetchDate.format('YYYY-MM-DDTHH:mm'))
                        // .where('date', '==', fetchDate.format('YYYY-MM-DD'))
                        // .where('time', '==', fetchDate.format('HH:mm'))
                        .get().then((doc) => {
                        const documentId = doc.id;
                        const fields = doc.exists ? doc.data() : {};
                        const nowDate = moment(documentId);
                        
                        const water_temperature = fields.hasOwnProperty('water_temperature') ? fields.water_temperature : 0;

                        this.parameters.push({
                            date: nowDate.format('YYYY-MM-DD HH:mm'),
                            water: water_temperature,
                            temperature: fields.hasOwnProperty('temperature') ? fields.temperature : 0,
                            humidity: 0,
                        });

                        chartProtLabel.push(nowDate.format('YYYY-MM-DD HH:mm'));
                        chartProtData.push(Number(water_temperature));
                    });

                    poromises.push(promise);

                    // 次の時間に進める
                    fetchDate.add(1, 'hour');
                }
                
                Promise.all(poromises).then(() => {
                    this.chartData = {
                        labels: chartProtLabel,
                        datasets: [{
                            label: 'water templature',
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: chartProtData,
                        }]
                    };
                });
            },
        },
    });
});
