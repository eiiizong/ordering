import Vue from "vue";
import App from "./App";

Vue.config.productionTip = false;
App.mpType = "app";

const app = new Vue(App);
app.$mount();
// 挂载 globalData
const globalData = getApp().globalData;

globalData.pushCategoryList = function (categoryList) {
  if (globalData.changeCategoryList && typeof globalData.changeCategoryList === "function") {
    globalData.changeCategoryList(categoryList);
  }
};
Vue.prototype.globalData = globalData;
