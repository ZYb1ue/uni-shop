<template>
	<view>
		<!-- 选择收货地址按钮 -->
		<view class="address-button" v-if="JSON.stringify(address) === '{}'">
			<button type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
		</view>
		<!-- 地址详细信息 -->
		<view class="address-box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1-left">
					<view class="username">
						收货人：{{address.userName}}
					</view>
				</view>
				<view class="row1-right">
					<view class="phone">
						电话：{{address.telNumber}}
					</view>
					<uni-icons type="right" size="16"></uni-icons>
				</view>

			</view>
			<view class="row2">
				<view class="row2-left">
					收货地址：
				</view>
				<view class="row2-right">
					{{addressDetail}}
				</view>
			</view>
		</view>

		<!-- 底部边框线的样式 -->
		<image src="@/static/cart_border@2x.png" class="bottom-image"></image>
	</view>
</template>

<script>
	export default {
		name: "my-address",
		data() {
			return {
				// 收货地址
				// cityName: "广州市"
				// countyName: "海珠区"
				// detailInfo: "新港中路397号"
				// errMsg: "chooseAddress:ok"
				// nationalCode: "510000"
				// postalCode: "510000"
				// provinceName: "广东省"
				// telNumber: "020-81167888"
				// userName: "张三"
				// address: {},
			};
		},
		methods: {
			// 添加收货地址
			async chooseAddress() {
				let [err, succ] = await uni.chooseAddress()
				if (err === null && succ.errMsg === "chooseAddress:ok") {
					// 请求收货地址未出错 将收货地址信息存储到 user 仓库中
					this.$store.commit("user/updateAddress", succ)
				}
			}
		},
		computed: {
			// user 仓库中 详细收货地址
			addressDetail() {
				return this.$store.getters["user/addressDetail"]
			},
			// user 仓库中 的收货地址信息
			address() {
				return this.$store.state.user.address
			}
		}
	}
</script>

<style lang="scss">
	.address-button {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	// 底部边框线的样式
	.bottom-image {
		display: block;
		width: 100%;
		height: 5px;
	}

	.address-box {
		height: 90px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;

		.row1 {
			margin-bottom: 15px;
			display: flex;
			justify-content: space-between;

			.row1-left {
				.username {
					font-size: 12px;
				}

			}

			.row1-right {
				display: flex;

				.phone {
					margin-right: 10px;
					font-size: 12px;
				}
			}
		}

		.row2 {
			display: flex;
			align-items: center;

			.row2-left {
				font-size: 12px;
				// 文本不换行
				white-space: nowrap
			}

			.row2-right {
				font-size: 12px;
			}
		}
	}
</style>
