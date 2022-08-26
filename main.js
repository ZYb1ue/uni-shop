// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 引入 网络请求对象
import $http from "@/api/http.js"
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 封装一个提示用户的请求结果的函数 , 并挂载到 uni 顶级对象之上 ,
// title = '数据加载失败！', duration = 1500 是设置的默认值
uni.$showMsg = function(title = '数据加载失败！', duration = 1500, icon = 'none') {
	uni.showToast({
		title, //标题
		duration, //提示时间
		icon //不显示提示图标
	})
}

Vue.config.productionTip = false //关闭生产提示

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
