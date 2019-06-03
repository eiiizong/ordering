<template>
  <!-- 按钮 -->
  <div class="no-page"
       v-if="imgUrl">
    <img :src="imgUrl"
         alt="">
  </div>
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../static/styles/scss/variable";

.no-page {
  display: flex;
  padding-top: 240rpx;
  img {
    width: 560rpx;
    height: 460rpx;
    margin: auto;
  }
}
</style>
