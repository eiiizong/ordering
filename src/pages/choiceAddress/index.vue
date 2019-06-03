<template>
  <!-- 我的 页面 -->
  <div class="choice-address">
    <div class="search">
      <TopNav text="选择地址"></TopNav>
      <div class="wrapper"
           :class="isFocus?'active':''">
        <i class="iconfont icon-search"></i>
        <input type="text"
               confirm-type="search"
               v-model="keyword"
               @confirm="clickSearch"
               @blur="inputOnBlur"
               @focus="inputOnFocus"
               @change="inputOnChange"
               placeholder="请输入您想要搜索的地址">
        <div class="cancel"
             v-if="isFocus"
             @click="cancelSearch">取消</div>
      </div>
    </div>
    <div class="search-result"
         v-if="searchResult.length>0 && searching">
      <scroll-view scroll-y>
        <div class="cell"
             v-for="(item, index) in searchResult"
             @click="clickSearchNearby(index)"
             :key="item.id">
          <div class="title">{{item.title}}</div>
        </div>
      </scroll-view>
    </div>
    <div class="map-wrapper"
         v-if="!searching">
      <map scale="16"
           id="myMap"
           show-location="true"
           @end="regionchangeEnd"
           @regionchange="regionchange"
           :longitude="mapLocation.longitude"
           :latitude="mapLocation.latitude">
        <cover-image class="cover-image-my-location"
                     @tap="myLocation"
                     src="/static/images/back-my-location-one.png" />
        <cover-image class="cover-image"
                     @tap="dropAddress"
                     src="/static/images/address-sign.png" />
      </map>
      <div class="address-list">
        <scroll-view scroll-y>
          <div class="cell"
               v-for="(item, index) in nearbyAddress"
               :key="item.id"
               @click="clickChoiceAddress(index)">
            <i class="iconfont iconfont-address"></i>
            <div class="right">
              <div class="address-title">{{item.title}}</div>
              <div class="address-detail">{{item.address}}</div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import Btn from "@/components/btn/btn";
