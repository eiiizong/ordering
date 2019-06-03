
const SCANWILLBUYFOODS = "SCAN_WILL_BUY_FOODS";
const TAKEOUTWILLBUYFOODS = "TAKEOUT_WILL_BUY_FOODS";
const BOOKINGWILLBUYFOODS = "BOOKING_WILL_BUY_FOODS";
const QUEUEWILLBUYFOODS = "QUEUE_WILL_BUY_FOODS";

const SCANCATEGORYLIST = "SCAN_CATEGORY_LIST";
const TAKEOUTCATEGORYLIST = "TAKEOUT_CATEGORY_LIST";
const BOOKINGCATEGORYLIST = "BOOKING_CATEGORY_LIST";
const QUEUECATEGORYLIST = "QUEUE_CATEGORY_LIST";

const SHOPID = "SHOP_ID";

const showModal = (title, content) => {
  if (mpvuePlatform === "wx") {
    return new Promise((resolve, reject) => {
      mpvue.showModal({
        title,
        content,
        success (res) {
          if (res.confirm) {
            console.log("用户点击确定");
            resolve(res);
          } else if (res.cancel) {
            console.log("用户点击取消");
            reject(res);
          }
        }
      });
    });
  } else if (mpvuePlatform === "my") {
    return new Promise((resolve, reject) => {
      mpvue.confirm({
        title,
        content,
        success (res) {
          if (res.confirm) {
            console.log("用户点击确定");
            resolve(res);
          } else if (res.cancel) {
            console.log("用户点击取消");
            reject(res);
          }
        }
      });
    });
  }
};

const openConfirmToOpenSetting = (title, content) => {
  showModal(title, content).then(() => {
    mpvue.openSetting();
  }).catch(() => { });
};

// 获取用户授权信息设置
const getSetting = (scope, openSetting) => {
  if (mpvuePlatform === "my") {
    console.log(`正在 检测  ${scope}  是否已经授权使用...`);
    return new Promise((resolve, reject) => {
      mpvue.getSetting({
        success (res) {
          // 如果用户已经授权
          // 支付宝小程序授权信息只有 true false 两种状态
          if (res.authSetting[scope]) {
            resolve(res);
          } else {
            reject(res);
          }
        }
      });
    });
  } else if (mpvuePlatform === "wx") {
    const canIUse = mpvue.canIUse("button.open-type.getUserInfo");
    if (canIUse) {
      console.log(`正在 检测  ${scope}  是否已经授权使用...`);
      return new Promise((resolve, reject) => {
        mpvue.getSetting({
          success (res) {
            // 如果用户已经授权
            if (res.authSetting[scope] === undefined) {
              console.log("第一次获取用户授权");
              reject(res);
            } else if (res.authSetting[scope] === false) {
              console.log("第N次获取用户授权 用户已经拒绝过授权");
              if (openSetting) {
                openSetting();
              }
            } else {
              resolve(res);
            }
          }
        });
      });
    } else {
      showToast("您使用的微信版本较低，请升级后再使用!");
    }
  }
};

