<template>
	<p>
		<button type="button" v-on:click="previous">prev</button>
		{{ fetchDate }}
		<button type="button" v-on:click="next">next</button>
	</p>
</template>
<script>
	const moment = require('moment');

	export default {
		name: 'datePickerComponent',
		props: ['fetchDate'],
		methods: {
			previous: function() {
				// this.fetchDate.subtract(1, 'month');
				this.fetchDate = moment(this.fetchDate).subtract(1, 'month').format();
			},
			next: function() {
				// this.fetchDate.add(1, 'month');
				this.fetchDate = moment(this.fetchDate).add(1, 'month').format();
			},
		}
	};
</script>
<style scoped lang="sass">
</style>