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
		props: {
			fetchDate: {
				type: Object,
				default: null,
			}
		},
		computed: {
			newFetchDate: {
				set(value){
					this.$emit('update:fetchDate', value);
				},
				get() {
					return this.fetchDate;
				},
			},
		},
		methods: {
			previous() {
				this.newFetchDate = this.fetchDate.subtract(1, 'week');
			},
			next() {
				this.newFetchDate = this.fetchDate.add(1, 'week');
			},
		},
	};
</script>
<style scoped lang="sass">
</style>