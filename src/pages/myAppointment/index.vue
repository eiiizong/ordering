<template>
  <!-- 预约页面 -->
  <div class="my-appointment">
    <TopNav text="我的预约"></TopNav>
    <div class="content"
         v-if="myAppointments.length>0">
      <div class="item"
           v-for="(item, index) in myAppointments"
           :key="index">
        <div class="dashed-wrapper">
          <div class="cell">
            <div class="left">
              <span>{{stateTextArr[index]}}</span>
              <i v-if="item.state===0"
                 class="icon icon-appointment-wait"></i>
              <i v-if="item.state===1"
                 class="icon icon-appointment-ok"></i>
              <i v-if="item.state===2"
                 class="icon icon-appointment-arrive"></i>
              <i v-if="item.state===3"
                 class="icon icon-appointment-cancel"></i>
              <i v-if="item.state===4"
                 class="icon icon-appointment-reject"></i>
            </div>
            <!-- state 等于2表示该预约已经确定到店了 -->
            <div class="right"
                 v-if="item.state<2">
              <Btn value="取消预约"
                   btnClassName="no"
                   @click="clickCancelAppointment(index)"></Btn>
            </div>
          </div>
          <i class="icon icon-bottom-left"></i>
          <i class="icon icon-bottom-right"></i>
        </div>
        <div class="info">
          <div class="cell">
            <div class="left">店铺名称</div>
            <div class="right">{{item.shops.shop_name}}</div>
          </div>
          <div class="cell">
            <div class="left">店铺地址</div>
            <div class="right">{{item.shops.shop_address}}</div>
          </div>
          <div class="cell">
            <div class="left">联系电话</div>
            <div class="right">{{item.telphone}}</div>
          </div>
          <div class="cell">
            <div class="left">到店人数</div>
            <div class="right">{{item.number}}</div>
          </div>
          <div class="cell">
            <div class="left">预约时间</div>
            <div class="right">{{item.booking_time}}</div>
          </div>
          <div class="cell">
            <div class="left">备注</div>
            <div class="right">{{item.remark}}</div>
          </div>
          <!-- state 大于0表示该预约已经确定预约了 -->
          <div class="btn-order"
               v-show="item.state>0&&item.isCanOrdering"
               @click="immediatelyOrder(index)">
            <span>立即点餐</span>
          </div>
        </div>
      </div>
    </div>
    <div class="no-content"
         v-else>
      <NoPage imgUrl="/static/images/no-appointment.png"></NoPage>
    </div>
    <div class="btn-wrapper">
      <Btn value="添加预约"
           @click="addAppointment"></Btn>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import Btn from "@/components/btn/btn";
import NoPage from "@/components/no-page/no-page";
import Utils from "../../utils/utils.js";

