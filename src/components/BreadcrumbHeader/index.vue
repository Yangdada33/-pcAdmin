<template>
  <div class="breadcrumb-header-container">
    <breadcrumb />
    <slot />
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'BreadcrumbHeader',
  components: {
    Breadcrumb
  }
}
</script>

<style lang="scss" scoped>

</style>
