<template>
  <!-- 我的 页面 -->
  <div class="my">
    <div class="top-nav-wrapper">
    </div>
    <div class="top">
      <div class="img-wrapper">
        <img src="/static/images/my/bg-style.png"
             alt="">
      </div>
      <div class="user">
        <img :src="userInfo.avatar"
             alt="用户头像">
        <div>
          <h3>{{userInfo.username}}</h3>
          <p>{{userInfo.phone}}</p>
        </div>
      </div>
    </div>
    <div class="nav">
      <ul>
        <li>
          <div @click="clickLinkToMyAppointment"
               class="link">
            <img src="/static/images/my/appointment.jpg"
                 alt="">
            <div class="content">
              <h3>我的预约</h3>
              <p>共{{userInfo.booking_num}}个预约</p>
            </div>
          </div>
        </li>
        <li>
          <div @click="clickLinkToMyAddress"
               class="link">
            <img src="/static/images/my/address.jpg"
                 alt="">
            <div class="content">
              <h3>地址管理</h3>
              <p>共{{userInfo.address_num}}个地址</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="cell-wrapper">
      <LinkCell text="向朋友分享这家店"
                className="link"
                iconClassName="icon-share"
                openType="share"></LinkCell>
      <LinkCell text="反馈与帮助"
                iconClassName="icon-help"
                className="link"></LinkCell>
      <LinkCell text="喜欢我们，点赞鼓励一下"
                iconClassName="icon-good"
                className="link"></LinkCell>
      <LinkCell text="关于我们"
                iconClassName="icon-about-us"
                className="link"></LinkCell>
    </div>
  </div>
</template>

<script>
import LinkCell from "@/components/linkCell/linkCell";
import TopNav from "@/components/top-nav/top-nav";
import Utils from "../../utils/utils.js";

export default {
  data () {
    return {
      // 如果未注册 显示默认数据
      userInfo: {
        address_num: 0,
        avatar: "https://wx.qlogo.cn/mmopen/vi_32/JJHquibNyibvoiao3Yx8yCLyjbdh9TBSSRzMn0wExdjyLCRdJib5Z8ibCzcVMyOUicB2AuD53BrNR8bO6dRibprVTcD0g/132",
        booking_num: 0,
        id: 961115,
        phone: "暂未绑定电话号码",
        username: "默认用户名"
      },
      // 标记用户是否已经注册
      isSigned: false,
      categoryList: [],
      shopId: ""
    };
  },
  components: {
    LinkCell,
    TopNav
  },
  created () { },
  onShow () {
    this.checkUserIsSigned();
  },
  mounted () {
    const sceneValue = mpvue.getLaunchOptionsSync();
    console.log("场景值 => ", sceneValue.scene);
  },
  methods: {
    // 检测用户是否已经注册
    checkUserIsSigned () {
      const globalData = this.globalData;

      this.shopId = globalData.shopId;
      const userInfo = globalData.userInfo;

      if (!userInfo.access_token) {
        console.log("access_token为空，用户未注册");
        this.isSigned = false;
      } else {
        console.log("用户已注册");
        this.isSigned = true;
        this.requestUserCenterData();
        if (this.globalData.order_type === "scan") {
          this.globalData.changeCategoryList = data => {
            this.updateBarBadge(data);
          };
          globalData.SocketTaskSendGetAllFoods(globalData.SocketTask, this);
        }
      }
    },
    // 请求数据
    requestUserCenterData () {
      const _this = this;
      const url = "user/center";
      const methods = "POST";
      const data = {};
      const header = {
        "access-token": _this.globalData.userInfo.access_token,
        "device-type": _this.globalData.device_type
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        _this.userInfo = result.data;
        mpvue.stopPullDownRefresh();
        mpvue.hideLoading();
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 点击我的地址
    clickLinkToMyAddress () {
      if (this.isSigned) {
        this.globalData.isChoiceAddress = false;
        let url = "../myAddress/main";
        mpvue.navigateTo({
          url
        });
      } else {
        Utils.showToast("请先绑定手机号");
      }
    },
    // 点击我的预约
    clickLinkToMyAppointment () {
      if (this.isSigned) {
        let url = "../myAppointment/main";
        mpvue.navigateTo({
          url
        });
      } else {
        Utils.showToast("请先绑定手机号");
      }
    },
    // 更新购物车数量
    updateBarBadge (data) {
      Utils.updateShopingCarBarBadge(data);
    }
  },
  // 分享
  onShareAppMessage (e) {
    const shopId = this.shopId;
    if (mpvuePlatform === "wx") {
      return {
        title: "舌尖上的美味，来自灵魂深处的颤抖...",
        path: `/pages/index/main?s=${shopId}&t=share`,
        imageUrl: "/static/images/share.jpg"
      };
    } else if (mpvuePlatform === "my") {
      return {
        title: "舌尖上的美味，来自灵魂深处的颤抖...",
        path: `/pages/index/main?s=${shopId}&t=share`,
        imageUrl: "/static/images/share.jpg"
      };
    }
  },
  // 下拉刷新
  onPullDownRefresh (e) {
    mpvue.showLoading({
      title: "加载中",
      mask: true
    });
    this.checkUserIsSigned();
  }
};
</script>

<style scoped lang="scss">
@import "../../../static/styles/scss/variable";
.my {
  width: 100%;
  min-height: 100vh;
  .top {
    height: 284rpx;
    background-color: $scss_theme-color;
    position: relative;
    .user {
      position: absolute;
      bottom: 118rpx;
      left: $scss_padding-LR;
      display: flex;
      align-items: center;
      color: #fff;
      z-index: 2;
      img {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        margin-right: 34rpx;
      }
      > div {
        font-size: 38rpx;
        font-weight: 700;
        line-height: 1;
        p {
          font-size: 24rpx;
          font-weight: normal;
          padding-top: 18rpx;
          line-height: 1;
        }
      }
    }
    .img-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      img {
        width: 100%;
        height: 176rpx;
        vertical-align: top;
      }
    }
  }
  .nav {
    padding: 36rpx $scss_padding-LR;
    ul {
      display: flex;
      justify-content: space-between;
    }
    .link {
      position: relative;
      color: #fff;
      font-size: 20rpx;
      line-height: 1;
      border-radius: 10rpx;
    }
    img {
      width: 330rpx;
      height: 170rpx;
    }
    .content {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 20rpx;
    }
    h3 {
      font-weight: 700;
      font-size: 32rpx;
      line-height: 1;
      padding: 20rpx 0 10rpx;
    }
  }
  .cell-wrapper {
    padding: 0 $scss_padding-LR;
  }
}
</style>
