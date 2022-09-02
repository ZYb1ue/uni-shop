<template>
	<!-- 结算组件 -->
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio color="#FFC0CB" :checked="isFullCheck" /><text> 全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle">
			结算<text>({{checkedCount}})</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	}
	from "vuex"
	export default {
		name: "my-settle",
		data() {
			return {

			};
		},
		computed: {
			// 映射 cart 仓库中getters 中的 checkedCount total checkedGoodsAmount 数据
			...mapGetters("cart", ["checkedCount", "total", "checkedGoodsAmount"]),
			// 确定 全部勾选 radio 状态
			isFullCheck() {
				if (this.checkedCount == this.total) return true
				return false
			}
		},
		methods: {
			// 映射 cart 仓库中 mapMutations 中 更新商品选中 态的 函数 updateAllGoodsState
			...mapMutations("cart", {
				updateAllGoodsState: "updateAllGoodsState"
			}),
			// 点击 全选 radio 改变 商品选中状态
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck)
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		width: 100%;
		height: 50px;
		background-color: white;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount-box {
			.amount {
				color: #e00000;
			}
		}

		.btn-settle {
			background-color: #FFC0CB;
			height: 100%;
			width: 110px;
			text-align: center;
			line-height: 50px;
		}
	}
</style>
