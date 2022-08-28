<template>
	<view>
		<view class="search-box">
			<uni-search-bar @input="input" :focus="true" :radius="100" cancelButton="none" v-model="searchValue">
			</uni-search-bar>
		</view>
		<!-- 搜索历史区域 -->
		<view class="history-box" v-if="searchResults.length==0" v-show="historyList.length!=0">
			<view class="history-title">
				<view>
					搜索历史
				</view>
				<!-- 点击删除历史记录 -->
				<uni-icons type="trash" size="20" @click="clearHistory"></uni-icons>
			</view>
			<view class="history-tag">
				<uni-tag :text="tag" :inverted="true" v-for="tag,index in historys" :key="index" @click="tagHandler(tag)"></uni-tag>
			</view>
		</view>
		<!-- 展示搜索结果区域 -->
		<view class="search-result-box" v-else>
			<view class="search-result-item" v-for="(item,index) in searchResults" :key="item.goods_id"
				@click="gotoDetail(item)">
				<view class="search-result-name">
					{{item.goods_name}}
				</view>
				<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	// 防抖方式一：通过 lodash 函数库实现
	// 引入 lodash （ 按需引入：这里引入了debounce（防抖函数）用于三级联动节流 ，防止卡顿）
	// import debounce from "lodash/debounce";
	export default {
		data() {
			return {
				// 搜索框输出
				searchValue: "",
				// 接受 setTimeout 的返回值
				timer: null,
				// 搜索结果列表
				searchResults: [],
				// 搜索关键词的历史记录
				historyList: []
			};
		},
		onLoad() {
			// 页面加载 获取 搜索历史信息 ，并将其赋值给 historyList
			this.historyList = JSON.parse(uni.getStorageSync("keyword") || '[]')
		},
		methods: {
			// 搜索框发生输入事件（防抖方式一）
			// input:debounce(function(){
			// 	if(!this.searchValue) return
			// 	console.log(this.searchValue);
			// },700)
			// 搜索框发生输入事件（防抖方式二）
			input() {
				// 注意 clearTimeout 要放在 setTimeout 前
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.getSearchList()
				}, 700)

			},
			// 根据搜索框输入的 关键词 发送网络请求
			async getSearchList() {
				// 输入为空，清空 searchResults
				if (this.searchValue.length == 0) {
					this.searchResults = []
					return
				}
				// query 参数 写法一
				// let results = await uni.$http.get(`/api/public/v1/goods/qsearch?query=${this.searchValue}`)
				// query 参数 写法二
				let results = await uni.$http.get("/api/public/v1/goods/qsearch", {
					query: this.searchValue
				})
				if (results.data.meta.status !== 200) {
					// 请求失败，提示用户
					uni.$showMsg()
				} else {
					// 存储 根据关键词 搜索的商品信息列表
					this.searchResults = results.data.message
					// 存储 搜索 历史数据
					this.saveSearchHistory()
				}

			},
			// 点击 搜索结果项 跳转到对应的商品详情页面
			gotoDetail(item) {
				console.log(item.goods_id);
				uni.navigateTo({
					url: `/subpkg/goods-detail/goods-detail?goods_id=${item.goods_id}`
				})
			},
			// 保存 输入的历史记录 函数
			saveSearchHistory() {
				// Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用。
				// Set对象是值的集合，你可以按照插入的顺序迭代它的元素。Set 中的元素只会出现一次，即 Set 中的元素是唯一的。	
				// 1. 将 Array 数组转化为 Set 对象
				let set = new Set(this.historyList)
				// 2. 调用 Set 对象的 delete 方法，移除对应的元素
				set.delete(this.searchValue)
				// 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
				set.add(this.searchValue)
				// 4. 将 Set 对象转化为 Array 数组
				this.historyList = Array.from(set)

				// 本地持久化存储
				uni.setStorageSync("keyword",JSON.stringify(this.historyList))
			},
			// 点击 搜索历史标签 改变搜索关键字 展示搜索详情
			tagHandler(tag){
				this.searchValue = tag
			},
			// 点击删除图标 删除 全部历史记录（本地存储也删除）
			clearHistory(){
				this.historyList = []
				uni.setStorageSync('keyword', '[]')
			}
		},
		computed: {
			// 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
			// 而是应该新建一个内存无关的数组，再进行 reverse 反转
			historys() {
				return [...this.historyList].reverse()
			}
		},
	}
</script>

<style lang="scss">
	// 给搜索框添加吸顶效果
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	// 给搜索结果 展示列表添加样式
	.search-result-box {
		padding: 7px 7px;

		.search-result-item {
			background-color: white;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 4px 0px;
			padding: 0 5px;
			height: 50px;
			// 盒子阴影
			// box-shadow: 10px 10px 5px #888888;
			border-bottom: 1px solid #FFC0CB;

			.search-result-name {
				font-size: 12px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	// 历史搜索
	.history-box {
		padding: 0 7px;

		.history-title {
			height: 40px;
			font-size: 13px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin: 10px 0px;
			border-bottom: 1px solid #efefef;
			background-color: white;
			padding: 10px;
		}

		.history-tag {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				border: none;
				margin-top: 7px;
				margin-right: 7px;
			}
		}
	}
</style>
