<template>
	<view class="cart-container" v-if="cart.length!==0">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 购物车标题 -->
		<view class="cart-title">
			<!-- 左侧图标 -->
			<uni-icons type="cart" size="18"></uni-icons>
			<!-- 右侧文本 -->
			<view class="cart-text">
				购物车
			</view>
		</view>
		<!-- 商品列表区域 -->
		<!-- 滑动删除 -->
		<uni-swipe-action>
			<block v-for="goods in cart" :key="goods.goods_id">
				<uni-swipe-action-item :right-options="options" @click="onClick(goods)">
					<my-goods :goods="goods" :isShowRadio="true" :isShowNumber="true" @radio-change="radioChangeHandler"
						@numberChange="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>

		<!-- 结算组件 -->
		<my-settle :checkedCount="checkedCount"></my-settle>
	</view>
	
	<!-- 空购物车页面 -->
	<view class="empty-cart" v-else>
		<image src="@/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	// 引入 mixin（混入）中 tabbar-badge
	import tabbarBadge from "../../mixin/tabbar-badge"
	// 按需导入 mapState 这个辅助函数
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#FFC0CB'
					}
				}]
			};
		},
		computed: {
			// 映射 cart 仓库中的 cart数据
			...mapState("cart", ["cart"]),
		},
		mixins: [tabbarBadge],
		methods: {
			// 改变 radio 选中状态的 回调函数（自定义事件 radio-change 的回调）
			radioChangeHandler(e) {
				// e 是改变购买商品选中状态的 商品信息对象 包含 goods_id goods_state（取反后的）
				// 直接提交 commit 更新购物车商品 选中状态
				this.$store.commit("cart/updateGoodsState", e)
			},
			// 给子组件 绑定 自定义事件 @numberChange 的回调函数
			numberChangeHandler(goods) {
				// goods 是改变购买商品数量的 商品信息对象 包含 goods_id goods_count
				// 直接提交 commit  更新购物车商品 购买数量
				this.$store.commit("cart/updateGoodsCount", goods)
			},
			// 点击选项按钮时触发事件  返回值 ：e = {content,index} ，content（点击内容）、index（下标）、position (位置信息)
			// goods 是 点击项对应的 商品信息
			// 滑动删除
			onClick(goods) {
				this.$store.commit("cart/removeGoodsById", goods)
			}

		}
	}
</script>

<style lang="scss">
	.cart-title {
		display: flex;
		padding: 10px;
		height: 40px;
		border-bottom: 1px solid #efefef;
		align-items: center;
		font-size: 14px;
		background-color: white;

		.cart-text {
			margin-left: 10px;
		}
	}

	.cart-container {
		padding-bottom: 50px;
	}
	.empty-cart{
		display: flex;
		flex-direction: column;
		align-items: center;
		.empty-img{
			padding-top: 150px;
			width: 90px;
			height: 90px;
		}
		.tip-text{
			margin-top: 15px;
			font-size: 12px;
		}
	}
</style>
