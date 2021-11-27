<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>版本更新</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <div class="title">
        <h3>创建来出现bug及解决方案</h3>
      </div>

      <div class="block">
        <el-timeline>
          <el-timeline-item timestamp="2021/11/26" placement="top">
            <el-card>
              <h4>修复添加列表中图片预览模式</h4>
              <p>添加el-dialog属性，将上传的图片储存本地临时变量，并提供与模式。</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2021/11/23" placement="top">
            <el-card>
              <h4>添加硬件视图</h4>
              <p>可查看ip地址,上次登录，端口，文件等。</p>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="2021/11/19" placement="top">
            <el-card>
              <h4>添加数据统计视图</h4>
              <p>在可视化试图中查看用户来源，并可观的展现出来。</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
</style>