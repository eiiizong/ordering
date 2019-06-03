<script>
import Utils from "./utils/utils.js";
export default {
  data () {
    return {
      // 用户是否已经拒绝过授权
      userHasDenied: false
    };
  },
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    // 初始化用户是否已经拒绝授权
    // this.initUserHasDeniedData();
    // 检测用户授权信息
    // this.getSetting();
    console.log("mpvue => ", mpvue);
  },
  onLaunch () {
    if (mpvuePlatform === "wx") {
      const sceneValue = mpvue.getLaunchOptionsSync();
      console.log("场景值 => ", sceneValue.scene);
    }
  },
  onShow () {
    // 检测用户授权信息
    // this.getSetting();
    // this.globalData.socket = "111";
  },
  methods: {
    // 初始化 用户是否已经拒绝过授权
    initUserHasDeniedData () {
      const _this = this;
      // 获取本地用户是否已经拒绝过授权
      Utils.getDataToLocalStorage(Utils.USERHASDENIED).then(result => {
        if (result.data === "true") {
          _this.userHasDenied = true;
        } else {
          _this.userHasDenied = false;
        }
        _this.getSetting();
      }).catch(err => {
        _this.userHasDenied = false;
        _this.getSetting();
        console.log(Utils.USERHASDENIED + "获取出错", err);
      });
    },
    // 检测用户授权设置
    getSetting () {
      const _this = this;
      Utils.getSetting("scope.userLocation").then((result) => {
        console.log("用户地理位置 => 已授权", result);
      }).catch(err => {
        console.log("用户地理位置 => 未授权", err);
        // 如果用户已经拒绝了一次 打开对话框
        if (_this.userHasDenied) {
          _this.openConfirmToOpenSetting();
        } else {
          // 首次调用 拉起用户地理位置信息授权界面
          _this.getUserLocation();
        }
      });
    },
    // 获取用户地理位置授权
    getUserLocation () {
      const _this = this;
      Utils.getUserLocation().then(result => {
        console.log("用户同意授权使用地理位置 =>", result);
      }).catch(err => {
        // 标记用户已经拒绝过授权
        _this.userHasDenied = true;
        Utils.saveDataToLocalStorage(Utils.USERHASDENIED, _this.userHasDenied);
        console.lor("用户拒绝授权使用地理位置 =>", err);
      });
    },
    // 打开对话框
    openConfirmToOpenSetting () {
      const _this = this;
      Utils.openConfirmToOpenSetting().then(result => { }).catch(err => {
        _this.userHasDenied = true;
        Utils.saveDataToLocalStorage(Utils.USERHASDENIED, _this.userHasDenied);
        console.lor("用户再次拒绝授权使用地理位置 =>", err);
      });
    }
  }
};
</script>

<style lang="scss">
/* 这里面的样式最终将编译为 app.wxss */
@import "../static/styles/scss/variable";
// @import "../static/styles/css/icon.css";
@import "../static/styles/css/iconfont.css";
@import "../static/styles/scss/image-icon.scss";

page {
  display: block;
  height: 100%;
  background-color: $scss_bgc;
  > view {
    min-height: 100%;
    background-color: $scss_bgc;
    font-weight: 500;
  }
}
label,
text,
icon,
img,
i,
input,
picker,
view,
textarea,
swiper,
scroll-view,
cover-view,
form {
  box-sizing: border-box;
}

button {
  border: 0;
  padding: 0;
  margin: 0;
  background-color: transparent;
  &::after {
    border: 0;
  }
}
// 隐藏滚动条
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
// 折线容器
.dashed-wrapper {
  position: relative;
  background-color: #fff;
  border-bottom: 2rpx dashed $scss_border-color;
  position: relative;
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;
  padding: 0 40rpx;
  > .icon {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: $scss_bgc;
    border-radius: 50%;
  }
  .icon-bottom-left {
    bottom: 0;
    left: 0;
    transform: translate(-50%, 50%);
  }
  .icon-bottom-right {
    bottom: 0;
    right: 0;
    transform: translate(50%, 50%);
  }
}
// 弹窗
.popup-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1001;
  .popup {
    width: 100%;
    position: fixed;
    z-index: 2;
  }
  .popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}
</style>
