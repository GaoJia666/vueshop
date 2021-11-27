<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>硬件配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <div>
        <h3>欢迎使用后台管理系统0.1v！</h3>
        <h4 class="frequency">登录次数：18</h4>
        <h4 class="frequency">
          上次登录IP：222.137.109.186 上次登录时间：2021-11-26 11:19:55
        </h4>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="服务器信息" width="230">
        </el-table-column>
        <el-table-column prop="name"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '服务器计算机名',
          name: 'DESKTOP-2EVS0G9',
        },
        {
          date: '服务器IP地址',
          name: '172.31.6.151',
        },
        {
          date: '服务器域名',
          name: '高佳.top',
        },
        {
          date: '服务器端口',
          name: '80',
        },
        {
          date: '本文件所在文件夹',
          name: 'C:UsersgaojiaDesktop毕设——后台管理',
        },
        {
          date: '前端/后端语言',
          name: 'Vue.js/Node.js',
        },
        {
          date: '开发环境',
          name: 'windows11,node v16.13.0,vue/cli 4.5.15',
        },
      ],
    }
  },
  created() {},
}
</script>

<style scoped>
.frequency {
  font-weight: 500;
}
</style>