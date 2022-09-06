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
		<view class="btn-settle" @click="settlement">
			结算<text>({{checkedCount}})</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState
	}
	from "vuex"
	export default {
		name: "my-settle",
		data() {
			return {
				// 未登录时，跳转到登录页秒速
				seconds: 3,
				// 延迟跳转 循环计时器 返回的 时间戳
				timer: null
			};
		},
		computed: {
			// 映射 cart 仓库中getters 中的 
			// checkedCount（已选商品数） total（购物车中商品总数） checkedGoodsAmount（已经勾选商品总价格） 数据
			...mapGetters("cart", ["checkedCount", "total", "checkedGoodsAmount"]),
			// 映射 user 仓库 中的数据 addressDetail(详细收货地址字符串) token(登录令牌)
			...mapGetters("user", ["addressDetail"]),
			...mapState("user", ["token"]),
			//  cart(购物车全部数据)
			...mapState("cart", ["cart"]),
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
			// 映射 user 仓库中 mapMutations 中 更新重定向信息的函数
			...mapMutations("user", ["updateRedirectInfo"]),
			// 点击 全选 radio 改变 商品选中状态
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 点击 结算按钮
			settlement() {
				// 判断 是否选择了商品
				if (!this.checkedCount) return uni.$showMsg("请选择购买的商品")
				// 判断 是否填写了收货地址
				if (!this.addressDetail) return uni.$showMsg("请选择收货地址")
				// 判断 是否登录了（登录的有token）
				// if (!this.token) return uni.$showMsg("请先登录")
				if (!this.token) {
					// 延迟跳转到 登录页 
					this.delayNavigate()
				}
				// 微信支付 业务（以上条件已符合了）
				this.payOrder()
			},
			// 三秒后跳转提示函数
			showTip() {
				uni.showToast({
					icon: "none",
					title: `请登录后再结算！${this.seconds}秒后自动跳转到登录页`,
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			// 延迟跳转到登录页函数
			delayNavigate() {
				this.showTip()
				// 循环定时器 每秒 seconds 减一
				this.timer = setInterval(() => {
					this.seconds -= 1

					// 判断跳转倒数数的值是否小于等于0（小于等于0跳转）
					if (this.seconds <= 0) {
						// 清除循环定时器
						clearInterval(this.timer)
						uni.switchTab({
							url: "/pages/my/my",
							// 成功跳转到my页面
							success: () => {
								this.updateRedirectInfo({
									// 来自那个 页面
									from: "/pages/cart/cart",
									// 以什么方式 跳转回去
									openType: "switchTab"
								})
							}
						})
						// 恢复 seconds 为 3
						this.seconds = 3
						return
					}
					this.showTip()
				}, 1000)
			},
			// 微信支付 函数
			async payOrder() {
				// 1. 创建订单
				// 1.1 组织订单的信息对象
				let orderInfoObj = {
					// order_price: this.checkedGoodsAmount, //勾选购买的商品的总价格  
					order_price: 0.01,
					consignee_addr: this.addressDetail, //收货地址
					/* 购买商品的信息  由对象组成 ！每个对象！ 包含 ：
					goods_id（每个商品id） goods_number(每个商品购买数量) goods_price（单价）*/

					// filter() 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素。
					// map() 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
					goods: this.cart.filter((item) => {
						return item.goods_state == true
					}).map((item1) => {
						let rGoods = {
							goods_id: item1.goods_id,
							goods_number: item1.goods_count,
							goods_price: item1.goods_price

						}
						return rGoods
					})
				}
				// 1.2 发起请求创建订单
				let {
					// 解构赋值＋重命名为res
					data: res
				} = await uni.$http.post("/api/public/v1/my/orders/create", orderInfoObj)
				console.log(res, '创建订单');
				if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				// 1.3 得到服务器响应的“订单编号”
				const orderNumber = res.message.order_number

				// 2. 订单预支付
				// 2.1 发起请求获取订单的支付信息
				let results = await uni.$http.post("/api/public/v1/my/orders/req_unifiedorder", {
					order_number: orderNumber
				})

				/* 
				message: null
				meta: {msg: "用户ID不正确", status: 400} */

				// 2.2 预付订单生成失败
				// 为了测试 改的 400 本来应该是 200
				if (results.data.meta.status !== 400) return uni.$showMsg('预付订单生成失败！')
				/* 
				返回示例：
				{
				  "message": {
				    "pay": {
				      "timeStamp": "1564730510",   // 时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间
				      "nonceStr": "SReWbt3nEmpJo3tr",   //随机字符串，长度为32个字符以下
							// 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
				      "package": "prepay_id=wx02152148991420a3b39a90811023326800", 
				      "signType": "MD5",             //签名算法，应与后台下单时的值一致 (MD5	仅在 v2 版本接口适用)
				      "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"  //签名，具体见微信支付文档
				    },
				    "order_number": "HMDD20190802000000000422" //订单号
				  },
				  // 预付订单是否创建成功
				  "meta": {
				    "msg": "预付订单生成成功",
				    "status": 200
				  }
				} 
				*/
				// 2.3 得到订单支付相关的必要参数
				// const payInfo = results.data.message.pay

				// 微信小程序 获取时间戳的方式
				/* let timestamp = Date.now()
				let timestamp2 = new Date().getTime()
				console.log(timestamp);
				console.log(timestamp2); */

				// 准备一个假的 支付请求参数对象
				const payInfo = {
					timeStamp: "1662370197",
					nonceStr: "SReWbt3nEmpJo3tr",
					package: "prepay_id=wx02152148991420a3b39a90811023326800",
					signType: "MD5",
					paySign: "3A6943C3B865FA2B2C825CDCB33C5304"
				}

				// 3. 发起微信支付
				// 3.1 调用 uni.requestPayment() 发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo)
				console.log([err, succ]);
				// 3.2 未完成支付
				if (err) return uni.$showMsg('订单未支付！')
				/* 
				由于接口权限的问题（无法获取真实的token） 这里只写了逻辑 ，没有真正支付功能
				// 3.3 完成了支付，进一步查询支付的结果
				const {
					data: res3
				} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
					order_number: orderNumber
				})
				// 3.4 检测到订单未支付
				if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				// 3.5 检测到订单支付完成
				uni.showToast({
					title: '支付完成！',
					icon: 'success'
				}) 
				*/
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
