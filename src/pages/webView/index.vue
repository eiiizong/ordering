<template>
  <!-- 我的 页面 -->
  <div class="web-view">
    <web-view :src="src"></web-view>
  </div>
</template>

<script>

export default {
  data () {
    return {
      name: "",
      src: "http://eiiizong.top/test"
    };
  },
  created () { },
  onShow () {
    this.init();
  },
  mounted () {
  },
  methods: {
    init () {
      const data = this.$root.$mp.query;
      if (data) {
        this.name = data.name;
        this.src = data.url;
      }
    }
  }
};
</script>