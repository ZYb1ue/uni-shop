<template>
	<view>
		<!-- 登录容器 -->
		<view class="login-container">
			<!-- 登录 图标 -->
			<uni-icons type="contact-filled" color="gray" size="100"></uni-icons>
			<!-- 登录按钮 -->
			<button type="default" class="btn-login" @click="getUserProfile">一键登录</button>
			<!-- 登录提示文本 -->
			<view class="tips-text">
				登录后尽享更多权益
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from "vuex"
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			// 映射 user 仓库中的 token  redirectInfo
			...mapState("user", ["redirectInfo"])
		},
		methods: {
			// 获取用户昵称、头像
			async getUserProfile() {
				let [err, succ] = await uni.getUserProfile({
					desc: '用于完善会员资料',
				}).catch(err => err)

				// 判断用户是否授权 获取 用户昵称 用户头像
				if (!succ && err.errMsg == "getUserProfile:fail auth deny") {
					// 未授权 succ 为 undefined 提示用户
					return uni.$showMsg("您取消了授权！")

				}
				if (err === null && succ.errMsg == "getUserProfile:ok") {
					// 用户已经授权

					// 存储 用户 基本信息（头像、昵称）到 user仓库中
					this.updateUserInfo(succ.userInfo)

					// succ 是授权后 返回的用户信息对象包含以下属性：
					// cloudID
					// encryptedData
					// errMsg
					// iv
					// rawData
					// signature
					// userInfo

					// 获取 token 
					this.getToken(succ)
				}

			},

			// 映射 user 仓库中 更新user仓库中 userinfo token redirectInfo 的函数
			...mapMutations("user", ["updateUserInfo", "updateToken", "updateRedirectInfo"]),

			// 获取 token 的方法
			async getToken(info) {
				let [err, res] = await uni.login().catch(err => err)
				// console.log(err);
				// console.log(res);
				/* code	      string	
				用户登录凭证（有效期五分钟）。
				开发者需要在开发者服务器后台调用 auth.code2Session，
				使用 code 换取 openid、unionid、session_key 等信息 */
				if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

				// 准备 向 我们自己 服务器 发网络请求需要的 参数
				const query = {
					code: res.code, //用户登录凭证（有效期五分钟）
					encryptedData: info.encryptedData, //包括敏感数据在内的完整用户信息的加密数据
					iv: info.iv, //加密算法的初始向量
					rawData: info.rawData, //不包括敏感信息的原始数据字符串，用于计算签名
					signature: info.signature //使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息
				}
				console.log(query);
				// 向我们自己的服务器 发送网络请求 获取 token（由于权限问题！无法获取到真正的token）
				let results = await uni.$http.post("/api/public/v1/users/wxlogin", query)
				console.log(results);
				// 由于权限问题！无法获取到真正的token,以下是模拟的 token 
				// meta:
				// msg: "Error: invalid code, rid: 6312f81f-1e88b388-3f323ff0"
				// status: 400
				if (results.data.meta.status !== 400) return uni.$showMsg("登录失败！")
				// 假 token ！！！！！！！
				// let token = results.data.meta.msg.split(",")[1].split(":")[1]
				
				// 这是写死的token（用于测试！！！）
				let token =
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
				// 存储 token 到 user 仓库中
				this.updateToken(token)

				// 成功 获取到token 那么 有重定向信息的话 跳转到 重定向页面
				this.navigateBack()

			},
			// 跳转回来自页面的函数
			navigateBack() {
				// 判断 是否有重定向信息 以及重定向方法
				if (this.redirectInfo && this.redirectInfo.openType === "switchTab") {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							// 跳转后(不管成功还是失败) 清除 user 仓库中的 重定向信息
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 750rpx;
		background-color: #efefef;
		position: relative;
		overflow: hidden;

		// 伪元素 必须要有 content 属性
		&::after {
			content: ' ';
			display: block;
			background-color: #f5f5f5;
			height: 40px;
			width: 100%;
			position: absolute;
			left: 0;
			bottom: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}

		.btn-login {
			width: 90%;
			background-color: #FFC0CB;
			margin: 15px 0;
			border-radius: 100px;
		}

		.tips-text {
			font-size: 12px;
		}
	}
</style>
