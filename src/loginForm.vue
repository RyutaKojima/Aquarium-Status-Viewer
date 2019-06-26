<template>
	<div>
		loginしてね
		<button v-on:click="login">Google Login</button>
	</div>
</template>

<script>
	export default {
		name: "loginForm",
		props: {
			isLogIn: Boolean,
		},
		computed: {
			newIsLogIn: {
				set(value){
					this.$emit('update:isLogIn', value);
				},
				get() {
					return this.isLogIn;
				}
			},
		},
		methods: {
			login() {
				// console.log('ログインします！！');
				var provider = new firebase.auth.GoogleAuthProvider();
				firebase.auth().useDeviceLanguage();
				firebase.auth().signInWithPopup(provider).then((result) => {
					// This gives you a Google Access Token. You can use it to access the Google API.
					var token = result.credential.accessToken;
					// The signed-in user info.
					var user = result.user;
					// ...
					// console.log('ログイン成功！');
					// console.log(token);
					// console.log(user);

					this.newIsLogIn = true;

				}).catch((error) => {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					// The email of the user's account used.
					var email = error.email;
					// The firebase.auth.AuthCredential type that was used.
					var credential = error.credential;
					// ...
					console.error('ログイン失敗');
					console.error(errorMessage);
				});
			},
		},
	}
</script>

<style scoped>

</style>