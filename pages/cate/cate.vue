<template>
	<view>
		<!-- 自定义组件 搜索区域 -->
		<!-- 通过传递 props 可以自定义背景颜色和圆角尺寸 -->
		<!-- <my-search bgColor="#9932CC" radius="2"></my-search> -->
		<!-- 给子组件绑定自定义事件，在组件内部通过$emit触发 -->
		<my-search @myclick="gotoSearch"></my-search>
		<!-- 滚动容器 -->
		<view class="scroll-view-container">
			<!-- 左侧滚动容器 -->
			<scroll-view class="scroll-view-left" scroll-y="true" :style="{height:wh + 'px'}">
				<block v-for="(cate1,index) in cateList" :key="cate1.cat_id">
					<!-- 动态的绑定 类名 -->
					<view class="scroll-view-left-item" :class="{'active':active === index ? true :false}"
						@click="changeItemHandler(index)">
						{{cate1.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滚动容器 -->
			<scroll-view class="scroll-view-right" scroll-y="true" :style="{height:wh + 'px'}" :scroll-top="scrollTop">
				<view class="scroll-view-right-item" v-for="cate2,index in cateLevel2" :key="cate2.cat_id">
					<!-- 二级标题 -->
					<view class="right-item-title">
						<text>/{{cate2.cat_name}}/</text>
					</view>
					<!-- 三级详情 -->
					<view class="right-item">
						<view class="right-item-image" v-for="cate3,index in cate2.children" :key="cate3.cat_id"
							@click="gotoGoodsList(cate3)">
							<!-- 
							由于域名发生了改变，这里用
							replace方法 将cate3.cat_icon（字符串） 中的 'dev' 替换为 'web' 原字符串不会改变。 -->
							<image :src="cate3.cat_icon.replace('dev','web')"></image>
							<text>{{cate3.cat_name}}</text>
						</view>
					</view>

				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 用户当前设备可用的屏幕高度,初始化为0
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 控制是否 拥有激活项类名 active （当它的值和，遍历分类数据列表的，索引值相等时，拥有active）
				active: 0,
				// 二级分类列表
				cateLevel2: [],
				// 右侧滚动位置距离顶部距离
				scrollTop: 0
			}
		},
		// 页面加载生命周期
		onLoad() {
			// 调用 获取设备信息的 api 
			let sysInfo = uni.getSystemInfoSync()
			// windowHeight 代表设备可使用窗口高度，单位px，将其赋值给 wh 用于确定滚动容器高度
			this.wh = sysInfo.windowHeight-60

			// 获取分类数据列表
			this.getCateList()
		},
		methods: {
			// 获取分类数据列表的函数
			async getCateList() {
				let results = await uni.$http.get("/api/public/v1/categories")
				if (results.data.meta.status !== 200) {
					// 请求失败 提示用户
					return uni.$showMsg()
				}
				// 请求成功 存储数据
				this.cateList = results.data.message //1级
				this.cateLevel2 = results.data.message[0].children //2级
			},
			// 点击一级分类的回调函数
			changeItemHandler(index) {
				this.active = index
				// 根据点击项的索引值 index 确定点击项信息 ，确定显示信息
				this.cateLevel2 = this.cateList[index].children
				// 右侧滚动条 归零（顶部）
				// 由于 scrollTop 改变前后值一样的话 没有效果 ，动态的设置它的值
				this.scrollTop = this.scrollTop == 0 ? 1 : 0
			},
			// 点击三级分类 的商品 跳转到 goods_list 页面
			gotoGoodsList(cate3) {
				// cate3 是点击项信息
				// 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。
				// 使用 wx.navigateBack 可以返回到原页面。小程序中页面栈最多十层
				wx.navigateTo({
					url: `/subpkg/goods_list/goods_list?cid=${cate3.cat_id}`
				})
			},
			// 自定义事件 myclick 的回调
			gotoSearch(){
				// 点击搜索框 跳转到搜索页面
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.scroll-view-left {
			width: 120px;

			.scroll-view-left-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				// & 就是 .scroll-view-left-item
				&.active {
					// 表示既包含 & 又包含 active类名的元素
					background-color: #ffffff;
					position: relative;

					// 渲染激活项左侧的红色指示边线
					/* CSS 中，::before 创建一个伪元素，
					 其将成为匹配选中的元素的第一个子元素。常通过 content 属性
					 来为一个元素添加修饰性的内容。此元素默认为行内元素。 */
					&::before {
						content: '';
						// 将其转变为块级元素，这样才能设置宽高
						display: block;
						width: 3px;
						height: 30px;
						background-color: #FFC0CB;
						// 子绝父相，相对于父元素定位
						position: absolute;
						top: 50%;
						left: 0px;
						// 相对于 自身位置返回50%
						// translateY() 在页面垂直移动元素，
						transform: translateY(-50%);
					}
				}

			}
		}

		.scroll-view-right {
			.right-item-title {
				text-align: center;
				padding: 15px 0;

				text {
					font-size: 12px;
					font-weight: bold;
				}
			}

			.right-item {
				display: flex;
				flex-wrap: wrap;

				.right-item-image {
					width: 33.33%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin: 10px 0px;

					image {
						width: 60px;
						height: 60px;
						margin-bottom: 10px;
					}

					text {
						font-size: 12px;
					}
				}
			}
		}
	}
</style>
