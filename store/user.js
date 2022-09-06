// user 信息仓库
let mutations = {
	// 更新收货地址
	updateAddress(state, address) {
		state.address = address
		this.commit("user/saveAddressToStorage")
	},
	// 持久化存储 收货地址 address 的函数
	saveAddressToStorage(state) {
		uni.setStorageSync("address", JSON.stringify(state.address))
	},

	// 更新用户基本 信息 的函数
	updateUserInfo(state, newUserinfo) {
		state.userinfo = newUserinfo
		// 持久化存储
		this.commit("user/saveUserinfoToStorage")
	},
	// 持久化存储 userinfo 的函数
	saveUserinfoToStorage(state) {
		uni.setStorageSync("userinfo", JSON.stringify(state.userinfo))
	},

	// 更新token
	updateToken(state, token) {
		state.token = token
		// 持久化存储 token 
		this.commit("user/saveTokenToStorage")
	},
	// 持久化存储 token字符串  的函数
	saveTokenToStorage(state) {
		uni.setStorageSync("token", state.token)
	},
	// 更新重定向信息 的函数
	updateRedirectInfo(state, info) {
		// console.log(info);
		state.redirectInfo = info
	}
}
let state = {
	// 用户收货地址 包括 
	// cityName: "广州市"
	// countyName: "海珠区"
	// detailInfo: "新港中路397号"
	// errMsg: "chooseAddress:ok"
	// nationalCode: "510000"
	// postalCode: "510000"
	// provinceName: "广东省"
	// telNumber: "020-81167888"
	// userName: "张三"
	address: JSON.parse(uni.getStorageSync("address") || "{}"),
	// 用户登录 服务器给的 token
	token: uni.getStorageSync("token") || "",
	// 用户基本信息 对象
	userinfo: JSON.parse(uni.getStorageSync("userinfo") || "{}"),
	// 重定向的 object 对象 { openType, from }
	redirectInfo: null
}
let getters = {
	//  用户收货地址(详细地址)
	addressDetail(state) {
		if (!state.address.provinceName) return ""
		return state.address.provinceName +
			state.address.cityName +
			state.address.countyName +
			state.address.detailInfo
	}
}
export default {
	// 为当前模块开启命名空间
	namespaced: true,
	mutations,
	state,
	getters,
}
