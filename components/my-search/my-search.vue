<template>
	<view>
		<!-- 模拟一个input 输入框 -->
		<view @click="emitMyclick" class="my-search-container" :style="{'background-color':bgColor}">
			<view class="my-search-box" :style="{'border-radius':radius +'px'}">
				<uni-icons type="search" size="15"></uni-icons>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-search",
		props: {
			bgColor: {
				type: String, //类型
				// required: false, //必要性
				default: '#FFC0CB' //默认值
			},
			radius:{
				type: String, //类型
				// required: false, //必要性
				default: '15' //默认值 //px
			}
		},
		data() {
			return {

			};
		},
		methods:{
			emitMyclick(){
				// 触发父组件 的 自定义事件 myclick
				this.$emit("myclick")
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container {
		// background-color: #FFC0CB;
		height: 60px;
		padding: 10px;
		display: flex;
		align-items: center;
	
	.my-search-box {
			background: white;
			// border-radius: 15px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 40px;

			.placeholder {
				font-size: 15px;
				margin-left: 5px;
			}
		}
	}
</style>
