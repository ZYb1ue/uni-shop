<template>
	<view>
		<!-- 轮播图区域 -->
		<!-- 
			:indicator-dots="true" 显示小圆点
			:autoplay="true" 自动播放
			:interval="3000" 时间间隔
			:duration="1000" 持续时间
			:circular="true" 滑动衔接
		-->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="swiper in swiperList" :key="swiper.goods_id">
				<navigator class="swiper-item" :url="`/subpkg/goods-detail/goods-detail?goods_id=${swiper.goods_id}`">
					<image :src="swiper.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>

		<!-- 分类导航区域 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(nav, i) in navList" :key="i" @click="navClickHandler(nav)">
				<image :src="nav.image_src" class="nav-img"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<!-- 楼层 item 项 -->
			<view class="floor-item" v-for="(item, i) in floorList" :key="i">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧大盒子图片 -->
					<navigator :url="item.product_list[0].url" class="left-img-box">
						<!-- mode="widthFix" 宽度不变高度自适应 -->
						<image :src="item.product_list[0].image_src"
							:style="{width:item.product_list[0].image_width+'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧包裹4张图片的盒子 -->
					<view class="right-img-box">
						<!-- 图片小盒子 -->
						<!-- 通过v-if控制索引为0图片不显示 -->
						<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2"
							v-if="i2!==0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width:item2.image_width+'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 1. 轮播图的数据列表，默认为空数组
				swiperList: [],
				// 2. 分类导航的数据列表
				navList: [],
				// 3.楼层的数据列表
				floorList: [],
			};
		},
		// 页面加载执行一次
		onLoad() {
			// 获取轮播图数据
			this.getSwiperList()
			// 获取分类导航的数据
			this.getNavList()
			// 获取楼层数据
			this.getFloorList()
		},
		methods: {
			// 获取轮播图数据的函数
			async getSwiperList() {
				let results = await uni.$http.get("/api/public/v1/home/swiperdata")
				if (results.data.meta.status !== 200) {
					// 请求失败，提醒用户,结束逻辑
					// return uni.$showMsg("数据！！！！",3000)  // 可以自定义提示内容
					return uni.$showMsg()
				}
				// 请求成功，存储数据 ，提示用户数据请求成功
				this.swiperList = results.data.message
				return uni.$showMsg("数据请求成功")
			},
			// 获取分类导航数据的函数
			async getNavList() {
				let results = await uni.$http.get("/api/public/v1/home/catitems")
				if (results.data.meta.status !== 200) {
					// 请求失败，提醒用户,结束逻辑
					return uni.$showMsg()
				}
				// 请求成功，存储数据，提示用户数据请求成功
				this.navList = results.data.message
				return uni.$showMsg("数据请求成功")
			},
			// 点击 分类导航，跳转到分类页面
			navClickHandler(nav) {
				// 判断点击的是哪一项
				if (nav.name == "分类") {
					// 如果是 分类 跳转到 分类页面
					uni.switchTab({
						url: "/pages/cate/cate"
					})
					return
				}
			},
			// 获取楼层数据
			async getFloorList() {
				let results = await uni.$http.get("/api/public/v1/home/floordata")
				if (results.data.meta.status !== 200) {
					// 请求失败，提醒用户,结束逻辑
					return uni.$showMsg()
				}
				// 请求成功，存储数据，提示用户数据请求成功
				// 处理数据
				results.data.message.forEach((item) => {
					item.product_list.forEach((item2) => {
						item2.url = `/subpkg/goods_list/goods_list?${
							item2.navigator_url.split("?")[1]
						}`
					})
				})
				this.floorList = results.data.message
				return uni.$showMsg("数据请求成功")
			},

		}
	}
</script>

<style lang="scss">
	// 轮播图样式
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	// 分类导航
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	// 楼层
	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}

	.right-img-box {
		display: flex;
		// 允许换行
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
