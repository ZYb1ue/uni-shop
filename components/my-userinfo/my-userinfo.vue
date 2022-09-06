<template>
	<!-- 用户信息容器 -->
	<view class="userinfo-container">
		<!-- 用户头像和昵称盒子 -->
		<view class="userinfo-box">
			<image :src="userinfo.avatarUrl" class="userinfo-avatar"></image>
			<view class="userinfo-name">{{userinfo.nickName}}</view>
		</view>
		<!-- 用户应用信息面板 -->
		<view class="userinfo-panel-container">
			<!-- 面板一：收藏店铺 、 收藏商品 、 关注商品、足迹 -->
			<view class="panel">
				<view class="panel-body">
					<view class="panel-item">
						<view class="panel-item-number">
							15
						</view>
						<view class="panel-item-text">
							收藏店铺
						</view>
					</view>
					<view class="panel-item">
						<view class="panel-item-number">
							17
						</view>
						<view class="panel-item-text">
							收藏商品
						</view>
					</view>
					<view class="panel-item">
						<view class="panel-item-number">
							20
						</view>
						<view class="panel-item-text">
							关注商品
						</view>
					</view>
					<view class="panel-item">
						<view class="panel-item-number">
							70
						</view>
						<view class="panel-item-text">
							足迹
						</view>
					</view>
				</view>
			</view>

			<!-- 面板二 -->
			<view class="panel">
				<view class="panel-title">
					我的订单
				</view>
				<view class="panel-body">
					<view class="panel-item">
						<image src="../../static/my-icons/icon1.png" class="panel-item-icon"></image>
						<view class="panel-item-text">
							待付款
						</view>
					</view>
					<view class="panel-item">
						<image src="../../static/my-icons/icon2.png" class="panel-item-icon"></image>
						<view class="panel-item-text">
							待收货
						</view>
					</view>
					<view class="panel-item">
						<image src="../../static/my-icons/icon3.png" class="panel-item-icon"></image>

						<view class="panel-item-text">
							退款/退货
						</view>
					</view>
					<view class="panel-item">
						<image src="../../static/my-icons/icon4.png" class="panel-item-icon"></image>
						<view class="panel-item-text">
							全部订单
						</view>
					</view>
				</view>
			</view>

			<!-- 面板三 -->
			<view class="panel">
				<view class="panel-three-item">
					<view class="panel-three-body">
						<view class="panel-three-text">
							收货地址
						</view>
						<uni-icons type="right" size="20"></uni-icons>
					</view>
				</view>

				<view class="panel-three-item">
					<view class="panel-three-body">
						<view class="panel-three-text">
							联系客服
						</view>
						<uni-icons type="right" size="20"></uni-icons>
					</view>
				</view>

				<view class="panel-three-item">
					<view class="panel-three-body" @click="logout">
						<view class="panel-three-text">
							退出登录
						</view>
						<uni-icons type="right" size="20"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex"
	export default {
		name: "my-userinfo",
		data() {
			return {

			};
		},
		computed: {
			// 映射 user 仓库中 的 userinfo
			...mapState("user", ["userinfo"])
		},
		methods: {
			// 退出登录
			async logout() {
				// 先弹框 让用户 确定是否退出登录
				let [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认退出登录吗？',
				}).catch(err => err)
				console.log(err);
				console.log(succ);
				if (succ && succ.confirm) {
					// 用户确认 退出登录
					// 清空 user仓库中 token address userinfo
					this.updateAddress({})
					this.updateUserInfo({})
					this.updateToken("")
				}
			},
			// 映射 user 仓库中的 updateAddress updateUserInfo updateToken (用于清空本地存储)
			...mapMutations("user", ["updateAddress", "updateUserInfo", "updateToken"])
		}
	}
</script>

<style lang="scss">
	.userinfo-container {
		height: 100%;
		background-color: #DCDCDC;

		.userinfo-box {
			height: 450rpx;
			width: 100%;
			background-color: #FFC0CB;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.userinfo-avatar {
				display: block;
				width: 200rpx;
				height: 200rpx;
				border-radius: 100px;
				border: 2px solid white;
				// 阴影
				box-shadow: 1px 1px 2px black
			}

			.userinfo-name {
				margin-top: 15px;
				color: white;
				font-size: 16px;
				font-weight: bold;
			}
		}

		.userinfo-panel-container {
			padding: 0px 10px;
			position: relative;
			top: -10px;

			.panel {
				background-color: #ffffff;
				border-radius: 5px;
				margin-bottom: 10px;

				.panel-title {
					font-size: 16px;
					padding: 10px;
					border-bottom: 1px solid #f4f4f4;
					margin-bottom: 10px;

				}

				.panel-three-item {
					padding: 10px;
					border-bottom: 1px solid #f4f4f4;

					.panel-three-body {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.panel-three-text {
							font-size: 15px;
						}
					}
				}

				.panel-body {
					display: flex;
					justify-content: space-around;

					.panel-item {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						font-size: 13px;

						.panel-item-number {
							margin: 5px 0px;
						}

						.panel-item-text {
							margin-bottom: 5px;
						}

						.panel-item-icon {
							margin: 5px 0px;
							width: 40px;
							height: 40px
						}
					}
				}
			}
		}
	}
</style>
