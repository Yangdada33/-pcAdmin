<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <breadcrumb-header>
    <template v-slot:default>
      <div class="material-container">
        <div class="material-wrap">
          <el-tabs v-model="materialType" @tab-click="handleClick">
            <el-tab-pane label="音乐素材库" name="music">
              <music-table-set :material-type="materialType" />
            </el-tab-pane>
            <!-- <el-tab-pane label="短信素材库" name="note">
              <NoteTableSet :material-type="materialType" />
            </el-tab-pane> -->
            <el-tab-pane label="微信素材库" name="wechat">
              <wechat-table-set :material-type="materialType" />
            </el-tab-pane>
            <el-tab-pane label="直播素材库" name="live">
              <live-table-set :material-type="materialType" />
            </el-tab-pane>
            <el-tab-pane label="敏感词库" name="word">
              <word-table-set :material-type="materialType" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </template>
  </breadcrumb-header>
</template>

<script>
import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import MusicTableSet from './components/musicTableSet/index'
// import NoteTableSet from './components/noteTableSet/index'
import WechatTableSet from './components/wechatTableSet/index'
import LiveTableSet from './components/liveTableSet/index'
import WordTableSet from './components/wordTableSet/index'

export default {
  name: 'Material',
  components: {
    BreadcrumbHeader,
    MusicTableSet,
    // NoteTableSet,
    WechatTableSet,
    LiveTableSet,
    WordTableSet
  },
  data() {
    return {
      materialType: 'music'
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>

<style lang="scss">

</style>

