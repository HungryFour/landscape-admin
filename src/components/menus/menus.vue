<template>
  <el-menu
    class="menu-nav"
    router
    :default-active="currentPath"
    background-color="#20222A"
    text-color="rgba(255,255,255,.8)"
    active-text-color="#ffd04b"
    :collapse="isCollapse">
    <el-menu-item index="/console">
      <i class="el-icon-location"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-notebook-2"></i>
      <span slot="title">文章</span>
    </el-menu-item>
    <el-menu-item index="/resource">
      <i class="el-icon-s-goods"></i>
      <span slot="title">资源</span>
    </el-menu-item>
    <el-menu-item index="/team">
      <i class="el-icon-user"></i>
      <span slot="title">团队</span>
    </el-menu-item>
    <el-menu-item index="/messageBoard">
      <i class="el-icon-user"></i>
      <span slot="title">网站留言</span>
    </el-menu-item>
    <el-menu-item index="/password">
      <i class="el-icon-setting"></i>
      <span slot="title">修改密码</span>
    </el-menu-item>
<!--    <el-submenu index="4">-->
<!--      <template slot="title">-->
<!--        <i class="el-icon-setting"></i>-->
<!--        <span>设置</span>-->
<!--      </template>-->
<!--      <el-menu-item index="/profile">基本资料 (空)</el-menu-item>-->
<!--      <el-menu-item index="/password">修改密码 (空)</el-menu-item>-->
<!--    </el-submenu>-->
  </el-menu>
</template>

<script>
export default {
  props: ['isCollapse'],
  data () {
    return {
      currentPath: location.pathname
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-menu {
    border: none;
  }
  .menu-nav:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
