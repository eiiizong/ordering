<template>
  <!-- 购物车页面 -->
  <div class="shopping-car">
    <div class="content"
         v-if="foods.length>0">
      <div class="foods-wrapper">
        <div class="item"
             v-for="(item, index) in foods"
             :key="index">
          <div class="title"
               :class="showArr[index].isShow?'active':''"
               @click="showFoodList(index)"
               v-if="item.goods_num>0">{{item.name}}({{item.goods_num}})</div>
          <block v-for="(item2, index2) in item.goodsList"
                 :key="item2.id">
            <div class="category-wrapper"
                 v-show="showArr[index].isShow">
              <ShopCarFooditem className="car"
                               @clickSubtractFood="clickSubtractFood(index, index2)"
                               @clickAddFood="clickAddFood(index, index2)"
                               :data="item2"></ShopCarFooditem>
            </div>

          </block>
        </div>
      </div>
    </div>
    <!-- 没有内容时提示 -->
    <div class="no-content"
         v-else>
      <NoPage imgUrl="/static/images/no-goods.png"></NoPage>
    </div>

    <div class="confirm-order"
         v-if="foods.length>0">
      <div class="total-price">
        总计：¥{{caclShoppingCarTotalPrice}}
      </div>
      <div class="btn-wrapper">
        <Btn value="确认下单"
             @click="goOrder"
             btnClassName="br100"></Btn>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import ShopCarFooditem from "@/components/shop-car-food-item/shop-car-food-item";
