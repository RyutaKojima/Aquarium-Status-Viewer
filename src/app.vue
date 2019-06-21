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
			<tbody v-for="parameter of loadedRecords">
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
		data() {
			return {
				loadedRecords: [],
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
		components: {
			datePickerComponent,
			dataChart,
		},
		created() {
			this.refreshData(moment(this.fetchDate));
		},
		methods: {
			formatForDetectChange(momentObject) {
				return momentObject.format('YYYY-ww');
			},
			setFetchDate(value) {
				this.fetchDate = value;
				this.refreshData(moment(this.fetchDate));
			},
			async refreshData(targetDate) {
				this.loadedRecords = await this.loadFireStore(moment(targetDate));

				const chartLabel = [];
				const chartData = [];
				this.loadedRecords.forEach(param => {
					chartLabel.push(param.date);
					chartData.push(Number(param.water));
				});

				this.chartData = {
					labels: chartLabel,
					datasets: [{
						label: 'water templature',
						// backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: chartData,
					}]
				};
			},
			async loadFireStore(originFetchDate) {
				const conditionRef = firebase.firestore().collection("water_tank_condition");
				
				const fetchDate = originFetchDate.clone();
				const loadedRecords = [];
				const promises = [];
				const forDetectChange = this.formatForDetectChange(fetchDate);
				while (forDetectChange === this.formatForDetectChange(fetchDate)) {
					const promise = conditionRef.doc(fetchDate.format('YYYY-MM-DDTHH:mm')).get().then(doc => {
						const targetDate = moment(doc.id);
						const fields = doc.exists ? doc.data() : {};
						const water_temperature = fields.hasOwnProperty('water_temperature') ? fields.water_temperature : 0;
						const temperature = fields.hasOwnProperty('temperature') ? fields.temperature : 0;

						loadedRecords.push({
							date: targetDate.format('YYYY-MM-DD HH:mm'),
							water: water_temperature,
							temperature: temperature,
							humidity: 0,
						});
					});

					promises.push(promise);

					// 次の時間に進める
					fetchDate.add(1, 'hour');
				}

				await Promise.all(promises);

				return loadedRecords;
			},
		},
	};
</script>
<style>
</style>
