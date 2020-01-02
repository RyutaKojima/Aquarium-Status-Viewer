<template>
	<v-content>
		<v-container
				class="fill-height"
				fluid
		>
			<v-row
					align="center"
					justify="center"
			>
				<v-col
						cols="12"
						sm="8"
						md="4"
				>
					<v-card class="elevation-12">
						<v-toolbar
								color="primary"
								dark
								flat
						>
							<v-toolbar-title>Login form</v-toolbar-title>
							<v-spacer/>
						</v-toolbar>
						<v-card-text>
							<v-form>
								<v-text-field
										label="Login"
										name="login"
										prepend-icon="person"
										type="text"
								/>

								<v-text-field
										id="password"
										label="Password"
										name="password"
										prepend-icon="lock"
										type="password"
								/>
							</v-form>
						</v-card-text>
						<v-card-actions>
							<v-spacer/>
							<v-btn color="primary" v-on:click="login">Google Login</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</v-content>
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