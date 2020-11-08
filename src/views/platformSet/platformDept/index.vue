<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <breadcrumb-header>
    <template v-slot:default>
      <div class="platform-dept-container">
        <!-- <div class="department-template">
          <el-form ref="form" label-width="90px" size="small" :inline="true">
            <el-form-item label="组织架构：">
              <el-input v-model="form.fileName" :disabled="!form.fileName" style="width: 300px;" placeholder="组织架构" />
              <el-button type="primary" icon="el-icon-upload">上传文件</el-button>
              <el-button type="default" icon="el-icon-download">下载模板</el-button>
            </el-form-item>
            <el-form-item>
              <div class="step-list">
                <el-button type="primary" size="mini" @click="formSaveAction">保存</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div> -->
        <div class="department-table clearfix">
          <el-row type="flex" justify="space-between" align="middle">
            <div class="table-title">单品牌组织架构模版</div>
            <!-- <el-button class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="deleteTemplateAction">删除</el-button> -->
          </el-row>
          <el-table
            ref="multipleTable"
            :data="singleTableData"
            style="width: 100%;"
            size="small"
          >
            <el-table-column
              prop="brandName"
              label="品牌"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="shopName"
              label="部门/门店"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="shopAddress"
              label="门店地址"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="employeeName"
              label="员工姓名"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="position"
              label="职位"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="mobile"
              label="电话"
              width="160"
              align="center"
              header-align="center"
            />
          </el-table>
        </div>
        <div class="department-table clearfix">
          <el-row type="flex" justify="space-between" align="middle">
            <div class="table-title">多品牌组织架构模版</div>
            <!-- <el-button class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="deleteTemplateAction">删除</el-button> -->
          </el-row>
          <el-table
            ref="multipleTable"
            :data="moreTableData"
            style="width: 100%;"
            size="small"
          >
            <el-table-column
              prop="sponsorName"
              label="主办方"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="brandName"
              label="品牌"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="shopName"
              label="部门/门店"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="shopAddress"
              label="门店地址"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="employeeName"
              label="员工姓名"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="position"
              label="职位"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="mobile"
              label="电话"
              width="160"
              align="center"
              header-align="center"
            />
          </el-table>
        </div>
        <div class="department-table clearfix">
          <el-row type="flex" justify="space-between" align="middle">
            <div class="table-title">工厂版组织架构模版</div>
            <!-- <el-button class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="deleteTemplateAction">删除</el-button> -->
          </el-row>
          <el-table
            ref="multipleTable"
            :data="factoryTableData"
            style="width: 100%;"
            size="small"
          >
            <el-table-column
              prop="brandName"
              label="品牌"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="largeArea"
              label="大区域"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="smallArea"
              label="小区域"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="agentName"
              label="代理商"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="shopName"
              label="部门/门店"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="shopAddress"
              label="门店地址"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="employeeName"
              label="员工姓名"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="position"
              label="职位"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="mobile"
              label="电话"
              width="160"
              align="center"
              header-align="center"
            />
          </el-table>
        </div>
      </div>
    </template>
  </breadcrumb-header>
</template>

<script>
import BreadcrumbHeader from '@/components/BreadcrumbHeader'

export default {
  name: 'PlatformDept',
  components: {
    BreadcrumbHeader
  },
  data() {
    return {
      form: {
        fileName: ''
      },
      singleTableData: [
        {
          id: 1,
          brandName: '南通欧派橱柜',
          shopName: '百安一店',
          shopAddress: '百安一店',
          employeeName: '余晓华',
          position: '主管',
          mobile: '1234567'
        },
        {
          id: 1,
          brandName: '南通欧派橱柜',
          shopName: '百安一店',
          shopAddress: '百安一店',
          employeeName: '余晓华',
          position: '主管',
          mobile: '1234567'
        }
      ],
      moreTableData: [
        {
          id: 1,
          sponsorName: '居然之家',
          brandName: '南通欧派橱柜',
          shopName: '百安一店',
          shopAddress: '百安一店',
          employeeName: '余晓华',
          position: '主管',
          mobile: '1234567'
        },
        {
          id: 1,
          sponsorName: '居然之家',
          brandName: '南通欧派橱柜',
          shopName: '百安一店',
          shopAddress: '百安一店',
          employeeName: '余晓华',
          position: '主管',
          mobile: '1234567'
        }
      ],
      factoryTableData: [
        {
          id: 1,
          brandName: '南通欧派橱柜',
          largeArea: '华东区',
          smallArea: '江苏省',
          agentName: '南通',
          shopName: '百安一店',
          shopAddress: '百安一店',
          employeeName: '余晓华',
          position: '主管',
          mobile: '1234567'
        },
        {
          id: 1,
          brandName: '南通欧派橱柜',
          largeArea: '华东区',
          smallArea: '江苏省',
          agentName: '南通',
          shopName: '百安一店',
          shopAddress: '百安一店',
          employeeName: '余晓华',
          position: '主管',
          mobile: '1234567'
        }

      ]
    }
  },
  methods: {
    // formSaveAction() {},
    // deleteTemplateAction() {}
  }
}
</script>

<style lang="scss" scoped>
  .platform-dept-container {
    & > div {
      padding: 12px 0;
      background: #FFF;
    }
    .department-template {
      .el-form {
        .el-form-item {
          margin-bottom: 0;
          .el-input ~ .el-button {
            margin-left: 12px;
          }
          &:last-child {
            float: right;
          }
        }
      }
    }
    .department-table{
      margin-top: 12px;
      .table-title{
        margin: 0 0 12px 12px;
        font-weight: 500;
      }
      .el-button{
        margin: 0 12px 12px 0;
      }
      .delete-button{
        float: left;
        margin-left: 12px;
      }
      .button-list{
        float: right;
      }
      .el-table{
        border-top: 1px solid #EBEEF5;
      }
    }
  }
</style>

