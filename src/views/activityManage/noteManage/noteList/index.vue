<template>
  <div class="note-list-container">
    <div class="note-list">
      <el-row v-for="(item, index) in noteList" :key="index" class="note-item" type="flex" align="middle">
        <div class="item-left">
          <span>报</span>
        </div>
        <div class="item-center">
          <div class="title">{{ item.title }}</div>
          <div class="content">{{ item.content }}</div>
        </div>
        <div class="item-right">
          <svg-icon icon-class="activity_note_send" />
          <span>2020-08-07 13:20:12</span>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { noteList } from '@/api/activityManage/noteList'

export default {
  name: 'NoteList',
  data() {
    return {
      noteList: [
        {
        id: 1,
        avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        title: '报名客户',
        content: '尊敬的王先生，您好，在您的结婚3周年纪念日到来之际，我们祝您和您的家人永远幸福快乐。在结婚纪念日到店可以享受5折优惠，还可以免费领取红酒一瓶。',
        time: '2020-08-07 13:20:12'
      }
      ]
    }
  },
  props: {
    sponsorId: {
      type: String,
      default: ''
    }
  },
  created(){
    this.getList()
  },
  methods: {
    getList(){
    noteList({
        type:0,
        // sponsorId:this.sponsorId,
        sponsorId:0, //0 或者 空
        limit:100,
        is_page:false
    }).then(response => {
        console.log(response);
        // this.noteList= response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .note-list-container{
    .note-list{
      .note-item{
        padding: 20px 16px;
        background: #FFF;
        border-bottom: 1px solid #EEE;
        .item-left{
          width: 60px;
          height: 60px;
          background: #CCC;
          border-radius: 50px;
          text-align: center;
          color: #FFF;
          line-height: 60px;
          font-size: 20px;
        }
        .item-center{
          flex: 1;
          margin: 0 20px;
          font-size:14px;
          font-weight:400;
          color:rgba(74,74,74,1);
          .title{
            font-size: 15px;
            font-weight:600;
            line-height: 28px;
          }
        }
        .item-right{
          margin-top: 16px;
          font-size: 14px;
          font-weight:400;
          color:rgba(155,155,155,1);
          .svg-icon{
            font-size: 18px;
          }
          span{
            padding-left: 4px;
          }
        }
      }
    }
  }
</style>
