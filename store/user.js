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
	}

}
let state = {
	// 用户收货地址
	address: JSON.parse(uni.getStorageSync("address") || '{}')
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