import Utils from "../../utils/utils";
import QQMapWX from "../../utils/qqmap-wx-jssdk.js";
export default {
  data () {
    return {
      // 腾讯地址服务示例
      qqmapsdk: null,
      // 是否正在搜索
      isFocus: false,
      // 位置信息
      locationInfo: {},
      // 用户目前位置
      userCurrentLocationInfo: {},
      // 输入框输入的关键词
      keyword: "",
      // 关键词搜索结果
      searchResult: [],
      // 附件搜索结果
      nearbyAddress: [],
      // 是否在搜索中
      searching: false,
      // 地图上下文
      mapCtx: null,
      // 地图视图中心经纬度
      mapLocation: {}
    };
  },
  components: {
    Btn,
    TopNav
  },
  onShow () {
    this.initQQmapsdk();
    this.initUserLocationInfo();
  },
  mounted () {
  },
  methods: {
    // 初始化一个 腾讯地图实例
    initQQmapsdk () {
      this.qqmapsdk = new QQMapWX({
        key: "U7JBZ-STBWQ-S5Y56-GHLV3-OQL2T-ACF56"
      });
    },
    // 初始化用户地理位置
    initUserLocationInfo () {
      const editorAddressInfo = this.globalData.editorAddressInfo;
      if (editorAddressInfo.latitude && editorAddressInfo.longitude) {
        // 修改位置经纬度
        this.locationInfo = {
          latitude: editorAddressInfo.latitude,
          longitude: editorAddressInfo.longitude
        };
        this.mapLocation = this.locationInfo;
        this.reverseGeocoder(this.locationInfo);
        // this.userCurrentLocationInfo = globalData.userCurrentLocationInfo;
      } else {
        // 我的经纬度
        this.getUserLocation();
      }
      console.log("this.globalData => ", this.globalData);
      console.log("this.locationInfo => ", this.locationInfo);
    },
    // 获取用户地理位置信息 用于首次加载
    getUserLocation () {
      Utils.getUserLocation().then(result => {
        console.log(result);
        const location = {
          latitude: result.latitude,
          longitude: result.longitude
        };
        this.userCurrentLocationInfo = location;
        this.mapLocation = location;
        this.reverseGeocoder(location);
      });
    },
    // 点击搜索按钮执行的事件
    clickSearch (e) {
      // 输入输入框中的值
      this.keyword = e.target.value;
      this.getSuggestion(this.keyword);
    },
    // 触发关键词输入提示事件
    getSuggestion (keyword, get_subpois = 0, page_size = 20) {
      // location=lat,lng
      var _this = this;
      // 调用用户输入关键词提示接口
      _this.qqmapsdk.getSuggestion({
        // 搜索关键词
        keyword,
        page_size,
        // 是否返回子地点，如大厦停车场、出入口等取值： 0 默认不返回
        get_subpois,
        // 搜索成功后的回调
        success (res) {
          console.log(`
         *** 搜索关键词 ***
          搜索关键词 => ${keyword}
            每页条目数，最大限制为20条 =>
            搜索结果 =>
          `, res);

          const resultData = res.data;
          const len = resultData.length;
          let sug = [];
          for (let i = 0; i < len; i++) {
            let item = resultData[i];
            let addressItem = {
              title: item.title,
              id: item.id,
              addr: item.address,
              city: item.city,
              latitude: item.location.lat,
              longitude: item.location.lng
            };
            sug.push(addressItem);
          }
          _this.searchResult = sug;
        },
        fail (err) {
          console.log("关键词搜索提示 出错了", err);
        }
      });
    },
    // 地点搜索
    addressSearch (keyword, location, region, auto_extend = 0, page_size = 20) {
      var _this = this;
      // 调用接口
      _this.qqmapsdk.search({
        // 搜索关键词
        keyword,
        // 每页条目数，最大限制为20条
        page_size,
        // 指定地区名称，不自动扩大范围
        region,
        // 位置坐标
        location,
        // 默认为 1， 自动扩大搜索范围
        auto_extend,
        // 搜索成功后的回调函数
        success (res) {
          console.log(`
            *** 地点搜索 ***
            搜索关键词 => ${keyword}
            每页条目数，最大限制为20条 =>
            指定搜索地区名称 => ${region}
            位置坐标 => ${location.latitude + " " + location.longitude}
            搜索结果 =>
          `, res);

          const resultData = res.data;
          const len = resultData.length;
          let nearbyAddress = [];
          for (let i = 0; i < len; i++) {
            let item = resultData[i];
            let addrressItem = {
              title: item.title,
              id: item.id,
              address: item.address,
              latitude: item.location.lat,
              longitude: item.location.lng
            };
            nearbyAddress.push(addrressItem);
          }
          _this.nearbyAddress = nearbyAddress;
          // 更改当前是否处于搜索状态
          _this.searching = false;
        },
        fail (err) {
          console.log("附件地点搜索 出错了", err);
        }
      });
    },
    // 根据经纬度 获取位置
    reverseGeocoder (location = { latitude: "", longitude: "" }) {
      var _this = this;
      _this.qqmapsdk.reverseGeocoder({
        // location: { latitude: 39.984060,longitude: 116.30752}
        location,
        success (res) { // 成功后的回调
          console.log(`
          *** 根据经纬度 获取位置 ***
            位置坐标 => ${location.latitude + " " + location.longitude}
            搜索结果 =>
          `, res);
          // 调用结果正常
          if (res.status === 0) {
            let resultData = res.result;
            // 搜索关键词 以地址搜索作为关键词
            let keyword = resultData.address;
            let city = resultData.address_component.city;
            let resultLocation = {
              longitude: resultData.location.lng,
              latitude: resultData.location.lat
            };
            // 地点搜索
            _this.addressSearch(keyword, resultLocation, city);
          }
        },
        fail (err) {
          console.log("经纬度解析为地址 出错了", err);
        }
      });
    },
    // 点击搜索列表item
    clickSearchNearby (index) {
      const address = this.searchResult[index];
      console.log("点击搜索列表搜索的地址 => ", address);
      const keyword = address.title;
      const location = {
        latitude: address.latitude,
        longitude: address.longitude
      };
      const city = address.city;
      // 设置视图的经纬度
      this.mapLocation = location;
      this.addressSearch(keyword, location, city);
    },
    // 确认选择地址
    clickChoiceAddress (index) {
      const address = this.nearbyAddress[index];
      console.log("selectedAddress => ", address);
      this.globalData.selectedAddress = address;
      mpvue.navigateBack({
        delta: 1
      });
    },
    // 搜索框输入
    inputOnChange (e) {
      console.log(e);
    },
    // 搜索框失去焦点
    inputOnBlur () {
      this.isFocus = !this.isFocus;
    },
    // 搜索框获取焦点
    inputOnFocus () {
      this.isFocus = !this.isFocus;
      this.searching = true;
    },
    // 取消搜索
    cancelSearch () {
      this.searching = false;
    },
    regionchange (e) {
      console.log("地图视野发送变化...", e);
    },
    regionchangeEnd (e) {
      console.log("地图视野发送变化 结束", e);
      const _this = this;
      let timer;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        if (e.mp.type === "end" && (e.mp.causedBy === "scale" || e.mp.causedBy === "drag")) {
          console.log("地图视野发送变化 结束", e);
          _this.mapCtx = mpvue.createMapContext("myMap");
          _this.mapCtx.getCenterLocation({
            type: "gcj02",
            success (res) {
              console.log(res);
              const location = {
                latitude: res.latitude,
                longitude: res.longitude
              };
              _this.reverseGeocoder(location);
            },
            fail (err) {
              console.log("获取地图中心位置经纬度 出错了", err);
            }
          });
        }
      }, 1000);
    },
    myLocation (e) {
      console.log("回到我的位置");
      this.getUserLocation(this.oldLocation);
    },
    dropAddress (e) {
      console.log("位置");
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";
.choice-address {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .search {
    padding: 0 $scss_padding-LR;
    .wrapper {
      position: relative;
      padding: 20rpx 0;
      input {
        width: 100%;
        font-size: 30rpx;
        line-height: 1;
        padding-left: 80rpx;
        padding-right: 100rpx;
        height: 84rpx;
        border: 2rpx solid #888;
        background-color: #fff;
        border-radius: 50px;
        transition: all 0.3s;
      }
      .icon-search {
        position: absolute;
        top: 50%;
        left: 30rpx;
        font-size: 34rpx;
        transform: translateY(-50%);
        color: #888;
        transition: all 0.3s;
      }
      .cancel {
        position: absolute;
        top: 50%;
        right: 0;
        font-size: 30rpx;
        padding: 0 20rpx;
        width: auto;
        transform: translateY(-50%);
        color: $scss_theme-color;
        transition: all 0.3s;
        opacity: 0;
      }
      &.active {
        input {
          border-color: $scss_theme-color;
        }
        .icon-search {
          color: $scss_theme-color;
        }
        .cancel {
          opacity: 1;
        }
      }
    }
  }
  .search-result {
    flex: 1;
    width: 100%;
    overflow: hidden;
    background-color: #f7f7f7;
    scroll-view {
      height: 100%;
    }
    .cell {
      height: 82rpx;
      border-bottom: 2rpx solid #eee;
      padding: 0 $scss_padding-LR;
      font-size: 30rpx;
      color: #282828;
      align-items: center;
      display: flex;
      div {
        line-height: 1;
      }
      .title {
        font-weight: 600;
      }
      .address {
        font-size: 24rpx;
        color: #999;
      }
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .map-wrapper {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    map {
      width: 100%;
      height: 500rpx;
      position: relative;
    }
    .address-list {
      width: 100%;
      flex: 1;
      overflow: hidden;
      scroll-view {
        height: 100%;
      }
      .cell {
        width: 100%;
        padding: 0 $scss_padding-LR;
        height: 102rpx;
        display: flex;
        align-items: center;
        border-bottom: 2rpx solid #eee;
        &:last-child {
          border-bottom: 0;
        }
        .icon-address {
          font-size: 38rpx;
        }
        .right {
          flex: 1;
          padding-left: 20rpx;
          .address-title {
            width: 100%;
            font-weight: 700;
            line-height: 1.2;
            font-size: 30rpx;
          }
          .address-detail {
            width: 100%;
            font-size: 24rpx;
            line-height: 1.2;
            color: #888;
          }
        }
      }
    }
  }
  .cover-image-my-location {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 72rpx;
    height: 72rpx;
  }
  .cover-image {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 72rpx;
    height: 100rpx;
    margin-top: -50rpx;
    transform: translate(-50%, -50%);
  }
}
</style>
