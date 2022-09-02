<template>
	<view>
		<view class="goods-item">
			<!-- 左侧图片区域 -->
			<view class="goods-item-left">
				<!-- 添加 radio 通过是否传递props isShowRadio(默认是false) 来控制显示或隐藏 -->

				<radio :checked="goods.goods_state" color="#FFC0CB" v-if="isShowRadio" @click="radioChangeHandler" />

				<!-- 没有图片的 使用默认图片 -->
				<image :src="goods.goods_small_logo || defaultPic" class="goods-picture"></image>
			</view>
			<!-- 右侧商品信息区域 -->
			<view class="goods-item-right">
				<!-- 商品标题 -->
				<view class="goods-name">
					{{goods.goods_name}}
				</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">
						<!-- ￥{{goods.goods_price}}.00 -->
						<!-- 使用过滤器（添加两位小数点） -->
						￥{{goods.goods_price | tofixed}}
					</view>
					<!-- isShowNumber(默认是false) 来控制显示或隐藏 -->
					<view class="goods-number" v-if="isShowNumber">
						<!-- @change 输入框值改变时触发的事件，参数为输入框当前的 value -->
						<uni-number-box :min="1" :max="9" v-model="goods.goods_count" @change="bindChange">
						</uni-number-box>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-goods",
		props: {
			goods: {
				type: Object,
				defaul: {},
			},
			isShowRadio: {
				type: Boolean,
				defaul: false,
			},
			isShowNumber: {
				type: Boolean,
				defaul: false,
			}
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			}
		},
		methods: {
			// 通过点击 radio 触发 radioChangeHandler 回调函数 然后在回调里触发父组件绑定的自定义事件 
			radioChangeHandler() {
				this.$emit("radio-change", {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			// 输入框值改变时触发的事件，参数为输入框当前的 value
			bindChange(val) {
				// val 是改变后的 商品购买数量
				// 触发 父组件绑定的自定义事件 numberChange
				this.$emit("numberChange", {
					goods_id: this.goods.goods_id,
					goods_count: val
				})
			}
		},
		// 过滤器
		filters: {
			tofixed(num) {
				// 将传入的 参数 转化为数值类型 然后保留两位小数点
				return Number(num).toFixed(2)
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		margin-top: 5px;
		display: flex;
		border-bottom: 1px solid #FFC0CB;

		.goods-item-left {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-picture {
				width: 100px;
				height: 100px;
				display: block;
				padding: 5px;
			}
		}

		.goods-item-right {
			padding: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			flex: 1;

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.goods-price {
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>