// 将数据保存至本地
const saveDataToLocalStorage = (key, data) => {
  console.log(`正在 保存 ${key} 的数据至本地...`);
  return new Promise((resolve, reject) => {
    mpvue.setStorage({
      key: key,
      data: JSON.stringify(data),
      success (res) {
        console.log(`保存 数据 ${key} 至本地 => 成功`, res);
        resolve(res);
      },
      fail (err) {
        reject(err);
        throw new Error(`保存 数据 ${key} 至本地 => 失败`, err);
      }
    });
  });
};
// 获取本地缓存数据
const getDataToLocalStorage = (key) => {
  console.log(`正在 获取 ${key} 的本地缓存...`);
  return new Promise((resolve, reject) => {
    mpvue.getStorage({
      key: key,
      success (res) {
        console.log(`获取 ${key} 的本地缓存 => 成功`, res);
        if (res.data) {
          resolve(JSON.parse(res.data));
        } else {
          reject(res);
        }
      },
      fail (err) {
        console.log(`获取 ${key} 的本地缓存 => 失败`, err);
        reject(err);
      }
    });
  });
};
// 清除本地缓存
const clearDataToLocalStorage = (key) => {
  console.log(`正在 清除 ${key} 的本地缓存...`);
  return new Promise((resolve, reject) => {
    mpvue.clearStorage({
      key: key,
      success (res) {
        console.log(`清除 ${key} 的本地缓存 => 成功`, res);
        resolve(res);
      },
      fail (err) {
        console.log(`清除 ${key} 的本地缓存 => 失败`, err);
        reject(err);
      }
    });
  });
};
// 请求数据
const requestData = (url, method = "POST", data, header) => {
  // const prefix = "http://rap2api.taobao.org/app/mock/165482/api/";
  const prefix = "https://www.yangfugui.com/ordering/api/";
  console.log("正在请求数据 => 请求url地址：" + prefix + url);
  header = {
    "Accept": "application/json",
    "content-type": "application/x-www-form-urlencoded",
    ...header
  };
  if (mpvuePlatform === "wx") {
    return new Promise((resolve, reject) => {
      mpvue.request({
        url: prefix + url,
        method,
        data,
        header,
        success (res) {
          if (res.statusCode === 200) {
            if (res.data.status === "200") {
              resolve(res.data);
            } else {
              // 数据请求失败提示
              showToast(res.data.msg);
              reject(res.data);
            }
          }
        },
        // 数据请求失败提示
        fail (err) {
          showToast(`${url} 数据请求失败： => ${err}`);
          reject(err);
        }
      });
    });
  } else if (mpvuePlatform === "my") {
    const headers = { ...header };
    return new Promise((resolve, reject) => {
      mpvue.request({
        url: prefix + url,
        method,
        data,
        headers,
        success (res) {
          if (res.data.status === "200") {
            resolve(res.data);
          } else {
            // 数据请求失败提示
            showToast(res.data.msg);
            reject(res.data);
          }
        },
        // 数据请求失败提示
        fail (err) {
          showToast(`${url} 数据请求失败： => ${err}`);
          reject(err);
        }
      });
    });
  }
};
// login
const login = () => {
  console.log("小程序正在 mpvue.login 登录");
  return new Promise((resolve, reject) => {
    mpvue.login({
      success (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      }
    });
  });
};
// 获取用户地理位置
const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    mpvue.getLocation({
      type: "wgs84",
      success (res) {
        resolve(res);
      },
      fail (err) {
        reject(err);
      }
    });
  });
};
// 获取用户信息
const getUserInfo = () => {
  console.log("正在获取 用户信息");
  if (mpvuePlatform === "wx") {
    return new Promise((resolve, reject) => {
      mpvue.getUserInfo({
        success (res) {
          resolve(res);
        },
        fail (err) {
          reject(err);
        }
      });
    });
  }
  if (mpvuePlatform === "my") {
    return new Promise((resolve, reject) => {
      mpvue.getAuthUserInfo({
        success (res) {
          resolve(res);
        },
        fail (err) {
          reject(err);
        }
      });
    });
  }
};

const showToast = (title, icon = "none", duration = 2000, mask = true) => {
  let image = "";
  if (icon === "success") {
    image = "/static/images/address-sign.png";
  }
  if (icon === "fail") {
    image = "/static/images/back-my-location-one.png";
  }
  if (mpvuePlatform === "wx") {
    mpvue.showToast({
      title,
      icon,
      image,
      duration,
      mask
    });
  } else if (mpvuePlatform === "my") {
    mpvue.showToast({
      content: title,
      type: icon,
      duration
    });
  }
};

