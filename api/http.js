// 引入 发网络请求的包  @escook/request-miniprogram
import { $http } from '@escook/request-miniprogram'

// 配置请求根路径
$http.baseUrl = 'https://api-ugo-web.itheima.net'


// 配置请求拦截器
$http.beforeRequest = function (options) {
	
  // 展示 loading 效果
   uni.showLoading({
      title: '数据加载中...',
    })
}
// 配置响应拦截器
$http.afterRequest = function () {
	
  // 隐藏 loading 效果
  uni.hideLoading()
}

// 暴露 $http
export default $http