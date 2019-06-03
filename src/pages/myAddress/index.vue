<template>
  <!-- 我的 页面 -->
  <div class="my-address">
    <TopNav text="我的地址"></TopNav>
    <div class="cell-wrapper"
         v-if="myAddress.length>0">
      <CellAddress :data="item"
                   :isChoice="isChoiceAddress"
                   v-for="(item, index) in myAddress"
                   :key="item.id"
                   :className="index===defaultAddressIndex? 'active': ''"
                   @clickDelete="handleDeleteAddress(index)"
                   @clickChoiceAddress="clickChoiceAddress(index)"
                   @clickEditor="handleEditorAddress(index)"></CellAddress>
    </div>
    <div class="no-address"
         v-else>
      <NoPage imgUrl="/static/images/no-address.png"></NoPage>
    </div>

    <div class="btn-wrapper">
      <Btn :value="isChoiceAddress?'确定':'添加地址'"
           @click="addAddress"></Btn>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import CellAddress from "@/components/cell-address/cell-address";
import NoPage from "@/components/no-page/no-page";
import Btn from "@/components/btn/btn";
import Utils from "../../utils/utils.js";

export default {
  data () {
    return {
      userInfo: {},
      myAddress: [],
      deviceType: "",
      // 是否是选择地址
      isChoiceAddress: false,
      // 默认地址序号
      defaultAddressIndex: 0
    };
  },

  components: {
    CellAddress,
    Btn,
    TopNav,
    NoPage
  },
  created () {

  },
  onShow () {
    // 每次页面展示请求一次api 获取我的地址列表
    this.initInfo();
  },
  mounted () {
  },
  methods: {
    // 初始化数据
    initInfo () {
      const globalData = this.globalData;

      this.userInfo = globalData.userInfo;
      this.deviceType = globalData.device_type;

      if (globalData.isChoiceAddress === true) {
        this.isChoiceAddress = true;
        this.setNavigationBarTitle();
      }
      this.requestGetAddressData();
      console.log("this.globalData => ", this.globalData);
      console.log("this.isChoiceAddress => ", this.isChoiceAddress);
      console.log("this.deviceType => ", this.deviceType);
      console.log("this.userInfo => ", this.userInfo);
    },
    // 设置标题
    setNavigationBarTitle () {
      if (this.isChoiceAddress) {
        mpvue.setNavigationBarTitle({
          title: "选择地址"
        });
      }
    },
    // 计算默认地址序号
    caclDefaultAddressIndex (data) {
      data.some((item, index) => {
        if (item.is_default === "1") {
          this.defaultAddressIndex = index;
          return true;
        }
      });
    },
    // 请求地址列表
    requestGetAddressData () {
      const url = "address/list";
      const methods = "POST";
      const data = {};
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        const resultdata = result.data;
        this.myAddress = resultdata;
        this.caclDefaultAddressIndex(resultdata);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 删除地址请求
    requestDeleteAddressData (addressId) {
      const url = "address/delete/" + addressId;
      const methods = "POST";
      const data = {};
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        this.requestGetAddressData();
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 编辑地址
    handleEditorAddress (index) {
      console.log("editor", index);
      const addressInfo = this.myAddress[index];
      console.log("addressInfo => ", addressInfo);
      this.globalData.isEditorAddress = true;
      this.globalData.editorAddressInfo = addressInfo;
      this.globalData.selectedAddress = null;
      const url = "../addAddress/main";
      mpvue.navigateTo({ url });
    },
    // 删除地址
    handleDeleteAddress (index) {
      const addressId = this.myAddress[index].id;
      console.log("addressId => ", addressId);
      Utils.showModal("提示", "是否确定删除该地址").then(() => {
        this.requestDeleteAddressData(addressId);
      });
    },
    // 添加地址
    addAddress () {
      if (this.isChoiceAddress) {
        const data = this.myAddress[this.defaultAddressIndex];
        this.globalData.takeoutAddressInfo = data;
        mpvue.navigateBack({
          delta: 1
        });
      } else {
        this.globalData.isEditorAddress = false;
        this.globalData.editorAddressInfo = null;
        // 清空 addressInfo
        this.globalData.addressInfo = null;
        this.globalData.selectedAddress = null;
        const url = "../addAddress/main";
        mpvue.navigateTo({ url });
      }
    },
    // 选择地址
    clickChoiceAddress (index) {
      if (this.isChoiceAddress) {
        this.defaultAddressIndex = index;
        const addressInfo = this.myAddress[index];
        console.log("选择地址 addressInfo => ", addressInfo);
        this.globalData.addressInfo = addressInfo;
      }
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.my-address {
  width: 100%;
  position: relative;
  min-height: 100%;
  padding: 30rpx 0 114rpx + 30rpx;
  .cell-wrapper {
    padding: 0 $scss_padding-LR;
    .cell-address {
      margin-bottom: 20rpx;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .btn-wrapper {
    position: fixed;
    bottom: 34rpx;
    left: 0;
    height: 80rpx;
    width: 100%;
    padding: 0 50rpx;
  }
}
</style>
