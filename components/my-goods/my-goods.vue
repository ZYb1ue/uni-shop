<template>
	<view>
		<view class="goods-item">
			<!-- 左侧图片区域 -->
			<view class="goods-item-left">
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
		},
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
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
		margin-bottom: 5px;
		display: flex;
		border-bottom: 1px solid #FFC0CB;

		.goods-item-left {
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

			.goods-name {
				font-size: 13px;
			}

			.goods-info-box {
				.goods-price {
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>
