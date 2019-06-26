<template>
	<div>
		<date-picker-component :fetch-date.sync="nowDate"></date-picker-component>
		<data-chart :chart-data="chartData" :options="chartOptions"></data-chart>
		<data-table :loaded-records="loadedRecords"></data-table>
	</div>
</template>
<script>
	import moment from 'moment';

	import dataTable from './dataTable'
	import datePickerComponent from './datePickerComponent'
	import dataChart from './dataChart'

	export default {
		name: 'dashboard',
		data() {
			return {
				loadedRecords: [],
				fetchDate: null,
				chartData : {},
				chartOptions: {
					responsive: true,
					maintainAspectRatio: false,
					/*
					scales: {
						yAxes: [
							{
								id: 'y-axis-temperature',
								position: 'left',
								ticks: {
									beginAtZero: true,
									min: 10,
									max: 40,
								}
							},
							{
								id: 'y-axis-percent',
								position: 'right',
								ticks: {
									beginAtZero: true,
									min: 20,
									max: 80,
								}
							},
						]
					}
					*/
				},
			}
		},
		created() {
			this.nowDate = moment().startOf('week');
		},
		components: {
			dataTable,
			datePickerComponent,
			dataChart,
		},
		computed: {
			nowDate: {
				get() {
					return this.fetchDate;
				},
				set(value) {
					this.fetchDate = value;
					this.refreshData(this.fetchDate);
				}
			},
		},
		methods: {
			formatForDetectChange(momentObject) {
				return momentObject.format('YYYY-ww');
			},
			async refreshData(targetDate) {
				this.loadedRecords = await this.loadFireStore(moment(targetDate));

				const chartLabel = [];
				const chartWaterTemp = [];
				const chartTemp = [];
				const chartHumidity = [];
				this.loadedRecords.forEach(param => {
					chartLabel.push(param.date);
					chartWaterTemp.push(Number(param.water));
					chartTemp.push(Number(param.temperature));
					chartHumidity.push(Number(param.humidity));
				});

				this.chartData = {
					labels: chartLabel,
					datasets: [
						{
							label: '水温(℃)',
							// backgroundColor: 'rgb(255, 99, 132)',
							borderColor: 'rgb(138,78,255)',
							// yAxisID: 'y-axis-temperature',
							data: chartWaterTemp,
						},
						{
							label: '気温(℃)',
							// backgroundColor: 'rgb(255, 99, 132)',
							borderColor: 'rgb(255,152,17)',
							// yAxisID: 'y-axis-temperature',
							data: chartTemp,
						},
						{
							label: '湿度(%)',
							// backgroundColor: 'rgb(255, 99, 132)',
							borderColor: 'rgb(36,255,161)',
							// yAxisID: 'y-axis-percent',
							data: chartHumidity,
						},
					]
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
						const temperature = fields.hasOwnProperty('temperature') ? parseFloat(fields.temperature) : 0;
						const humidity = fields.hasOwnProperty('humidity') ? parseFloat(fields.humidity) : 0;

						loadedRecords.push({
							date: targetDate.format('YYYY-MM-DD HH:mm'),
							water: water_temperature,
							temperature: temperature,
							humidity: humidity,
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