export default {
  data () {
    return {
      // 预约状态转化为文字 0 待确认，1:已确认, 2：已到点，3：取消，4:拒绝
      stateTextArr: [],
      // 预约列表
      myAppointments: [],
      userInfo: {},
      deviceType: ""
    };
  },
  components: {
    Btn,
    TopNav,
    NoPage
  },
  onShow () {
    this.init();
  },
  methods: {
    init () {
      const globalData = this.globalData;

      this.userInfo = globalData.userInfo;
      this.deviceType = globalData.device_type;

      this.requestBookingMyList();

      console.log("this.globalData => ", globalData);
      console.log("this.userInfo => ", this.userInfo);
      console.log("this.deviceType => ", this.deviceType);
    },
    // 初始化我的预约 加入一个 isCanOrdering 属性 判断该预约时间是否已经过时
    initMyAppointments (data) {
      data.forEach(item => {
        item.isCanOrdering = this.compareTime(item.booking_time);
        item.state = parseInt(item.state, 10);
      });
      this.myAppointments = data;
      console.log("this.myAppointments =>", this.myAppointments);
    },
    // 比较时间 现在时间大返回 false
    compareTime (appointmentTime) {
      // ios - 不兼容
      let appointTime = new Date(appointmentTime.replace(/-/g, "/")).getTime();
      console.log("appointTime => ", appointTime);
      let now = new Date().getTime();
      console.log("now =>", now);
      let isCanOrdering = false;
      // 如果现在日期时间的毫秒数大于预约时间
      if (now > appointTime) {
        isCanOrdering = false;
      } else {
        isCanOrdering = true;
      }
      return isCanOrdering;
    },
    // 请求我的预约 API
    requestBookingMyList () {
      const url = "booking/mylist";
      const methods = "POST";
      const data = {};
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        const resultData = result.data;
        this.initStateTextArr(resultData);
        this.initMyAppointments(resultData);
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 请求取消预约 API
    requestCancelAppointment (bookingId) {
      const url = "booking/confirm";
      const methods = "POST";
      const data = {
        "id": bookingId,
        "state": "C"
      };
      const header = {
        "access-token": this.userInfo.access_token,
        "device-type": this.deviceType
      };
      Utils.requestData(url, methods, data, header).then(result => {
        console.log(`发起获取 ${url} 数据请求 成功 => 返回的结果：`, result);
        // 取消预约重新请求数据刷新视图
        this.requestBookingMyList();
      }).catch(err => {
        console.log(`发起获取 ${url} 数据请求 失败 => 返回的结果：`, err);
      });
    },
    // 将状态码转为文字
    initStateTextArr (data) {
      let stateTextArr = [];
      let text = "";
      data.forEach(item => {
        text = Utils.appointmentStateToText(item.state);
        stateTextArr.push(text);
      });
      this.stateTextArr = stateTextArr;
    },
    // 点击取消预约
    clickCancelAppointment (index) {
      Utils.showModal("提示", "是否确定取消该预约").then(() => {
        const id = this.myAppointments[index].id;
        this.requestCancelAppointment(id);
      });
    },
    // 点击 添加预约 执行事件
    addAppointment () {
      const url = "../appointment/main";
      mpvue.navigateTo({ url });
    },
    // 点击 立即点餐 执行事件
    immediatelyOrder (index) {
      const appointment = this.myAppointments[index];
      const bookingId = appointment.id;
      this.globalData.booking_id = bookingId;
      this.globalData.order_type = "booking";

      const url = "../ordering/main";
      mpvue.redirectTo({ url });
    }
  }
};
</script>

<style lang="scss">
@import "../../../static/styles/scss/variable";

.my-appointment {
  width: 100%;
  padding: 32rpx 0 80rpx + 58rpx + 32rpx;
  min-height: 100%;
  .content {
    padding: 0 $scss_padding-LR;
    .item {
      background-color: #fff;
      border-radius: 10rpx;
      margin-bottom: 30rpx;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .dashed-wrapper {
      padding: 0 22rpx;
      .cell {
        display: flex;
        height: 90rpx;
        align-items: center;
        justify-content: space-between;
        font-size: 32rpx;
        font-weight: 700;
        color: #010101;
        .left {
          display: flex;
          align-items: center;
          span {
            margin-right: 12rpx;
          }
        }
        .right {
          .btn {
            font-size: 28rpx;
            color: #979797;
          }
        }
      }
    }
    .info {
      padding: 0 22rpx;
      background-color: #fff;
      padding-bottom: 10rpx;
      border-bottom-right-radius: 10rpx;
      border-bottom-left-radius: 10rpx;
      position: relative;
      .cell {
        display: flex;
        min-height: 72rpx;
        align-items: center;
        font-size: 28rpx;
        color: #000;
        .left {
          width: 140rpx;
        }
        .right {
          flex: 1;
          font-weight: 700;
        }
      }
    }
    .btn-order {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 176rpx;
      height: 176rpx;
      background-image: linear-gradient(59deg, #5feaff 0%, #394cff 100%);
      -webkit-background-image: linear-gradient(
        59deg,
        #5feaff 0%,
        #394cff 100%
      );
      box-shadow: inset -2px 1px 13px 0px rgba(0, 45, 240, 0.35);
      -webkit-box-shadow: inset -2px 1px 13px 0px rgba(0, 45, 240, 0.35);
      color: #fff;
      font-weight: 700;
      font-size: 30rpx;
      clip-path: polygon(100% 0, 100% 100%, 0 100%);
      -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%);
      border-bottom-right-radius: 10rpx;
      span {
        position: absolute;
        right: 22rpx;
        bottom: 18rpx;
        line-height: 36rpx;
        width: 60rpx;
      }
    }
  }
  .btn-wrapper {
    position: fixed;
    left: 0;
    height: 80rpx;
    bottom: 58rpx;
    width: 100%;
    padding: 0 50rpx;
  }
}
</style>
