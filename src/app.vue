<template>
	<div>
		<date-picker-component :fetch-date.sync="fetchDate" v-on:set-fetch-date="setFetchDate"></date-picker-component>

		<data-chart :chart-data="chartData" :options="chartOptions"></data-chart>

		<table>
			<thead>
			<th>日にち</th>
			<th>水温</th>
			<th>気温</th>
			<th>湿度</th>
			</thead>
			<tbody v-for="parameter of parameters">
			<td>{{parameter.date}}</td>
			<td>{{parameter.water}}</td>
			<td>{{parameter.temperature}}</td>
			<td>{{parameter.humidity}}</td>
			</tbody>
		</table>
	</div>
</template>
<script>
	import moment from 'moment';

	import datePickerComponent from './datePickerComponent'
	import dataChart from './dataChart'

	export default {
		data: function() {
			return {
				parameters: [],
				fetchDate: moment().startOf('week').format(),
				chartData : {},
				chartOptions: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true,
									min: 0,
									max: 40,
								}
							}
						]
					}
				},
			}
		},
		props: {
			options: {
				type: Object,
				default: null,
			}
		},
		components: {
			datePickerComponent,
			dataChart,
		},
		mounted () {
		},
		created: function() {
			this.loadFireStore(moment(this.fetchDate));
		},
		methods: {
			formatForDetectChange: momentObject => momentObject.format('YYYY-ww'),
			setFetchDate: function (value){
				this.fetchDate = value;
				this.loadFireStore(moment(this.fetchDate));
			},
			loadFireStore: function (originFetchDate) {
				const db = firebase.firestore();
				const conditionRef = db.collection("water_tank_condition");
				
				const fetchDate = originFetchDate.clone();
				const chartProtLabel = [];
				const chartProtData = [];
				this.parameters.length = 0;

				const poromises = [];
				const forDetectChange = this.formatForDetectChange(fetchDate);
				while (forDetectChange === this.formatForDetectChange(fetchDate)) {
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
	};
</script>
<style>
</style>
