<template>
  <!-- 我的 页面 -->
  <div class="add-address">
    <TopNav :text="isEditorAddress?'编辑地址':'添加地址'"></TopNav>
    <div class="content">
      <div class="wrapper">
        <div class="input-wrapper">
          <label for="peopleName">收货人</label>
          <input type="text"
                 id="peopleName"
                 maxlength="4"
                 @input="inputAcceptName"
                 v-model="addressInfo.accept_name"
                 placeholder="请输入收货人真实姓名">
        </div>
        <div class="input-wrapper">
          <label for="tel">手机号</label>
          <input type="number"
                 class="input"
                 id="tel"
                 maxlength="11"
                 @input="inputTelPhone"
                 v-model="addressInfo.telphone"
                 placeholder="请输入收货人手机号">
        </div>
      </div>
      <div class="wrapper">
        <div class="input-wrapper">
          <label for="">性别</label>
          <radio-group class="radio-group"
                       @change="radioChange">
            <label class="radio"
                   :class="item.checked?'active':''"
                   v-for="item in genders"
                   :key="item.value">
              <radio :value="item.value"
                     :checked="item.checked" />
              <div class="radio-icon"></div>
              <span>{{item.name}}</span>
            </label>
          </radio-group>
        </div>
      </div>
      <div class="wrapper">
        <div class="input-wrapper">
          <label for="address">详细地址</label>
          <textarea class="textarea"
                    id="address"
                    v-if="!isShowModal"
                    auto-height
                    @input="inputAddress"
                    :show-count="false"
                    v-model="addressInfo.address"
                    placeholder="请输入收货人详细地址">
          </textarea>
          <input class="textarea"
                 id="address"
                 v-else
                 auto-height
                 @input="inputAddress"
                 v-model="addressInfo.address"
                 placeholder="请输入收货人详细地址" />
          <i class="iconfont icon-get-location"
             @click="clickToChoiceAddress"></i>
        </div>
      </div>
      <!-- 设置为默认地址 -->
      <div class="checkbox-wrapper">
        <checkbox-group @change="checkboxChange"
                        class="checkbox-group">
          <label class="checkbox"
                 :class="ckeckboxIsChecked?'active':''">
            <checkbox :value="ckeckboxIsChecked?'1':'0'"
                      :checked="ckeckboxIsChecked" />
            <div class="checkbox-icon"><i class="iconfont icon-gou"></i></div>
            <span>设为默认地址</span>
          </label>
        </checkbox-group>
      </div>
    </div>
    <div class="btn-wrapper">
      <Btn :value="isEditorAddress?'确定修改':'确定添加'"
           @click="clickAddAddress"
           :disabled="btnIsDisabled"></Btn>
    </div>
    <div v-if="isShowModal">
      <ShowModal @clickCancel="showModalCancel"
                 openType=""
                 title="提示"
                 content="检测到您没打开洋富柜儿的定位权限，是否去设置打开？"
                 @clickConfirm="showModalConfirm"></ShowModal>
    </div>
  </div>
</template>

