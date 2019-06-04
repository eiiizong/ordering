<template>
  <!-- 我的 页面 -->
  <div class="web-view">
    <web-view :src="src"></web-view>
  </div>
</template>

<script>
import Utils from "../../utils/utils.js";
export default {
  data () {
    return {
      title: "",
      src: "http://eiiizong.top/test"
    };
  },
  onShow () {
    this.init();
  },
  mounted () {
  },
  methods: {
    init () {
      const data = this.$root.$mp.query;
      if (data) {
        this.title = data.title;
        this.src = data.url;
      }
      Utils.setNavigationBarTitle(this.title);
    }
  }
};
</script>