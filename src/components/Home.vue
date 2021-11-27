<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header height="45px">
      <div>
        <!-- <img src="../assets/img/logo.png" alt="" /> -->
        <span>后台管理系统<span class="edition">0.3v</span></span>
      </div>
      <div class="welcome">欢迎你:{{ bylogin }}!</div>
      <el-button type="success" size="mini" @click="logout">退出</el-button>
    </el-header>

    <!-- 主题 -->
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-s-operation"></i>
        </div>
        <el-menu
          ref="menu"
          background-color="#EEEEEE"
          text-color="#000"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <template>
            <div class="consult" @click="introduce">
              <i class="iconfont icon-showpassword"></i>
              <span>毕设介绍</span>
            </div>
          </template>

          <template>
            <div class="consult" @click="consult">
              <i class="iconfont user icon-user"></i>
              <span>硬件配置</span>
            </div>
          </template>

          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- //二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <template>
            <div class="consult" @click="repair">
              <i class="iconfont icon-showpassword"></i>
              <span>版本更新</span>
            </div>
          </template>
        </el-menu>
      </el-aside>
      <!-- 左侧 -->
      <el-main>
        <!-- 占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false,
      //!被激活的地址
      activePath: '',
      bylogin: this.$route.query.userid,
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //!请求表单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(this.menulist)
    },
    //!点击折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //!保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    consult() {
      this.$router.push('/consult')
    },
    introduce() {
      this.$router.push('/introduce')
    },
    repair() {
      this.$router.push('/repair')
    },
  },
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #000;
  display: flex;
  justify-content: space-between;
  /* padding-left: 0; */
  align-items: center;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 5px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 15px;
}
.edition {
  font-weight: 500;
  font-size: 4px;
}

.el-aside {
  background-color: #eeeeee;
}
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #eee;
  font-size: 15px;
  line-height: 24px;
  color: #000;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
/* .logoimg img{
  width: 15%;
  height: 15%;
} */
.welcome {
  font-weight: 500px;
  letter-spacing: 0px;
  position: absolute;
  right: 15%;
}
.consult {
  padding-left: 40px;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  padding: 0 20px;
}
.consult:hover {
  background-color: #bebebe;
}
.consult i {
  color: #909399;
}
</style>