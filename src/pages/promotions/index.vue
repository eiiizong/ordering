<template>
  <!-- 我的 页面 -->
  <div class="promotions">
    <TopNav text="优惠活动"></TopNav>
    <div class="content">
      <DiscountCoupon v-for="(item, index) in activityList"
                      :key="item.id"
                      :data="item"
                      :disabled="!canUsePromotions[index].isCanUse"
                      :shopInfo="shopInfo"
                      @clickUseCoupon="clickUseCoupon(index)"></DiscountCoupon>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import DiscountCoupon from "@/components/discount-coupon/discount-coupon";

export default {
  data () {
    return {
      shopInfo: {},
      activityList: [
        {
          "id": "1",
          "activity_name": "活动名",
          "content": "描述",
          // 1 满减 2折扣
          "type": "1",
          "full_amount": "50.00",
          "minus_amount": "5.00",
          "discount": "5.00",
          "category_ids": 3
        }
      ],
      // 商品总价
      goodsTotalPrice: "",
      // 能够使用的优惠券
      canUsePromotions: [],
      // 所选菜品 价格优惠状态
      foodsActiveTotalprices: [],
      // 是否只是查看优惠券优惠详情
      onlySeePromotions: false
    };
  },

  components: {
    DiscountCoupon,
    TopNav
  },
  onShow () {
    this.initInfo();
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;

      this.shopInfo = globalData.shopInfo;
      this.activityList = globalData.activity_list;
      this.onlySeePromotions = globalData.onlySeePromotions;
      this.foodsActiveTotalprices = globalData.foodsActiveTotalprices;

      this.initCanUsePromotions(this.activityList, this.foodsActiveTotalprices);

      console.log("globalData => ", this.globalData);
      console.log("onlySeePromotions => ", this.onlySeePromotions);
      console.log("foodsActiveTotalprices => ", this.foodsActiveTotalprices);
      console.log("shopInfo => ", this.shopInfo);
      console.log("activityList => ", this.activityList);
    },
    // 初始化哪些优惠券可用
    initCanUsePromotions (activityList, foodsActiveTotalprices) {
      let arr = [];
      // 只是查看优惠券详情 非下单时
      if (this.onlySeePromotions) {
        activityList.forEach(item => {
          let obj = {
            isCanUse: false
          };
          arr.push(obj);
        });
        this.canUsePromotions = arr;
      } else {
        arr = foodsActiveTotalprices;
      }
      this.canUsePromotions = arr;
    },
    // 使用优惠券
    clickUseCoupon (index) {
      const selectedActive = this.activityList[index];
      this.globalData.selected_active = selectedActive;
      console.log("selected_active => ", selectedActive);
      mpvue.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.promotions {
  padding: 32rpx $scss_padding-LR;
  .content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .discount-coupon {
    margin-bottom: 24rpx;
  }
}
</style>
