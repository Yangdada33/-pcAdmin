<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="cooperate-advise-container">
    <div class="advise-header">
      <breadcrumb />
    </div>
    <div class="advise-main clearfix">
      <div class="main-header">意见反馈</div>
      <pagination-section>
        <template v-slot:default>
          <el-table
            :data="tableData"
            style="width: 100%"
            size="small"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="content"
              label="意见描述"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="media"
              label="图片/视频"
              width="180"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-popover
                  v-for="(item, index) in scope.row.media"
                  :key="index"
                  placement="right-end"
                  width="200"
                  trigger="hover"
                >
                  <el-image
                    style="display: block;max-width: 360px; max-height: 360px"
                    fit="cover"
                    :src="item.url"
                  />
                  <el-image
                    slot="reference"
                    style="display:block;width: 32px; height: 32px;margin: auto;"
                    fit="cover"
                    :src="item.url"
                  />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="time"
              label="反馈时间"
              width="240"
              align="center"
              header-align="center"
            />
          </el-table>
        </template>
      </pagination-section>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PaginationSection from '@/components/PaginationSection'

export default {
  name: 'CooperateAdvise',
  components: {
    Breadcrumb,
    PaginationSection
  },
  data() {
    return {
      tableData: [{
        content: '最近都没更新呀～～～ 你们能不能多办点活动',
        time: '2020-07-14 12:32:12',
        media: [
          { type: 'image', url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg' }
        ]
      }]
    }
  }
}
</script>

<style lang="scss">
  .cooperate-advise-container{
    .advise-main{
      background: #FFF;
      .main-header{
        padding: 16px 12px;
        font-size:16px;
        font-weight:500;
        color:rgba(51,51,51,1);
      }
      .el-table{
        border-top: 1px solid #EBEEF5;
      }
    }
  }
</style>
