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
		computed: {
			newFetchDate: {
				set(value){
					if (value === this.fetchDate) return;
					this.$emit('set-fetch-date', value);
					// this.$emit('update:fetchDate', value);
				},
				get() {
					return this.fetchDate;
				},
			},
		},
		methods: {
			previous: function() {
				// this.fetchDate.subtract(1, 'month');
				// this.newFetchDate = moment(this.fetchDate).subtract(1, 'month').format();
				this.newFetchDate = moment(this.fetchDate).subtract(1, 'week').format();
			},
			next: function() {
				// this.fetchDate.add(1, 'month');
				// this.newFetchDate = moment(this.fetchDate).add(1, 'month').format();
				this.newFetchDate = moment(this.fetchDate).add(1, 'week').format();
			},
		},
	};
</script>
<style scoped lang="sass">
</style>