import Btn from "@/components/btn/btn";
import NoPage from "@/components/no-page/no-page";
import Utils from "../../utils/utils.js";
import NP from "../../utils/number-precision.js";
export default {
  data () {
    return {
      // 展示的列表数字
      showArr: [],
      // 已点菜品
      categoryList: [],
      // 商品总价格
      totalPrice: 0,
      // 处理过后的商品
      foods: [],
      orderType: "",
      selectIndex: -1
    };
  },

  components: {
    ShopCarFooditem,
    TopNav,
    Btn,
    NoPage
  },
  created () {
  },
  onShow () {
    this.initInfo();
  },
  computed: {
    // 计算购物车总价
    caclShoppingCarTotalPrice () {
      console.log("正在计算购物车商品总价..............");
      const data = this.foods;
      let totalPrice = 0;
      data.forEach(item => {
        if (item.goods_num > 0) {
          item.goodsList.forEach(item2 => {
            let sellPrice = parseFloat(item2.sell_price, 10);
            let price = NP.times(sellPrice, item2.goods_num);
            totalPrice = NP.plus(price, totalPrice);
          });
        }
      });
      this.totalPrice = totalPrice;
      return totalPrice;
    }
  },
  methods: {
    // 点击列表显示隐藏
    showFoodList (index) {
      let item = {
        category_id: this.showArr[index].category_id,
        isShow: this.showArr[index].isShow
      };
      item = {
        ...item,
        isShow: !this.showArr[index].isShow
      };
      this.showArr[index] = item;
      this.$set(this.showArr, index, item);
    },
    // 初始化显示列表
    initShowArr (data) {
      // let orderType = this.orderType;
      let arr = [];
      // 如果已经存在
      if (this.showArr.length > 0) {
        data.forEach(item1 => {
          let categoryId = item1.id;
          // 记录categoryid在this.showArr存在时的位置
          let index = 0;
          let obj = {
            category_id: categoryId,
            isShow: false
          };
          // 检测该categoryid是否存在
          let isExist = this.showArr.some((item2, index2) => {
            if (item2.category_id === categoryId) {
              index = index2;
              return true;
            }
          });
          // 如果存在
          if (isExist) {
            obj.isShow = this.showArr[index].isShow;
          }
          arr.push(obj);
        });
      } else {
        data.forEach(item => {
          let obj = {
            category_id: item.id,
            isShow: false
          };
          arr.push(obj);
        });
        // 防止 foods = [] 时报错
        if (arr.length > 0) {
          arr[0].isShow = true;
        }
      }
      console.log("initShowArr", arr);
      this.showArr = arr;
    },
    // 初始化
    initInfo () {
      const globalData = this.globalData;

      this.orderType = globalData.order_type;

      if (this.orderType === "scan") {
        globalData.changeCategoryList = data => {
          console.log("获取到点餐页推送的 categoryList => ", data);
          this.categoryList = data;
          this.initGoods(data);
          this.updateBarBadge(data);
        };
        // 拉取数据 获取categoryList
        globalData.SocketTaskSendGetAllFoods(globalData.SocketTask, this);
      } else {
        this.initCategoryList();
      }

      console.log("this.orderType => ", this.orderType);
    },
    // 初始化 CategoryList 从globalData中获取
    initCategoryList () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        let result = _this.globalData[key];
        if (result) {
          _this.categoryList = result;
          _this.initGoods(result);
          _this.updateBarBadge(result);
        } else {
          _this.foods = [];
          _this.updateBarBadge(result);
        }
        console.log(" _this.categoryList => ", _this.categoryList);
      };
      Utils.operatingData(orderType, "c", func);
    },
    // 处理CategoryList 用于展示页面
    initGoods (data) {
      let foods = [];
      let foodIndex = 0;
      data.forEach((item, index) => {
        if (item.goods_num > 0) {
          let food = {
            ...item,
            goodsList: []
          };
          foods[foodIndex] = food;
          item.goodsList.forEach((item2, index2) => {
            if (item2.goods_num > 0) {
              item2.specs.forEach((item3, index3) => {
                if (item3.goods_num > 0) {
                  let food = {
                    ...item2,
                    ...item3,
                    specs: []
                  };
                  foods[foodIndex].goodsList.push(food);
                }
              });
            }
          });
          foodIndex++;
        }
      });
      this.foods = foods;
      this.initShowArr(foods);
      this.$set(this.foods);
      console.log("foods => ", foods);
    },
    // 更新购物车数量图标
    updateBarBadge (data) {
      Utils.updateShopingCarBarBadge(data);
      mpvue.stopPullDownRefresh();
      mpvue.hideLoading();
    },
    // 计算 CategoryList 传入一个分类id作为参数
    _caclCategoryList (categoryId) {
      categoryId = categoryId.toString();
      const data = this.categoryList;
      let MenuNum = 0;

      // 遍历整个数组
      data.forEach((item, index) => {
        item.goodsList.forEach((item2, index2) => {
          // 如果 种类id相同
          if (categoryId === item2.category_id) {
            let foodNum = 0;
            item2.specs.forEach((item3, index3) => {
              if (item3.goods_num > 0) {
                foodNum = foodNum + item3.goods_num;
              }
            });
            item2.goods_num = foodNum;
          }
        });
      });

      data.forEach((item, index) => {
        let id = item.id.toString();
        if (categoryId === id) {
          item.goodsList.forEach((item2, index2) => {
            MenuNum = MenuNum + item2.goods_num;
          });
          item.goods_num = MenuNum;
        }
      });

      this.$set(this.categoryList);
      this.initGoods(this.categoryList);
      this.updateBarBadge(this.categoryList);
    },
    // 相同id 联动
    _sameFoodId (foodId, num, event) {
      const data = this.categoryList;
      data.forEach((item, index) => {
        item.goodsList.forEach((item2, index2) => {
          item2.specs.forEach((item3, index3) => {
            // 相同菜品 id
            if (foodId === item3.id) {
              if (event === "add") {
                console.log("多规格添加菜品");
                item3.goods_num = item3.goods_num + num;
              } else {
                console.log("多规格减少菜品");
                if (item3.goods_num > 0) {
                  item3.goods_num--;
                }
              }
            }
          });
        });
      });
      this.$set(this.categoryList);
    },
    // 减少菜品
    clickSubtractFood (i1, i2) {
      const food = this.foods[i1].goodsList[i2];
      console.log("click food", food);
      let foodId = food.id;
      let categoryId = food.category_id;
      this._sameFoodId(foodId, 1, "sub");
      this._caclCategoryList(categoryId);
      this.saveData();
      if (this.orderType === "scan") {
        this.globalData.SocketTaskSend(this.globalData.SocketTask, foodId, categoryId, 1, "sub", this);
      }
    },
    // 添加菜品
    clickAddFood (i1, i2) {
      const food = this.foods[i1].goodsList[i2];
      console.log("click food", food);
      let foodId = food.id;
      let categoryId = food.category_id;
      this._sameFoodId(foodId, 1, "add");
      this._caclCategoryList(categoryId);
      this.saveData();
      if (this.orderType === "scan") {
        this.globalData.SocketTaskSend(this.globalData.SocketTask, foodId, categoryId, 1, "add", this);
      }
    },
    // 保存数据
    saveData () {
      const _this = this;
      const orderType = this.orderType;
      const func = (key) => {
        _this.globalData[key] = _this.categoryList;
      };
      Utils.operatingData(orderType, "c", func);
    },
    // 下单支付
    goOrder () {
      // orderType 保持不变
      let url = "";
      if (this.orderType === "takeout") {
        url = "../takeoutConfirmOrder/main";
      } else {
        url = "../confirmOrder/main";
      }
      mpvue.navigateTo({ url });
    }
  },
  // 下拉刷新
  onPullDownRefresh (e) {
    if (this.orderType) {
      mpvue.showLoading({
        title: "加载中",
        mask: true
      });
      this.initInfo();
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../../static/styles/scss/variable";

.shopping-car {
  position: relative;
  padding-bottom: 104rpx;
  .content {
    padding: 0 $scss_padding-LR;
    .title {
      font-size: 30rpx;
      color: #242424;
      line-height: 90rpx;
      border-bottom: 2rpx solid #eee;
      &.active {
        font-size: 32rpx;
        font-weight: 700;
        border-bottom: 0;
      }
    }
  }
  .confirm-order {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    align-items: center;
    height: 92rpx;
    padding: 0 14rpx 0 $scss_padding-LR;
    border-bottom: 2rpx solid #eee;
    .total-price {
      font-size: 32rpx;
      font-weight: 700;
      color: #f00;
      line-height: 1;
    }
    .btn-wrapper {
      width: 174rpx;
      height: 72rpx;
    }
  }
}
</style>
