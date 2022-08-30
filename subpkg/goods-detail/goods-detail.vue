<template>
	<!-- 防止页面闪烁（在数据请求回来后再显示） -->
	<view v-show="goodsInfo.goods_name" class="goods-detail-container">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="pic,index in goodsInfo.pics" :key="pic.pics_id">
				<image :src="pic.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<view class="goods-info-box">
			<view class="goods-price">
				￥{{goodsInfo.goods_price}}
			</view>
			<view class="goods-detail">
				<view class="goods-describe">
					{{goodsInfo.goods_name}}
				</view>
				<view class="collect">
					<uni-icons color="gray" type="star" size="18"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<text class="goods-freight">
				快递 ：免运费
			</text>
		</view>
		<!-- 商品描述 富文本 -->
		<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>

		<!-- 商品导航（需要吸底效果） -->
		<view class="goods-nar">
			<!-- 
				:fill="true"  :按钮是否平铺
				:options="options" 组件参数 (Array)   左边按钮组
					text 显示文字
					icon 图标
					info 右上角数字角标(Number) 默认值为0
					infoBackgroundColor 角标背景色
					infoColor 角标前景色
				:buttonGroup="buttonGroup" 组件按钮组参数（Array）  右边按钮组
					text 按钮文字
					backgroundColor 按钮背景色
					color 字体颜色
				@click="onClick"  左侧点击事件  返回值：e = {index,content}
				@buttonClick="buttonClick" />  右侧按钮组点击事件 返回值：e = {index,content}
			-->
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品详情信息
				goodsInfo: {},
				// 商品导航信息
				// 左边 类型按钮（有几个对象就有几个按钮）
				options: [{
					icon: 'shop',
					text: '店铺',
					// info: 2,
					infoBackgroundColor: '#007aff',
					infoColor: "red"
				}, {
					icon: 'cart',
					text: '购物车',
					info: 2
				}],
				// 右边 类型按钮（有几个对象就有几个按钮）
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			};
		},
		onLoad(option) {
			// 存储传递的 参数 goods_id = option.goods_id
			this.getGoodsDetail(option.goods_id)
		},
		methods: {
			// 请求商品详情的 网络请求函数
			async getGoodsDetail(goods_id) {
				let results = await uni.$http.get("/api/public/v1/goods/detail", {
					goods_id: goods_id
				})
				let data = results.data
				if (data.meta.status !== 200) return uni.$showMsg() //请求失败
				// 请求成功存储数据
				// 对 数据 中的 goods_introduce 数据 通过replace进行改造（/g表示全局替换） 方便更好的展示
				data.message.goods_introduce = data.message.goods_introduce.replace(/<img /g,
					'<img style="display: block;"')

				this.goodsInfo = data.message
			},
			// 点击轮播图 图片 进行预览
			preview(index) {
				uni.previewImage({
					// Array.<string>  需要预览的图片链接列表
					// map() 方法创建一个新数组，
					// 这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
					urls: this.goodsInfo.pics.map((url) => {
						return url.pics_big
					}),
					// 当前显示图片的链接
					// current:this.goodsInfo.pics[index].pics_big,
					//  或者 预览时，默认显示图片的索引
					current: index
				})
			},
			// 点击商品导航的回调函数
			// 左侧
			onClick(e) {
				console.log(e);
				if(e.content.text=="购物车"){
					// 点击购物车按钮 跳转到cart页面
					uni.switchTab({
						url:"/pages/cart/cart"
					})
				}
			},
			// 右侧
			buttonClick(e) {
				console.log(e)
				this.options[2].info++
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.goods-info-box {
		padding: 0px 10px;

		.goods-price {
			margin: 10px 0px;
			color: #e00000;
			font-size: 18px;
		}

		.goods-detail {
			display: flex;
			justify-content: space-between;

			.goods-describe {
				margin-right: 10px;
				font-size: 13px;
			}

			.collect {
				display: flex;
				flex-direction: column;
				width: 120px;
				font-size: 12px;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray
			}
		}

		.goods-freight {
			display: block;
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}

	// 整个大容器
	.goods-detail-container {
		padding-bottom: 50px;
		// 商品导航
		.goods-nar {
			// 吸底效果 方式一：
			// position: sticky;
			// bottom: 0;
			// 方式二
			// 生成绝对定位的元素，相对于浏览器窗口进行定位。元素的位置通过 “left”, “top”, “right” 以及 “bottom” 属性进行规定。
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;

		}
	}
</style>
