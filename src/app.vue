<template>
	<dashboard v-if="isLogIn"></dashboard>
	<loginForm v-else :is-log-in.sync="isLogIn"></loginForm>
</template>
<script>
	import dashboard from './dashboard'
	import loginForm from './loginForm'

	export default {
		data() {
			return {
				isLogIn: false,
			};
		},
		components: {
			dashboard,
			loginForm,
		},
	};
</script>
<style>
</style>
