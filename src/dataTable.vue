<template>
	<table>
		<thead>
		<th>日にち</th>
		<th>水温</th>
		<th>気温</th>
		<th>湿度</th>
		</thead>
		<tbody v-for="record of loadedRecords">
		<td>{{record.date}}</td>
		<td>{{record.water}}</td>
		<td>{{record.temperature}}</td>
		<td>{{record.humidity}}</td>
		</tbody>
	</table>
</template>

<script>
	export default {
		name: "dataTable",
		props: {
			loadedRecords: {
				type: Array,
				default: null,
			}
		}
	}
</script>

<style scoped>

</style>