<template>
	<view>
		<view class="goods-list">
			<view v-for="goods,index in  goodsList" :key="goods.goods_id" @click="gotoDetail(goods)">
				<my-goods :goods="goods"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 网络请求 商品列表数据 时需要携带的参数对象
				queryObj: {
					query: "",
					cid: "",
					pagenum: 1, //当前页码
					pagesize: 6, //每页显示数据条数
				},
				total: 0, //网络请求返回的总数据条数
				// 商品列表的数据
				goodsList: [],
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				// 网络请求 状态 为 true 表示正在请求中
				isRequseting: false
			};
		},
		// 商品列表页面 加载 
		onLoad(options) {
			// 将页面跳转时携带的参数 存储到 queryObj 对象中(没有返回空串)
			this.queryObj.query = options.query || ""
			this.queryObj.cid = options.cid || ""
			// 请求 商品列表 数据
			this.getGoodsList()
		},
		// 上拉触底事件
		onReachBottom() {
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
				// 成立表示 没有下一页了 提示用户数据全部加载
				return uni.$showMsg("数据已经全部加载！")
			}
			// 表示 isRequseting 为true 正在请求中 （节流阀开启中）
			if (this.isRequseting) return
			// 页码加一
			this.queryObj.pagenum += 1
			// 重新发请求 获取后面页数据
			this.getGoodsList()
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isRequseting = false
			this.goodsList = []
			// 重新获取数据 ，传入关闭下拉刷新的回调函数(即cb)
			this.getGoodsList(() => {
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			// 请求商品列表的 网络请求函数
			async getGoodsList(cb) {
				// cb 是 关闭 下拉刷新的回调函数 ，他可能存在也可能不存在 ，通过短路运算符 调用cb函数
				cb && cb()
				// 正在请求中 开启节流阀
				this.isRequseting = true
				let results = await uni.$http.get("/api/public/v1/goods/search", this.queryObj)
				// 请求完成 关闭节流阀
				this.isRequseting = false
				if (results.data.meta.status !== 200) return uni.$showMsg() //请求失败 提示用户
				// 请求成功 存储数据
				this.total = results.data.message.total
				this.goodsList = this.goodsList.concat(results.data.message.goods)
			},
			// 点击商品项 ，跳转到商品详情页面  goods 是点击项的商品信息
			gotoDetail(goods) {
				console.log(goods.goods_id);
				uni.navigateTo({
					url:`/subpkg/goods-detail/goods-detail?goods_id=${goods.goods_id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.goods-list {}
</style>
