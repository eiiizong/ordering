<template>
  <!-- 预约页面 -->
  <div class="appointment input-box">
    <TopNav text="预约"></TopNav>
    <form class="form">
      <h3 class="title">
        <span>填写信息</span>
        <i class="icon icon-input-info"></i>
      </h3>
      <div class="input-wrapper">
        <label for="">
          <i class="icon icon-tel"></i>
          <span>联系电话</span>
        </label>
        <input type="number"
               placeholder="请填写联系电话"
               maxlength="11"
               @input="inputTelphone"
               @blur="initBtnIsDisabled"
               v-model="inputValue.telphone">
      </div>
      <div class="input-wrapper">
        <label for="">
          <i class="icon icon-people-num"></i>
          <span>到店人数</span>
        </label>
        <input type="number"
               placeholder="请填写到店人数"
               maxlength="2"
               @input="inputNumber"
               v-model="inputValue.number">
      </div>
      <div class="input-wrapper">
        <label for="">
          <i class="icon icon-time"></i>
          <span>预约日期</span>
        </label>
        <picker @change="bindPickerChangeBookingDate"
                :start="startDay"
                :end="endDay"
                class="picker-wrapper"
                mode="date">
          <div class="picker">
            {{inputValue.booking_date}}
          </div>
        </picker>
      </div>
      <div class="input-wrapper">
        <label for="">
          <i class="icon icon-time"></i>
          <span>预约时间</span>
        </label>
        <picker @change="bindPickerChangeBookingTime"
                :start="startTime"
                :end="endTime"
                :style="{flex: '1 1 0%'}"
                class="picker-wrapper"
                mode="time">
          <div class="picker">
            {{inputValue.booking_time}}
          </div>
        </picker>
      </div>
      <div class="input-wrapper remark">
        <label for="remark">
          <i class="icon icon-remark"></i>
          <span>备注</span>
        </label>
        <input type="text"
               id="remark"
               placeholder="有什么需要吩咐吗"
               v-model="inputValue.remark"
               maxlength="25"
               @input="inputRemark">
        <div class="limit-hint">
          <span>{{remarkLength}}</span>/<span>25</span>
        </div>
      </div>
    </form>

    <div class="tips">
      <h4>温馨提示：</h4>
      <p>1.尊敬的顾客：餐品无限量食用，但禁止浪费xx祝您用餐愉快。</p>
      <p>2.请各位顾客按需拿取，切勿浪费。</p>
      <p>3.吃多少，拿多少，食物在那跑不了。</p>
      <p>4.禁忌甜食者，请到无糖专区。</p>
    </div>
    <div class="btn-wrapper">
      <Btn value="确定预约"
           :disabled="btnIsDisabled"
           @click="clickSureAppointment"></Btn>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/top-nav/top-nav";
import Btn from "@/components/btn/btn";
import Utils from "../../utils/utils";

