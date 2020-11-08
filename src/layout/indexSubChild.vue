<template>
  <div class="layout-sub-container">
    <slot v-if="validateTemplateSelect" />
    <router-view v-else />
  </div>
</template>

<script>
export default {
  name: 'LayoutSubChild',
  props: {
    routeName: {
      type: String,
      required: true
    }
  },
  computed: {
    validateTemplateSelect() {
      return this.$route.name === this.routeName
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