<script>
import Btn from "@/components/btn/btn";
import ShowModal from "@/components/showModal/showModal";
import Utils from "../../utils/utils";
import QQMapWX from "../../utils/qqmap-wx-jssdk.js";
export default {
  data () {
    return {
      userInfo: {},
      ckeckboxIsChecked: true,
      // 地址信息
      addressInfo: {},
      // 性别选择 数据
      genders: [
        {
          value: "1",
          name: "先生",
          // 新增默认选中
          checked: false
        },
        {
          value: "2",
          name: "女士",
          checked: false
        }
      ],
      // 添加地址按钮是否可用
      btnIsDisabled: true,
      // 腾讯地址服务示例
      qqmapsdk: null,
      // 是否是编辑地址 false 为新增地址
      isEditorAddress: false,
      // 标记用户是否已经拒绝授权过
      userHasDenied: false,
      // 授权弹窗
      isShowModal: false,
      // 用户当前位置信息 用于检测用户是否已经授权过
      userCurrentLocationInfo: {},
      deviceType: ""
    };
  },
  components: {
    Btn,
    ShowModal
  },
  onShow () {
    this.initInfo();
    this.getUserLocationSetting();
  },
  mounted () {
    if (mpvuePlatform === "wx") {
      this.initQqmapsdk();
    }
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;

      this.isEditorAddress = globalData.isEditorAddress;
      this.deviceType = globalData.device_type;
      this.userInfo = globalData.userInfo;

      // 如果存在 编辑地址信息
      if (globalData.isEditorAddress) {
        this.addressInfo = globalData.editorAddressInfo;
        this.setNavigationBarTitle();
      } else {
        // 新增地址
        this.addressInfo = {
          // 姓名
          accept_name: "",
          // 性别
          gender: "0",
          // 电话
          telphone: "",
          // 地址
          address: "",
          long: "",
          lat: "",
          is_default: false
        };
      }

      // 如果存在选择的地址
      if (globalData.selectedAddress) {
        this.addressInfo = {
          ...this.addressInfo,
          ...globalData.selectedAddress
        };
      }

      this.checkBtnIsDisabled();
      this.initGenders(this.addressInfo);
      this.initIsDefaultAddress(this.addressInfo);

      console.log("this.globalData => ", globalData);
      console.log("this.addressInfo => ", this.addressInfo);
      console.log("this.isEditorAddress => ", this.isEditorAddress);
      console.log("this.deviceType => ", this.deviceType);
      console.log("this.userInfo => ", this.userInfo);
    },
    // 初始化腾讯地图
    initQqmapsdk () {
      this.qqmapsdk = new QQMapWX({
        key: "U7JBZ-STBWQ-S5Y56-GHLV3-OQL2T-ACF56"
      });
    },
    // 设置标题
    setNavigationBarTitle () {
      if (this.isEditorAddress) {
        Utils.setNavigationBarTitle("编辑地址");
      }
    },
    // showModal 点击取消
    showModalCancel () {
      this.isShowModal = false;
    },
    // showModal 点击确认
    showModalConfirm () {
      this.isShowModal = false;
      // 打开用户授权设置
      mpvue.openSetting();
    },
    // 初始化性别
    initGenders (addressInfo) {
      if (addressInfo.gender === "2") {
        console.log("女士");
        // 女士
        this.genders[0].checked = false;
        this.genders[1].checked = true;
        this.addressInfo.gender = addressInfo.gender;
      } else {
        // 先生
        console.log("先生");
        this.genders[0].checked = true;
        this.genders[1].checked = false;
        this.addressInfo.gender = "1";
      }
      console.log("this.addressInfo.gender", this.addressInfo.gender);
    },
    // 初始化 CkeckboxIsChecked 是否是默认地址
    initIsDefaultAddress (addressInfo) {
      if (addressInfo.is_default === "1") {
        this.ckeckboxIsChecked = true;
        this.addressInfo.is_default = "1";
      } else {
        this.ckeckboxIsChecked = false;
        this.addressInfo.is_default = "0";
      }
    },
    // 检测用户地理位置授权设置
    getUserLocationSetting () {
      const openSetting = () => {
        this.isShowModal = true;
      };
      Utils.getSetting("scope.userLocation", openSetting).then((result) => {
        console.log("检测用户地理位置授权 => 已授权", result);
        this.getUserLocation();
      }).catch(err => {
        this.getUserLocation();
        console.log("检测用户地理位置授权 => 未授权", err);
      });
    },
    // 获取用户地理位置授权
    getUserLocation () {
      console.log("正在获取用户位置信息");
      Utils.getUserLocation().then(result => {
        console.log("用户已同意授权使用地理位置 =>", result);
        this.userCurrentLocationInfo = result;
      }).catch(err => {
        // 标记用户已经拒绝过授权
        console.lor("用户已拒绝授权使用地理位置 =>", err);
      });
    },
    // 请求添加地址或者修改地址
    requestEditorAddress (addressId) {
      let url = "";
      if (this.isEditorAddress) {
        // 编辑地址
        url = "address/created/" + addressId;
      } else {
        // 创建地址
        url = "address/created";
      }
      const methods = "POST";
      const data = {
        "accept_name": this.addressInfo.accept_name,
        "gender": this.addressInfo.gender,
        "telphone": this.addressInfo.telphone,
        "address": this.addressInfo.address,
        "long": this.addressInfo.long,
        "lat": this.addressInfo.lat,
        "is_default": this.addressInfo.is_default
      };
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        mpvue.navigateBack({
          delta: 1
        });
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 地址解析
    geocoder (address) {
      const _this = this;
      this.qqmapsdk.geocoder({
        address,
        success (res) {
          console.log(res);
          if (res.status === 0) {
            if (res.result) {
              const location = res.result.location;
              _this.addressInfo = {
                ..._this.addressInfo,
                lat: location.lat,
                long: location.lng
              };
              _this.requestEditorAddress(_this.addressInfo.id);
            }
          } else {
            Utils.showToast("请输入正确的地址");
          }
        },
        fail (err) {
          console.log(err);
          Utils.showToast("请输入正确的地址");
        }
      });
    },
    // 点击添加地址
    clickAddAddress () {
      if (mpvuePlatform === "wx") {
        // 解析地址 成功则请求添加或者编辑地址
        this.geocoder(this.addressInfo.address);
      } else if (mpvuePlatform === "my") {
        this.requestEditorAddress(this.addressInfo.id);
      }
    },
    // 一键定位
    clickToChoiceAddress () {
      const _this = this;
      // 如果用户为授权 获取用于地理位置 并退出执行
      if (!this.userCurrentLocationInfo.latitude) {
        this.getUserLocation();
        return false;
      }
      // 微信执行
      if (mpvuePlatform === "wx") {
        if (this.isEditorAddress) {
          // 编辑地址
          this.globalData.editorAddressInfo = {
            ...this.addressInfo,
            latitude: this.addressInfo.lat,
            longitude: this.addressInfo.long
          };
        } else {
          // 新增地址
          this.globalData.editorAddressInfo = {
            ...this.addressInfo,
            latitude: this.userCurrentLocationInfo.latitude,
            longitude: this.userCurrentLocationInfo.longitude
          };
        }
        const url = "../choiceAddress/main";
        mpvue.navigateTo({
          url
        });
      }
      // 支付宝执行
      if (mpvuePlatform === "my") {
        mpvue.chooseLocation({
          success (res) {
            // 开发工具 选择后页面不执行 onShow
            _this.addressInfo = {
              ..._this.addressInfo,
              address: res.address,
              long: res.latitude,
              lat: res.longitude
            };

            _this.globalData.selectedAddress = {
              ..._this.addressInfo,
              address: res.address,
              long: res.latitude,
              lat: res.longitude
            };
          }
        });
      }
    },
    // 收货人姓名输入
    inputAcceptName (e) {
      this.checkBtnIsDisabled();
    },
    // 收货人电话输入
    inputTelPhone (e) {
      this.checkBtnIsDisabled();
    },
    // 收货人地址输入
    inputAddress (e) {
      this.checkBtnIsDisabled();
    },
    // 检测确认按钮是否可用
    checkBtnIsDisabled () {
      const data = this.addressInfo;
      const telIsOK = /^1(3|4|5|7|8)\d{9}$/.test(data.telphone);
      if (data.accept_name === "") {
        this.btnIsDisabled = true;
      } else if (!telIsOK) {
        this.btnIsDisabled = true;
      } else if (data.address === "") {
        this.btnIsDisabled = true;
      } else {
        this.btnIsDisabled = false;
      }
    },
    // radio 选择时触发
    radioChange (e) {
      console.log(e);
      let value = e.target.value;
      const data = this.genders;
      data.map(item => {
        if (value === item.value) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.addressInfo.gender = value;
      console.log("this.addressInfo.gender", this.addressInfo.gender);
    },
    // checkbox 选择时触发
    checkboxChange (e) {
      this.ckeckboxIsChecked = !this.ckeckboxIsChecked;
      if (this.ckeckboxIsChecked) {
        this.addressInfo.is_default = "1";
      } else {
        this.addressInfo.is_default = "0";
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.add-address {
  width: 100%;
  position: relative;
  min-height: 100%;
  padding: 20rpx 0 34rpx + 80rpx + 20rpx;
  .content {
    .wrapper {
      margin-bottom: 20rpx;
      background-color: #fff;
      padding: 0 $scss_padding-LR;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .input-wrapper {
      font-size: 30rpx;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      min-height: 100rpx;
      border-bottom: 2rpx solid #eee;
      padding: 20rpx 0;
      &:last-child {
        border-bottom: 0;
      }
      label {
        width: 140rpx;
      }
      .radio-group,
      input,
      textarea {
        flex: 1;
        line-height: 1.4;
      }
      textarea {
        padding-right: 20rpx;
      }
      .icon-get-location {
        color: $scss_theme_color;
        font-size: 50rpx;
      }
      .radio-group {
        display: flex;
        align-items: center;
        .radio {
          margin-right: 40rpx;
          display: flex;
          align-items: center;
          .radio-icon {
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            border: 2rpx solid #aaa;
            margin-right: 10rpx;
            position: relative;
            &::before {
              content: "";
              background-color: $scss_theme_color;
              width: 20rpx;
              height: 20rpx;
              position: absolute;
              top: 50%;
              left: 50%;
              margin-top: -10rpx;
              margin-left: -10rpx;
              transform: scale(0);
              opacity: 0;
              transition: all 0.3s;
              border-radius: 50%;
            }
          }
          span {
            line-height: 1;
          }
          radio {
            display: none;
          }
          &.active {
            .radio-icon {
              border-color: $scss_theme_color;
              &::before {
                transform: scale(1);
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
  .checkbox-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-right: $scss_padding-LR;
    .checkbox-group {
      .checkbox {
        display: flex;
        align-items: center;
        font-size: 30rpx;
        checkbox {
          display: none;
        }
        .checkbox-icon {
          width: 40rpx;
          height: 40rpx;
          border: 2rpx solid #999;
          margin-right: 10rpx;
          border-radius: 50%;
          position: relative;
          transition: border-color 0.3s;
          display: flex;
          .icon-gou {
            font-size: 30rpx;
            line-height: 1;
            color: $scss_theme_color;
            margin: auto;
            transform: scale(0);
            transition: all 0.3s;
            opacity: 0;
          }
        }
        &.active {
          .checkbox-icon {
            border-color: $scss_theme_color;
            .icon-gou {
              transform: scale(1);
              opacity: 1;
            }
          }
        }
      }
    }
  }
  // 确定按钮
  .btn-wrapper {
    position: fixed;
    bottom: 34rpx;
    height: 80rpx;
    left: 0;
    width: 100%;
    padding: 0 50rpx;
  }
}
</style>
