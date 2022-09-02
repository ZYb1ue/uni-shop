// vuex 仓库
import Vue from "vue";
import Vuex from "vuex";

// 注册插件库 vuex
Vue.use(Vuex);

// 引入 cart 仓库模块
import cart from "./cart";
// 引入 user 仓库模块
import user from "./user";

// 创建 Store 的实例对象
const store = new Vuex.Store({
    // 开启模块化
    modules: {
		cart,
		user
	},
});
// 向外共享 Store 的实例对象
export default store;