export default {
  data () {
    return {
      userInfo: {},
      shopId: "",
      deviceType: "",
      inputValue: {
        telphone: "",
        number: "",
        booking_time: "请选择预约时间",
        remark: "",
        booking_date: "请选择预约日期"
      },
      // 标记备注已输入内容长度
      remarkLength: 0,
      // 确定预约按钮是否可用
      btnIsDisabled: true,
      startDay: "",
      endDay: "",
      startTime: "",
      endTime: "23:59"
    };
  },

  components: {
    Btn,
    TopNav
  },
  onShow () {
    this.initInfo();
  },
  methods: {
    initInfo () {
      const globalData = this.globalData;

      this.userInfo = globalData.userInfo;
      this.shopId = globalData.shopId;
      this.deviceType = globalData.device_type;
      this.inputValue = {
        telphone: "",
        number: "",
        booking_time: "请选择预约时间",
        remark: "",
        booking_date: "请选择预约日期"
      };
      this.inputValue.telphone = this.userInfo.phone;

      this.initStratTime();

      this.checkBtnIsDisabled();

      console.log("this.globalData => ", globalData);
      console.log("this.userInfo => ", this.userInfo);
      console.log("this.shopId => ", this.shopId);
      console.log("this.deviceType => ", this.deviceType);
    },
    // 初始化时间 限制时间选择
    initStratTime () {
      let now = new Date();
      let y = now.getFullYear();
      let month = now.getMonth() + 1;
      if (month < 10) {
        month = "0" + month;
      }
      let d = now.getDate();
      if (d < 10) {
        d = "0" + d;
      }
      let h = now.getHours();
      if (h < 10) {
        h = "0" + h;
      }
      let minutes = now.getMinutes();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      this.startTime = h + ":" + minutes;
      this.startDay = y + "-" + month + "-" + d;

      console.log("year: ", y);
      console.log("months: ", month);
      console.log("day: ", d);
      console.log("hours: ", h);
      console.log("minutes: ", minutes);
    },
    // 填写电话号码 执行事件
    inputTelphone (e) {
      if (e.target.cursor === 11) {
        mpvue.hideKeyboard();
      }
      this.checkBtnIsDisabled();
    },
    // 填写到店人数 执行事件
    inputNumber (e) {
      this.checkBtnIsDisabled();
    },
    // 填写备注 执行事件
    inputRemark (e) {
      this.remarkLength = e.target.cursor;
    },
    // 选择时间
    bindPickerChangeBookingTime (e) {
      this.inputValue.booking_time = e.target.value;
      this.checkBtnIsDisabled();
    },
    // 选择日期
    bindPickerChangeBookingDate (e) {
      this.inputValue.booking_date = e.target.value;
      this.inputValue.booking_time = "请选择预约时间";
      this.checkBtnIsDisabled();
    },
    // 确定预约按钮是否可用
    checkBtnIsDisabled () {
      const data = this.inputValue;
      if (data.telphone === "") {
        this.btnIsDisabled = true;
        return false;
      } else if (data.number === "") {
        this.btnIsDisabled = true;
        return false;
      } else if (data.booking_date === "请选择预约日期") {
        this.btnIsDisabled = true;
        return false;
      } else if (data.booking_time === "请选择预约时间") {
        this.btnIsDisabled = true;
        return false;
      } else {
        this.btnIsDisabled = false;
        return true;
      }
    },
    // 创建预约请求
    requestBookingCreated () {
      const url = "booking/created";
      const methods = "POST";
      const data = {
        "shop_id": this.shopId,
        "telphone": this.inputValue.telphone,
        "number": this.inputValue.number,
        "remark": this.inputValue.remark,
        "booking_time": this.inputValue.booking_date + " " + this.inputValue.booking_time
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
    // 点击 确认预约按钮 执行的事件
    clickSureAppointment () {
      console.log(this.inputValue);
      const data = this.inputValue;
      const telIsOK = /^1(3|4|5|7|8)\d{9}$/.test(data.telphone);
      if (telIsOK) {
        this.requestBookingCreated();
      } else {
        Utils.showToast("请输入正确的电话号码");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.input-box {
  padding: $scss_padding-T $scss_padding-LR 80rpx + 38rpx + $scss_padding-T;
  .btn-wrapper {
    position: fixed;
    width: 100%;
    padding: 0 20rpx;
    height: 80rpx;
    left: 0;
    bottom: 38rpx;
    padding: 0 50rpx;
  }
  .tips {
    padding: 20rpx 0;
    font-size: 24rpx;
    line-height: 34rpx;
    color: #8e8e8e;
  }
}

.form {
  display: block;
  background-color: #fff;
  width: 100%;
  border-radius: 10rpx;
  padding: 0 40rpx 46rpx;
  .title {
    border-bottom: 2rpx solid #eee;
    height: 106rpx;
    align-items: center;
    display: flex;
    font-weight: 700;
    font-size: 32rpx;
    color: #010101;
    .icon {
      margin-left: 8rpx;
    }
  }
  .input-wrapper {
    display: flex;
    align-items: center;
    height: 90rpx;
    > label {
      display: flex;
      align-items: center;
      width: 164rpx;
      height: 100%;
      font-size: 28rpx;
      color: #000;
    }
    input {
      width: 444rpx;
      line-height: 40rpx;
      height: 100%;
      border-bottom: 2rpx solid #eee;
      padding: 25rpx 0 23rpx;
      padding-left: 26rpx;
      font-size: 28rpx;
      font-weight: 700;
    }
    .picker {
      width: 444rpx;
      color: #f1a400;
      height: 80rpx;
      line-height: 78rpx;
      border-bottom: 2rpx solid #eee;
      padding-left: 26rpx;
      font-size: 28rpx;
      font-weight: 700;
    }
    .icon {
      margin-right: 8rpx;
    }
    &.remark {
      position: relative;
      input {
        padding-right: 80rpx;
      }
      .limit-hint {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        font-size: 24rpx;
        line-height: 1;
        color: #8e8e8e;
      }
    }
  }
  .icon-tel {
    width: 32rpx;
    height: 32rpx;
    background-image: url(data:image/png;base64,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);
  }
  .icon-people-num {
    width: 32rpx;
    height: 26rpx;
    background-image: url(data:image/png;base64,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);
  }
  .icon-time {
    width: 32rpx;
    height: 32rpx;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAA+CAYAAABzwahEAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+nhxg7wAAC4pJREFUaIHVm/lzk+cRxz+W5Avflm0wmMPgXCUHaQOkgTYpbVqadjptJv9opzNtwrTQNlBaWtImAZNwmiOA8G3Zlg8d/eG7O88rWbJsySbOzjzz2q/e49nd7+6zz+6+DWwNNQBNQCPQCfQDByKjH+gBuuzYCTTbfavAPDADzAJTNh4BD4D7QAqYBpaBFSBX74QT9T7AqA1IIqb6gd3AELDPRhLoJjDeDsQi9y8gpueAXsR4m13ngnTmJ+1YqGfCDfXcbDQAvAC8DrwMDAN9aMJtNlqQhpuqPCuHtLoELCKBOBruAzeBL4AbCA35WiddD+N7gP2I2e8hxl8BDlKszVJaRvAu2HUJZCLr3QMwDnyNGP8SuI6E8RTBf1NUK+NDwGngFGJ4kAD1Ss9cACYQjOeRtpqAXTYcHZ3rPGMeQf0JMAr8C7iMkLC8GQY2a+M9iOnjwBngbeBIyTUFZKtpm+gcsslnNuFndg7EaBfQAbTa/902eu18BxJGI7L5doQqd5q9yNxGESqyG2FkMxofAI5FGH4RObFSiN6LjIfIFlNIU/NI8w7NJoLtJ2x0GEOHkCkdQMJ9kbWKmkRQvwqcA/5p761q+xvReAJB+QTwLvAesul45JpZpMmHSPJ3gTFj+iGCeB5pcq+NFSSQ26xdnjoRw0MExl8jaDlp708STMzN5hKy/YX1mIqv96P9fgD4EfAR8BPktRsj16SAz4G/AB8D54H/GUPfmFAKCKIngN8Bv0XoiQOPERKitIw8uQvzFhLmE+QYmyn2Jx1oJUnauUW7f7USY9U0PgC8A3xgzO+O/JZGGv0c+A/wb+ArpN1SajNG3wc+BEaQxpuRgCZYa5srNqbtPXdsPEHCPo6Q0GvX70F+woWxYM8uy/x6Gu8CThI0vSfy24IxfA74A/APpJGZCs/qs4meRpBttnfPoqVpjOpL0qo9/ylCUhohrx/FCdix145pJLQ0ZWy+ksZbkYZ+DvyQYqankB3/GcH6M6rYk02kG2k+OolGe1djuZvK0ApiehytDBk7fwz5IZAJHENMLyEzSpU+qBLjR4BfAb9EDsZpGkH6PHABQbsa0yAbz9qIhpoxG5uNJ1ZQMLNE0OwZgoIGkCPOIdOYpgRRpYw3IVieBH6MQlGf+ByKls4jRzZKkHg1ytm1GYptOYcQUEvcvYQClyV7TpvNux+Z0SBadu8glH5l1wJrGe9DdngGOSCnNAoVHd432DjTIMaio9z5WqiAvP4lpLQVpDB3wgeAn9n800gIwFrG3Yu/hdZSp6f28AsIYos1TLKB8pCua5eFEPMA+BT5kiHkmFuQ73gVwf0ztNVdhuKoqx1FS6/a0R3OJPK8F5EnT9c50e2gLIrYfFm9S4jdO5HPOooiwSaQxhuQdEbQhuMAYfu4iOz6EnCNEGPvRFpFy+Lf0QrShxCMHY+jYGkGmEogJgeQIyhdur4B/gb81W7a6TSBlNSLNOyM9yH+UthK5PvhXrT2HUXxLggq95FtfM064d8OohzyR75fmLNzTch8X0LCaIshRpMoBh9ES0GOsIF4QG3O7Nukp8hEbxFWn0bE9B5gd8z+GUB24V4+g+zlDpXD0J1MHnOMUrwBakc+bDiGnNohtAQ4zaLg4CbfTcZnkC3fQFGbUzcKyl5JIFd/EMXM0Rt9N/RdgznIHz1GPmoqct6zN6sJQqajPXLBDFoXH7DJXNYOohnE/AQSRCPyZ7sxr96HvLprPGs3TaBgpd7Iaj1qoHJEVy/l0fyjfCSQSXfF/A9C0LKA4PE8IrTtFCrITMdRJieLBNwBdMYImcy4TcQzo5vOVVehcpuRLGHXth20ghhPEUy2BWiNEUo7IHh4JvR5BCw5tFXcaiE7LaG9xiRhS9oMtMSQU4va9yLSQN2FuQjF7R2tFKe74mysilIrrRLKUC7cGNAYI+S/INSuVqijLlWG4vae6LtAJubFgWoZ31ooT0haRhWZKE37VEoY1EtZBLUsxfm1JCHbs5+t13xFXhIU23LMJta0xZNYINS7ZwkboSRKW7cStPKo3ERrpBhCUpxiBecTyKaXEQwTNolSSNZLCygKvIpg3UxIAw/Ze32tvcjWMZ8gFCUdaQUgm0BL1xwhSddmF25V0wBImw9Q/r0V2d5JlAoG7Zh+GvntIsoF1Esu4CQh974KLLmk0/ZjDKVq2tlaxn2ZvGXPjdlEjqHlFFRPO4XQUUA5tCd1vrcZ8TVgf4N8TSaBdi+9hJpUB9JEW50vLUcZtGsqIOjlgR8Q4ohBlBVtRY7wIoq6aiWPzQcIkWkaSCdQeNqDJNFsE+pBkmq181vp4RfRdtcnEkdlJa+B7UOa9/zeZWrXfDsy4W6EshzGeBx40yaxH2kb5HnHUCZjnq0NZkDomkVoyyHYR+2wA2mpg1ApKa2oVqM24A1UIzhCqKLeBR7FkVdtQoV3l/oSim9TCGrbsTVdQbvABQT5DgR5r3h22Xxidm2aUDWpRgnkM95C6PECwzRKld+NIyk3Iel44S2PpDOBvPF2pZWzSPOz9ncL2iZHNd+PIDuHYm53futRFzKfd1DK3H3IY+Q0bySQ/QwQCvgNyCkcRmmpTraXFlEW1wOmJpts0v4fQl0YKcLeutqWuQ11YB0lmC9IaGPA7XjJhUOI6bgd51HS7l5NLG2cSjXfjDTvm6c40vZjQm18PToM/BpFhV0EoY4CnwA3E8h+JhGDIwhWzUgYwwgyd1A0taGOohopqnlvEX3Zjs9sLLL+5qmBkFAcQWYCmvcUcmwpYC5O2MEUELP7CUGFr7UZe/F2Z2Vc8/OE7sYUKl9dQsWNcSrnCrqB7xM6szwynCTU9f8LzHrWZcVe1I68+z4kPU/Q5RHEPIWznZRFAp5DNn0flaivUr1l5DBwFvmEQ4Ro7RHwR1RXewysRjciGeRNDyLv3o5sy48zhA7j7WZ+xd6TQoyPUb15bw+q/f0Gab0dKS+LtPx7hJhFIB9lvEDIlPQirTcSsiRxBLEJtqB7eAOURV54juq2nURL11kE8X4C0zcJrStPsHmXbj2XkFZbEGz67Lx3E7USWjR3Ssm4DfXPfYTi/EGCF38E/AnBfJQIYkoZzxFKLn2E4CFmL+ggxLzzhGbcb4MaCHXvD1AP3TCB6SngCoL4FUoUVS7ZUCBkWRtRuOdBQDsSSI/9PocQst2wL0dDKBz9EPgFxe3i3p11juDQiqhSlmUZMZVHWvdgwhPySUJ2NE/Izj4P6kTr9CnE8BnkwZ3pDIpJPkZM36PM8leJcS8sZAhRXDSG9pr6IIqM4nbtdpecetFu8n0Umb2NNO/5tCVUIb2AGL9OBYWsl1cr2IMySGKthH5xkM3vJfSb+/AVIEf9y16C0PH8ErLn92ycJDTtgkzuOmL6AmpUquiAqyUUfd88gRAQR5p35r0SM2gTO2yTabNJ59lY52M56kZ2+xrqvTuLNH0C7a+jGaI5ZNOf2PiC4vLwGtpIXm0BxdAe3eUQ3BzmzYSvjV5A0BtBcbF/PjVn9/qItnY2UFxwaEHIGbIxjGL2aDOPUwYFOaOo2/JTFN5WrcVtpjybQB7+dWRbp1GysLfkukXCOj+NgoZJpIEJwp7al0FPPPbYs3qRQ92HtN5J+FYtShnE8GX0ZcJV1OW4IYRtJpOaJTTeTyCbSqHt7G5kAh7b77KJg8zFvxcbJ3yiUY7xJKHh3osOpTRl772JPgi4jKC9qbxcrQX5XSg2HkawfxNlcA5T3FISJS8jeSNvlHGHun+fVo7yKBK7hjoYryBzekpxn8uGqN5OhATazb1hYwRpuovwwZ2ntjZTknJ/kiEUPJ4if3ENwfpL6qirb0ULRiMBon2oRHQQaX+vnfNPqLxKU04Ivv/2T7cmEaTHIiOFoD5OnQHTVlRLVtEk02i/PksIeRft/06KGfc6HYRESIZixieQ3d62cZ/wgU3djQT/B8e7VSl8pm/+AAAAAElFTkSuQmCC);
  }
  .icon-remark {
    width: 32rpx;
    height: 32rpx;
    background-image: url(data:image/png;base64,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);
  }
}
</style>
