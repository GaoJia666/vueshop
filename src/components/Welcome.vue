<template>
  <div>
    <h3>Welcome to the management system</h3>
    <el-calendar v-model="value"> </el-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: new Date(),
    }
  },
}
</script>

<style scoped>
</style>