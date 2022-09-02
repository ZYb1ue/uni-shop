// 购物车 仓库 模块
let mutations = {
	// 给cart 仓库添加 商品信息 goods 是传递的商品信息参数对象
	ADDTOCART(state, goods) {
		// 判断，是否拥有 该商品
		// find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
		let result = state.cart.find((item) => {
			return item.goods_id == goods.goods_id;
		});
		if (!result) {
			// result 为 undefined表示没有这个值
			// 添加这个商品进入 cart
			state.cart.push(goods);
		} else {
			// 如果购物车中有这件商品，则只更新数量即可
			// result 为 满足 item.goods_id == goods.goods_id 的商品
			result.goods_count += 1;
		}
		// 通过 commit 方法，调用 m_cart 命名空间下的 SAVETOSTORAGE 方法
		this.commit('cart/SAVETOSTORAGE')
	},
	// 将购物车中的数据持久化存储到本地
	SAVETOSTORAGE(state) {
		uni.setStorageSync("cart", JSON.stringify(state.cart))
	},
	// 更新购物车中商品 radio 选中状态的 函数
	// goods 是 传递过来的 商品信息对象 包括 goods_id goods_state
	updateGoodsState(state, goods) {
		// 根据 商品 id 查找到对应 的商品
		// find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
		let results = state.cart.find((item) => {
			return item.goods_id == goods.goods_id
		})
		if (results) {
			// 表示 查找到符合条件的第一个元素（即此时的results）
			// 给符合商品id 的商品的勾选状态重新赋值
			results.goods_state = goods.goods_state
			// 继续持久化存储
			this.commit('cart/SAVETOSTORAGE')
		}
	},
	// 更新购物车中商品 购买数量  函数
	updateGoodsCount(state, goods) {
		// goods 是改变购买商品数量的 商品信息对象 包含 goods_id  goods_count(最新)
		let results = state.cart.find((item) => {
			return item.goods_id == goods.goods_id
		})
		if (results) {
			// 表示 查找到符合条件的第一个元素（即此时的results）
			// 给符合商品id 的商品的 购买数量重新赋值
			results.goods_count = Number(goods.goods_count)
			// 继续持久化存储
			this.commit('cart/SAVETOSTORAGE')
		}
	},
	//  删除 购物车 中的商品 根据 Id
	removeGoodsById(state, goods) {
		// filter() 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素。
		state.cart = state.cart.filter((item) => {
			// 返回 商品id不等于要删除的商品的id 的其它商品
			return item.goods_id !== goods.goods_id
		})
		// 持久化存储到本地
		this.commit('cart/SAVETOSTORAGE')
	},
	// 更新 商品选中 状态的 函数
	updateAllGoodsState(state, newState) {
		state.cart.forEach((item) => {
			item.goods_state = newState
		})
		// 持久化存储到本地
		this.commit('cart/SAVETOSTORAGE')
	}
};

let state = {
	// 购物车数据
	// 购物车的数组，用来存储购物车中每个商品的信息对象
	// 每个商品的信息对象，都包含如下 6 个属性：
	// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
	cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
};

let getters = {
	// 统计购物车中商品的总数量
	total(state) {
		// 方式一：
		// let count = 0;
		// // forEach() 方法对数组的每个元素执行一次给定的函数。
		// state.cart.forEach((element) => {
		// 	count += element.goods_count;
		// });
		// return count
		// 方式二：
		// reduce() 方法对数组中的每个元素按序执行一个由您提供的 reducer 函数，
		// 每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。
		// 给定 total 初始值 0 ， 结果函数 
		return state.cart.reduce((total, item) => {
			return total += item.goods_count
		}, 0)
	},
	// 统计已经勾选的 商品数量
	checkedCount(state) {
		// filter() 方法创建一个新数组，其包含通过所提供函数实现的测试的所有元素。
		/* 	reduce() 方法对数组中的每个元素按序执行一个由您提供的 reducer 函数，
			每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值。 */
		return state.cart.filter((item) => {
			return item.goods_state == true
		}).reduce((total, item) => {
			return total += item.goods_count
		}, 0)
	},
	// 统计 已经勾选 商品 的总价格
	checkedGoodsAmount(state) {
		// 过滤出已经被勾选的商品 数组 然后通过 reduce 计算出已经勾选商品总价格(toFixed(2) 保留两位小数)
		return state.cart.filter((item1) => {
			return item1.goods_state == true
		}).reduce((totalPrice, item2) => {
			return totalPrice += (item2.goods_price * item2.goods_count)
		}, 0).toFixed(2)
	}
};

export default {
	// 为当前模块开启命名空间
	namespaced: true,
	mutations,
	state,
	getters,
};
