<template>
  <div class="navbar" :style="{background: variables.themeColor}">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">
      <el-badge :is-dot="messageStatus" class="badge-item">
        <i class="el-icon-message-solid" @click="openMessageDialog" />
      </el-badge>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="user-name">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link v-if="!userInfo.type" to="/admin/super">
            <el-dropdown-item>
              <svg-icon icon-class="system_admin" style="margin-right: 4px" />
              <span>超级管理员</span>
            </el-dropdown-item>
          </router-link>
          <router-link to="/relate/wechat">
            <el-dropdown-item :divided="!userInfo.type">
              <svg-icon icon-class="system_relate" style="margin-right: 4px" />
              <span>关联微信</span>
            </el-dropdown-item>
          </router-link>
          <router-link v-if="userInfo.type" to="/meal/info">
            <el-dropdown-item divided>
              <svg-icon icon-class="system_meal" style="margin-right: 4px" />
              <span>套餐情况</span>
            </el-dropdown-item>
          </router-link>
          <router-link to="/phone/reset">
            <el-dropdown-item divided icon="el-icon-phone-outline">
              <span>修改手机号</span>
            </el-dropdown-item>
          </router-link>
          <router-link to="/password/reset">
            <el-dropdown-item divided icon="el-icon-lock">
              <span>修改密码</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <svg-icon icon-class="system_exit" style="margin-right: 4px" />
            <span>退出系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import variables from '@/styles/variables.scss'

export default {
  components: {
    Hamburger
  },
  props: {
    messageStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      variables,
      dialogMessageVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'userInfo'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    openMessageDialog() {
      this.$emit('openMessageDialog')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #FFF;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  /*.breadcrumb-container {*/
    /*float: left;*/
  /*}*/

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .badge-item {
      position: relative;
      bottom: 14px;
      right: 24px;
      line-height: 1;
      cursor: pointer;
      .el-icon-message-solid{
        color: #FFF;
        &::before{
          font-size: 20px;
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin: 5px 20px 0 0;
        position: relative;
        height: 45px;
        cursor: pointer;

        .user-avatar {
          width: 36px;
          height: 36px;
          margin-top: 2px;
          border-radius: 50%;
        }

        .user-name{
          position: relative;
          bottom: 14px;
          margin-left: 8px;
          line-height: 40px;
          color: #FFF;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
          color: #FFF;
        }
      }
    }
  }
}
</style>
