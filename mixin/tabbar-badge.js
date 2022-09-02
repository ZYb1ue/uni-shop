// 设置 tabBar 徽标的代码
// 按需导入 mapGetters 这个辅助方法
import { mapGetters } from 'vuex'

export default {
    computed:{
        ...mapGetters("cart",["total"])
    },
    onShow() {
        // 在页面刚展示的时候，设置数字徽标
        this.setBadge()
     },
     methods:{
        // 设置 tabbar 数字徽标
        setBadge(){
            // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
            uni.setTabBarBadge({
                index:2 ,// 索引 哪个tab项
                text: String(this.total)  // 注意：text 的值必须是字符串，不能是数字
            })
        }
    },
	watch:{
		total:{
			handler(){
				// 当 cart仓库中映射过来的 商品购买总数 total发生改变时调用 重新设置 购物车tab右上角的徽标数量
				this.setBadge()
			}
		}
	}
}