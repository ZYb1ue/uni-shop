// 引入 发网络请求的包  @escook/request-miniprogram
import {
	$http
} from '@escook/request-miniprogram'


// 引入 vuex 仓库数据
import store from "../store/store.js"


// 配置请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'


// 配置请求拦截器
$http.beforeRequest = function(options) {

	// 展示 loading 效果
	uni.showLoading({
		title: '数据加载中...',
	})


	//  请求url地址 中带有 "/my/" 的是需要权限的 地址
	// indexOf 方法： 如果要检索的字符串值没有出现，则该方法返回 -1。
	if (options.url.indexOf("/my/") !== -1) {
		// 不等于 -1 表示 url 里面包含 /my/ 这是一个需要权限的网络请求 
		// 在请求头中添加  身份认证的请求头字段 Authorization
		options.header = {
			Authorization: store.state.user.token
		}
	}
}
// 配置响应拦截器
$http.afterRequest = function() {

	// 隐藏 loading 效果
	uni.hideLoading()
}

// 暴露 $http
export default $http
