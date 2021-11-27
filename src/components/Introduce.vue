<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>硬件配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <div class="scene">
        <div class="card">
          <div class="card__face card__face--front">
            <img src="img/cnKl1Ykd5rZCVwm.jpg" />
          </div>
          <div class="card__face card__face--back">
            <img src="img/cqyJiYlRwnTeHmj.jpg" />
          </div>
        </div>
        <div class="card">
          <div class="card__face card__face--front">
            <img src="img/FLnzi5Kq4tkRZSm.jpg" />
          </div>
          <div class="card__face card__face--back">
            <img src="img/buDT4YS6zUMfHst.jpg" />
          </div>
        </div>
        <div class="card">
          <div class="card__face card__face--front">
            <img src="img/uXF1Kx7lzELB6wf.jpg" />
          </div>
          <div class="card__face card__face--back">
            <img src="img/RtVq2wxQYySDb8L.jpg" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: black;
}

.scene {
  width: 1000px;
  display: flex;
  justify-content: space-between;
  -webkit-perspective: 800px;
  perspective: 800px;
}
.scene .card {
  position: relative;
  width: 240px;
  height: 300px;
  color: white;
  cursor: pointer;
  transition: 1s ease-in-out;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
.scene .card:hover {
  -webkit-transform: rotateY(0.5turn);
  transform: rotateY(0.5turn);
}
.scene .card .card__face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transition: 1s ease-in-out;
  -webkit-box-reflect: below 0
    linear-gradient(transparent, transparent, rgba(0, 0, 0, 0.4));
}
.scene .card .card__face img {
  width: 240px;
  height: 300px;
  -o-object-fit: cover;
  object-fit: cover;
}
.scene .card .card__face--back {
  -webkit-transform: rotateY(0.5turn);
  transform: rotateY(0.5turn);
}
</style>