// 订单状态 数字状态转文本
const orderStateToText = state => {
  state = parseInt(state, 10);
  let text = "";
  switch (state) {
    case 1:
      text = "待支付";
      break;
    case 2:
      text = "已支付";
      break;
    case 96:
      text = "退款中";
      break;
    case 97:
      text = "已退款";
      break;
    case 98:
      text = "用户已取消";
      break;
    case 99:
      text = "已完成";
      break;
    default:
      text = "未知状态";
  }
  return text;
};
// 预约状态 数字状态转文本
const appointmentStateToText = state => {
  state = parseInt(state, 10);
  let text = "";
  switch (state) {
    case 0:
      text = "待确认";
      break;
    case 1:
      text = "已确认";
      break;
    case 2:
      text = "已到店";
      break;
    case 3:
      text = "已取消";
      break;
    case 4:
      text = "已拒绝";
      break;
    default:
      text = "未知状态";
  }
  return text;
};
// 预约状态 数字状态转文本
const takeoutStateToText = state => {
  state = parseInt(state, 10);
  let text = "";
  switch (state) {
    case 0:
      text = "待接单";
      break;
    case 1:
      text = "已接单";
      break;
    case 2:
      text = "已分配送餐员";
      break;
    case 3:
      text = "配送中";
      break;
    case 96:
      text = "退款中";
      break;
    case 97:
      text = "已退款";
      break;
    case 98:
      text = "用户已取消";
      break;
    case 99:
      text = "已完成";
      break;
    default:
      text = "未知状态";
  }
  return text;
};
// 操作数据
const operatingData = (orderType, str, func, defaultFunc) => {
  let key = "";
  switch (orderType) {
    case "scan":
      if (str === "w") {
        key = SCANWILLBUYFOODS;
      } else {
        key = SCANCATEGORYLIST;
      }
      func(key);
      break;
    case "takeout":
      if (str === "w") {
        key = TAKEOUTWILLBUYFOODS;
      } else {
        key = TAKEOUTCATEGORYLIST;
      }
      func(key);
      break;
    case "booking":
      if (str === "w") {
        key = BOOKINGWILLBUYFOODS;
      } else {
        key = BOOKINGCATEGORYLIST;
      }
      func(key);
      break;
    case "queue":
      if (str === "w") {
        key = QUEUEWILLBUYFOODS;
      } else {
        key = QUEUECATEGORYLIST;
      }
      func(key);
      break;
    default:
      if (defaultFunc) {
        defaultFunc();
      }
  }
};
// 更新购物车图标
const updateShopingCarBarBadge = data => {
  console.log("*************正在更新购物车购物数量**************", data);
  let totalNum = 0;
  if (data) {
    data.forEach(item => {
      if (item.goods_num > 0) {
        totalNum = totalNum + item.goods_num;
      }
    });
  }
  // 清除
  const remove = () => {
    mpvue.removeTabBarBadge({
      index: 1
    });
  };

  totalNum = totalNum.toString();
  if (totalNum === "0") {
    remove();
  } else {
    mpvue.setTabBarBadge({
      index: 1,
      text: totalNum
    });
  }
};
// 更新购物车图标
const setNavigationBarTitle = title => {
  if (mpvuePlatform === "wx") {
    mpvue.setNavigationBarTitle({
      title
    });
  } else if (mpvuePlatform === "my") {
    mpvue.setNavigationBar({
      title
    });
  }
};
export default {
  orderStateToText,
  setNavigationBarTitle,
  appointmentStateToText,
  takeoutStateToText,
  updateShopingCarBarBadge,
  operatingData,
  SCANCATEGORYLIST,
  TAKEOUTCATEGORYLIST,
  QUEUECATEGORYLIST,
  BOOKINGCATEGORYLIST,
  SCANWILLBUYFOODS,
  TAKEOUTWILLBUYFOODS,
  BOOKINGWILLBUYFOODS,
  QUEUEWILLBUYFOODS,
  getSetting,
  saveDataToLocalStorage,
  getDataToLocalStorage,
  clearDataToLocalStorage,
  requestData,
  login,
  getUserLocation,
  getUserInfo,
  showToast,
  openConfirmToOpenSetting,
  showModal,
  SHOPID
};
