<template>
	<view class="my-container">
		<!-- 登录组件（无 token 显示） -->
		<my-login v-if="!token"></my-login>
		<!-- 用户信息组件（有token 显示） -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	// 引入 mixin（混入）中 tabbar-badge
	import tabbarBadge from "../../mixin/tabbar-badge"
	export default {
		data() {
			return {

			};
		},
		computed: {
			// 映射 user 仓库 中的 token 信息
			...mapState("user", ["token"])
		},
		mixins: [tabbarBadge]
	}
</script>

<style lang="scss">
	// 微信小程序 每个 tab 的根节点都是 page 
	page,
	.my-container {
		height: 100%;
	}
</style>
