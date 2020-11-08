<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="live-home-container">
    <el-row class="live-home-wrap clearfix">
      <div v-autoNodeHeight class="live-section">
        <div class="live-player-wrap">
          <div id="MPSplayer" class="live-player" />
          <div class="liver-wrap">
            <el-avatar class="avatar" :size="22" fit="cover" :src="formatAnchorInfo.avatar" />
            <span>{{ formatAnchorInfo.name }}</span>
            <span>人气 </span>
            <span style="margin-left: 0;color: #FF0000;">{{ activityInfoData.live_info.popularity || 0 }}</span>
            <span>在线 </span>
            <span style="margin-left: 0;color: #FF7300;">{{ activityInfoData.live_info.online_people || 0 }}</span>
          </div>
          <div v-if="activityInfoData.live_info.notice" class="notice-wrap">
            <svg-icon icon-class="live_icon_notice" />
            <marquee class="notice" behavior="scroll" direction="left">{{ activityInfoData.live_info.notice }}</marquee>
          </div>
        </div>
        <div class="live-goods">
          <div class="goods-list">
            <div v-for="item in goodsListData" :key="item.id" class="goods-item">
              <div class="title ellipsis">{{ item.goods_name }}</div>
              <el-image
                class="picture"
                fit="cover"
                style="width:120px;height:78px;"
                :src="item.goods_image.url"
              />
              <el-row class="price-edit" type="flex" justify="space-between" align="middle">
                <div class="price-wrap">
                  <div class="prev-price">原价：¥{{ item.ms_price }}</div>
                  <div class="live-price">直播价：<span>¥{{ item.ms_price }}</span></div>
                </div>
                <i class="edit el-icon-edit" @click="editGoodsAction(item)" />
              </el-row>
              <div v-if="item.pivot.is_on_live" class="live-status">直播中</div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-section">
        <div class="chat-title">观众留言互动区</div>
        <div ref="messageList" class="chat-cont">
          <div v-if="messageList.length < pageData.total" class="message-more" @click="messageMoreAction">点击查看更多</div>
          <div class="notice-item">
            <svg-icon icon-class="message_notice_icon" />
            <div>
              <span class="item-user">系统消息：</span>
              <span class="item-cont">系统消息：欢迎各位进入本直播间～本直播间不定时发放奖励～</span>
            </div>
          </div>
          <div v-for="(item, index) in messageList" :key="index" :class="['message-item', item.user_id === userInfo.user_id ? 'active': '' ]">
            <div class="item-user">
              <span class="name">{{ item.user_id === userInfo.user_id ? '管理员' : item.user_info.name }}</span>
              <span>：</span>
            </div>
            <div class="item-cont">{{ item.content }}</div>
          </div>
        </div>
        <el-row class="chat-send">
          <el-input v-model="messageCont" placeholder="说点什么......" size="mini" />
          <el-button :disabled="!messageCont" type="primary" round size="mini" @click="messageSendAction">发送</el-button>
        </el-row>
      </div>
      <div class="menu-section">
        <div v-for="(item, index) in menuList" :key="index" class="menu-item" @click="item.action">
          <el-avatar fit="cover" :src="require(`@/assets/live/menu/${item.icon}.png`)" />
          <div>{{ item.title }}</div>
        </div>
      </div>
    </el-row>

    <el-dialog :visible.sync="dialogData.status" :show-close="false" :width="dialogData.width || '50%'">
      <!-- 商品编辑 -->
      <div v-if="dialogData.type === 'goodsEdit'" class="goods-edit-dialog">
        <div slot="title" class="dialog-title">
          <span>修改直播商品</span>
        </div>
        <div class="dialog-cont">
          <el-form ref="goodsForm" :model="goodsForm" :rules="goodsRules" label-width="100px" size="small" class="clearfix">
            <div class="form-item">
              <el-form-item label="品牌：" prop="brand">
                <el-select v-model="goodsForm.brand" filterable placeholder="请选择所属品牌">
                  <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="名称：" prop="name">
                <el-input v-model="goodsForm.name" placeholder="请输入商品名称" />
              </el-form-item>
              <el-form-item label="图片：" prop="picture">
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="fileUploadAction"
                >
                  <img v-if="goodsForm.picture.id" :src="goodsForm.picture.url" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
                <div class="form-tip">注：尺寸比例：1:1，建议大小不超过1M</div>
              </el-form-item>
              <el-form-item label="规格：" prop="standards">
                <el-input v-model="goodsForm.standards" :rows="3" type="textarea" placeholder="请输入商品规格" />
              </el-form-item>
            </div>
            <div class="form-item">
              <el-form-item label="库存：" prop="storage">
                <el-input-number v-model="goodsForm.storage" :min="0" />
              </el-form-item>
              <el-form-item label="原价：" prop="prevPrice">
                <el-input v-model="goodsForm.prevPrice" style="width: 160px" placeholder="请输入金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="直播价：" prop="livePrice">
                <el-input v-model="goodsForm.livePrice" style="width: 160px" placeholder="请输入金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="预付价：" prop="payPrice">
                <el-input v-model="goodsForm.payPrice" style="width: 160px" placeholder="请输入金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="佣金：" prop="income">
                <el-input v-model="goodsForm.income" style="width: 160px" placeholder="请输入金额">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="排序：" prop="sort">
                <el-input-number v-model="goodsForm.sort" :min="0" />
                <div class="form-tip">注：以10、20、30等为基础数值，数值越大排序越靠前，中间可插，比如12，就介于10、20之间</div>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="formCancelAction">取 消</el-button>
          <el-button size="small" type="primary" @click="goodsFormSaveAction">确 定</el-button>
        </div>
      </div>
      <!-- 预存金额 -->
      <div v-else-if="dialogData.type === 'preStore'" class="pay-store-dialog">
        <div slot="title" class="dialog-title">
          <span>预存金额</span>
        </div>
        <div class="dialog-cont">
          <el-form v-if="!preStoreForm.stepIndex" :model="preStoreForm" label-width="160px" size="small">
            <el-form-item label="选择金额：">
              <el-radio-group v-model="preStoreForm.moneyIndex">
                <el-radio-button v-for="(item, index) in moneyList" :key="index" :label="index">{{ item }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="自定义金额：">
              <el-input v-model="preStoreForm.money" style="width: 200px" placeholder="请输入自定义金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label-width="60px">
              <div class="form-tip-red" style="margin-right: 60px">说明：建议根据自身需求预存，红包越多客户越多，多退少补，也可下次使用</div>
            </el-form-item>
          </el-form>
          <div v-else class="pre-store-code">
            <el-image
              style="width: 160px;height: 160px;"
              fit="contain"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            />
            <div class="form-tip-red">微信扫描上方二维码充值</div>
          </div>
        </div>
        <div v-if="!preStoreForm.stepIndex" slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogData.status = false">取 消</el-button>
          <el-button size="small" type="primary" @click="preStoreAction">预 存</el-button>
        </div>
      </div>
      <!-- 发红包 -->
      <div v-else-if="dialogData.type === 'redPackage'" class="red-package-dialog">
        <div slot="title" class="dialog-title">
          <span>发红包</span>
        </div>
        <div class="dialog-cont">
          <el-form ref="redPackageForm" :model="redPackageForm" label-width="0" size="small">
            <el-form-item>
              <span v-if="!redPackageForm.typeIndex">单个金额</span>
              <span v-else>总金额<span class="pin">拼</span></span>
              <el-input v-model="redPackageForm.money" :style="`width: calc(100% - ${!redPackageForm.typeIndex ? '94px' : '110px'});margin: 0 12px;`" placeholder="请输入" />
              <span>元</span>
            </el-form-item>
            <div v-if="!redPackageForm.typeIndex" class="tabType">当前为普通红包，<span @click="tabRedPackageType(1)">改为拼手气红包</span></div>
            <div v-else class="tabType">当前为拼手气红包，<span @click="tabRedPackageType(0)">改为普通红包</span></div>
            <el-form-item>
              <span>红包个数</span>
              <el-input v-model="redPackageForm.num" style="width: calc(100% - 94px);margin: 0 12px;" placeholder="请填写红包个数" />
              <span>个</span>
            </el-form-item>
            <el-form-item>
              <span>领取区域</span>
              <el-cascader
                v-model="redPackageForm.area"
                :options="areaOptions"
                style="width: calc(100% - 68px);margin: 0 0 0 12px;"
                placeholder="请选择领取区域"
                @change="handleAreaListChange"
              />
            </el-form-item>
            <el-form-item>
              <span>定时红包</span>
              <span style="padding-left: calc(100% - 120px);margin: 0 12px;" />
              <el-switch
                v-model="redPackageForm.timeStatus"
                active-color="#FF7300"
              />
            </el-form-item>
            <el-form-item v-if="redPackageForm.timeStatus">
              <span>发送时间</span>
              <el-date-picker
                v-model="redPackageForm.sendTime"
                type="datetime"
                style="width: calc(100% - 68px);margin: 0 0 0 12px;"
                placeholder="选择发送时间"
              />
            </el-form-item>
            <el-form-item style="margin-bottom: 4px">
              <el-input v-model="redPackageForm.note" placeholder="请输入备注" />
            </el-form-item>
            <div class="introduction">说明：发送红包时本平台将收取2%的手续费；使用本平台发送红包功能则表示您默认同意本服务条款</div>
            <div class="total-price">¥{{ formatRedPackageMoney }}</div>
            <el-form-item style="background: transparent;text-align: center">
              <el-button :disabled="redPackageDisabled" class="send-action" type="danger" @click="sendRedPackageAction">发送红包</el-button>
            </el-form-item>
            <div class="tip">未领取的红包，将于24小时后发起退款</div>
          </el-form>
        </div>
      </div>
      <div v-else-if="dialogData.type === 'redPackageCode'" class="red-package-code-dialog">
        <div slot="title" class="dialog-title">
          <span>发红包</span>
        </div>
        <div class="dialog-cont">
          <el-image style="width: 240px;height: 240px; margin-left: 36px" fit="cover" :src="redPackageCodeUrl" />
          <div class="form-tip-red" style="padding: 0 0 20px;text-align: center;">微信扫描上方二维码付费</div>
        </div>
      </div>
      <!-- 商品导入 -->
      <div v-else-if="dialogData.type === 'goodsLeadIn'" class="goods-lead-in-dialog">
        <div slot="title" class="dialog-title">
          <span>本场直播商品导入</span>
        </div>
        <div class="dialog-cont">
          <el-form :model="goodsLeadInForm" label-width="0">
            <el-form-item>
              <el-row type="flex" justify="center">
                <el-transfer
                  v-model="goodsLeadInForm.selectList"
                  filterable
                  style="margin: 0 12px"
                  :titles="['公用直播商品', '本直播间商品']"
                  :data="goodsList"
                  :props="transferProps"
                  :filter-method="filterMethod"
                  filter-placeholder="请输入关键字"
                />
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="formCancelAction">取 消</el-button>
          <el-button size="small" type="primary" @click="liveGoodsFormSaveAction">确 定</el-button>
        </div>
      </div>
      <!-- 直播素材 -->
      <div v-else-if="dialogData.type === 'liveMaterial'" class="live-material-dialog">
        <div slot="title" class="dialog-title">
          <span>本场直播素材</span>
          <el-button type="primary" size="mini" @click="handleMaterialAddAction">新增</el-button>
        </div>
        <div class="dialog-cont">
          <el-form label-width="0">
            <el-form-item style="margin-bottom: 0">
              <pagination-section :page-data="materialPageData" @handleSizeChange="handleMaterialSizeChange" @handleCurrentChange="handleMaterialCurrentChange">
                <template v-slot:default>
                  <el-table
                    ref="materialSingleTable"
                    :data="materialTableData"
                    style="width: 100%;"
                    size="small"
                    @select="handleMaterialSelect"
                  >
                    <el-table-column
                      type="selection"
                      width="80"
                      align="center"
                      header-align="center"
                    />
                    <el-table-column
                      type="index"
                      label="序号"
                      width="60"
                      align="center"
                      header-align="center"
                      :index="indexMaterialMethod"
                    />
                    <el-table-column
                      prop="content"
                      label="素材内容"
                      align="center"
                      header-align="center"
                      show-overflow-tooltip
                    />
                    <el-table-column label="操作" width="120" align="center" header-align="center">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                          <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleMaterialEditAction(scope)" />
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <svg-icon icon-class="table_icon_delete" class-name="table-action" @click="handleMaterialDeleteAction(scope)" />
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </pagination-section>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button :disabled="!materialSelectedData.id" type="primary" size="small" @click="materialSendAction">发 送</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 直播章 -->
      <div v-else-if="dialogData.type === 'liveMedal'" class="live-medal-dialog">
        <div slot="title" class="dialog-title">
          <span>直播章</span>
        </div>
        <div class="dialog-cont">
          <el-row class="medal-list clearfix">
            <el-col v-for="item in medalTableData" :key="item.id" :span="4" class="medal-item">
              <div class="medal">
                <el-image fit="cover" :src="item.img.url" />
              </div>
              <el-button v-if="!item.is_send" type="primary" icon="el-icon-s-promotion" size="mini" @click="liveMedalPushAction(item)">推送</el-button>
              <el-button v-else type="info" disabled size="mini">已推送</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 直播公告 -->
      <div v-else-if="dialogData.type === 'liveNotice'" class="live-notice-dialog">
        <div slot="title" class="dialog-title">
          <span>本场直播公告</span>
          <el-button type="primary" size="mini" @click="handleNoticeAddAction">新增</el-button>
        </div>
        <div class="dialog-cont">
          <el-form label-width="0">
            <el-form-item>
              <el-table
                ref="noticeSingleTable"
                :data="noticeTableData"
                style="width: 100%;"
                size="small"
                @select="handleNoticeSelect"
              >
                <el-table-column
                  type="selection"
                  width="80"
                  align="center"
                  header-align="center"
                />
                <el-table-column
                  type="index"
                  label="序号"
                  width="60"
                  align="center"
                  header-align="center"
                />
                <el-table-column
                  prop="content"
                  label="公告内容"
                  align="center"
                  header-align="center"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" width="120" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleNoticeEditAction(scope)" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <svg-icon icon-class="table_icon_delete" class-name="table-action" @click="handleNoticeDeleteAction(scope)" />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button :disabled="!noticeSelectedData.id" type="primary" size="small" @click="noticeSendAction">发 送</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog
          :visible.sync="dialogNoticeAddVisible"
          append-to-body
        >
          <div class="notice-set-dialog">
            <div slot="title" class="dialog-title">
              <span>编辑直播公告</span>
            </div>
            <div class="dialog-cont">
              <el-form :model="noticeSetForm" size="small">
                <el-form-item label-width="0">
                  <el-input v-model="noticeSetForm.content" :rows="3" type="textarea" maxlength="20" show-word-limit placeholder="请输入直播公告" />
                </el-form-item>
                <el-form-item style="text-align: center">
                  <el-button size="small" @click="noticeFormCancelAction">取 消</el-button>
                  <el-button size="small" type="primary" @click="noticeFormSaveAction">确 定</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 禁言名单 -->
      <div v-else-if="dialogData.type === 'forbidSpeak'" class="forbid-speak-dialog">
        <div slot="title" class="dialog-title">
          <span>禁言名单</span>
        </div>
        <div class="dialog-cont">
          <el-table
            v-if="forbidTableData.length"
            ref="multipleTable"
            :data="forbidTableData"
            style="width: 100%;"
            size="mini"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="name"
              label="用户昵称"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column label="操作" width="120" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="removeForbidSpeakAction(scope)">解禁</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="empty-order">暂无禁言名单</div>
        </div>
      </div>
      <!-- 订单总览 -->
      <div v-else-if="dialogData.type === 'orderPreview'" class="order-preview-dialog">
        <div slot="title" class="dialog-title">
          <span>订单总览</span>
        </div>
        <div class="dialog-cont">
          <pagination-section v-if="orderTableData.length" :page-data="orderPageData" @handleSizeChange="handleOrderSizeChange" @handleCurrentChange="handleOrderCurrentChange">
            <template v-slot:default>
              <el-row v-for="(item,index) in orderTableData" :key="index" class="order-item" type="flex" align="middle">
                <div class="order-left">
                  <el-image fit="cover" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" />
                </div>
                <div class="order-center">
                  <div class="title ellipsis">现代简约皮布智能沙发</div>
                  <div class="prevPrice">原价：¥999</div>
                  <div class="time">下单日期：2020-05-01  13:20:09</div>
                </div>
                <div class="order-right">
                  <div class="price">¥800</div>
                  <div class="num">x1</div>
                </div>
              </el-row>
            </template>
          </pagination-section>
          <div v-else class="empty-order">暂无订单数据</div>
        </div>
      </div>
      <!-- 主播列表 -->
      <div v-else-if="dialogData.type === 'liveAnchor'" class="live-anchor-dialog">
        <div slot="title" class="dialog-title">
          <span>主播列表</span>
        </div>
        <div class="dialog-cont">
          <el-table
            v-if="anchorTableData.length"
            ref="multipleTable"
            :data="anchorTableData"
            style="width: 100%;"
            size="mini"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="nickname"
              label="主播昵称"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="user_info.avatar"
              label="主播头像"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-avatar :size="30" :src="scope.row.user_info.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              prop="live_status"
              label="主播状态"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-link v-if="scope.row.live_status" type="danger" :underline="false" style="cursor: default">直播中</el-link>
                <el-link v-else type="info" :underline="false" style="cursor: default">未直播</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center" header-align="center">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.live_status" type="primary" size="mini" @click="upLineAction(scope)">上 线</el-button>
                <el-button v-else :disabled="true" type="primary" size="mini" plain>下 线</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="empty-order">暂无主播数据</div>
        </div>
      </div>
    </el-dialog>

    <!-- 素材弹窗 -->
    <material-template-dialog
      :live-id="liveId"
      material-type="live"
      :material-data="materialSetForm"
      :dialog-template-visible="dialogMaterialAddVisible"
      @setDialogTemplateVisible="setDialogTemplateVisible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationSection from '@/components/PaginationSection'
import MaterialTemplateDialog from '@/components/MaterialTemplateDialog'
import { regionDataPlus } from 'element-china-area-data'
import { getStyle } from '@/utils/index'
import { fileUpload } from '@/api/user'
import { rechargeOrderData, goodsTimeListWidthNoPage } from '@/api/activityManage/marketModuleSet'
import { materialList, materialDelete } from '@/api/platformSet/material'
import { liveMessageList, liveGoodsIdList, liveGoodsIdSet, liveMedalData, redPackageSend, noticeList, noticeAdd, noticeEdit, noticeDelete, liveOrderList, liveAnchorList } from '@/api/activityManage/liveSet'
import { validateMoney, validateJSON } from '@/utils/validate'
const defaultAvatar = require('@/assets/index/avatar_default.png')
import { goodsTypeData, materialTypeData } from '@/utils/data'
import QRCode from 'qrcode'

const autoNodeHeightCommon = (el) => {
  const elWidth = parseFloat(getStyle(el, 'width'))
  const aLivePlayer = el.querySelector('.live-player')
  const aLivePlayerHeight = elWidth / 16 * 9 + 'px'
  aLivePlayer.style.height = aLivePlayerHeight
  const aLiveGoods = el.querySelector('.live-goods')
  aLiveGoods.style.height = `calc(100% - ${aLivePlayerHeight} - 20px)`
}

export default {
  name: 'LiveHome',
  components: {
    PaginationSection,
    MaterialTemplateDialog
  },
  directives: {
    autoNodeHeight: {
      inserted(el, binding, vnode, oldVnode) {
        /*
        console.log(el, binding, vnode, oldVnode, getStyle(el, 'width'))
        const elWidth = parseFloat(getStyle(el, 'width'))
        const aLivePlayer = el.querySelector('.live-player')
        const aLivePlayerHeight = elWidth / 16 * 9 + 'px'
        console.log(aLivePlayerHeight)
        aLivePlayer.style.height = aLivePlayerHeight
        */
        autoNodeHeightCommon(el)
      }
    }
  },
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validatePicture = (rule, value, callback) => {
      if (value && value.id) {
        callback()
      } else {
        callback(new Error('请上传图片'))
      }
    }
    return {
      webSocket: null,
      webSocketConnectStatus: false,
      activityInfoData: {
        live_info: {}
      },
      userInfotData: {},
      userListData: [],
      liveInfoData: {},
      goodsListData: [],
      // 右侧菜单列表
      menuList: [
        { title: '红包', icon: 'red_package_icon', action: this.redPackageAction },
        { title: '商品', icon: 'goods_icon', action: this.goodsLeadInAction },
        { title: '素材', icon: 'live_material_icon', action: this.liveMaterialAction },
        { title: '直播章', icon: 'live_medal_icon', action: this.liveMedalAction },
        { title: '公告', icon: 'notice_icon', action: this.liveNoticeAction },
        { title: '禁言', icon: 'forbid_speak_icon', action: this.forbidSpeakAction },
        { title: '订单', icon: 'order_icon', action: this.orderPreviewAction },
        { title: '主播', icon: 'anchor_icon', action: this.liveAnchorAction }
      ],
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      messageList: [],
      messageCont: '',
      /*
      * type: 弹窗类型
      *   goodsEdit-修改商品
      *   preStore-预存充值
      *   redPackage-发红包
      *   goodsLeadIn-商品导入
      *   liveMaterial-直播素材
      *   liveMedal-直播章
      *   liveNotice-直播公告
      *   forbidSpeak-禁言
      *   orderPreview-订单总览
      * */
      dialogData: {
        status: false,
        type: ''
      },
      brandList: [
        { id: 1, name: '品牌1' },
        { id: 2, name: '品牌2' },
        { id: 3, name: '品牌3' }
      ],
      goodsForm: {
        brand: '',
        name: '',
        picture: {},
        standards: '',
        storage: 0,
        prevPrice: '',
        livePrice: '',
        payPrice: '',
        income: '',
        sort: 0
      },
      goodsRules: {
        brand: [{ required: true, message: '请选择商品品牌', trigger: 'true' }],
        name: [{ required: true, message: '请输入商品名称', trigger: 'true' }],
        picture: [{ required: true, validator: validatePicture, trigger: 'blur' }],
        standards: [{ required: true, message: '请输入商品规格', trigger: 'true' }],
        prevPrice: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        livePrice: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        payPrice: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        income: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      },
      moneyList: [1000, 3000, 5000],
      preStoreForm: {
        stepIndex: 0,
        moneyIndex: 0,
        value: ''
      },
      areaOptions: regionDataPlus,
      redPackageForm: {
        typeIndex: 0, // 0-单个金额 1-总金额
        money: '',
        num: '',
        area: [],
        timeStatus: false,
        sendTime: '',
        note: ''
      },
      redPackageCodeUrl: '',
      goodsList: [],
      transferProps: {
        key: 'id',
        label: 'goods_name',
        disabled: false
      },
      goodsLeadInForm: {
        selectList: []
      },
      materialPageData: {
        index: 1,
        size: 10,
        total: 0
      },
      materialTableData: [{
        id: 1,
        content: '欢迎进入直播间～直播间不定时发放福利～'
      }],
      materialSelectedData: {},
      dialogMaterialAddVisible: false,
      materialSetForm: {
        content: ''
      },
      medalTableData: [],
      noticeTableData: [],
      noticeSelectedData: {},
      dialogNoticeAddVisible: false,
      noticeSetForm: {
        content: ''
      },
      forbidTableData: [],
      orderPageData: {
        index: 1,
        size: 10,
        total: 0
      },
      orderTableData: [],
      anchorTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'userInfo',
      'activityData',
      'liveWebSocketUrl'
    ]),
    formatAnchorInfo() {
      const { current_anchor_id, current_anchor_info } = this.activityInfoData.live_info
      return current_anchor_id && current_anchor_info ? current_anchor_info : { name: '暂无主播', avatar: defaultAvatar }
    },
    redPackageDisabled() {
      const { money, num, area, timeStatus, sendTime } = this.redPackageForm
      return !money || !num || !area.length || (timeStatus && !sendTime)
    },
    formatRedPackageMoney() {
      const { typeIndex, money, num } = this.redPackageForm
      return typeIndex ? money : money * num
    }
  },
  created() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.autoLiveSectionHeight)
    })
    this.getMessageList()
    !this.webSocketConnectStatus && this.initWebSocket()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.autoLiveSectionHeight)
    this.webSocket && this.webSocket.close()
  },
  methods: {
    initLiveSocket() {
      const { link } = this.liveInfoData
      // eslint-disable-next-line
      const objectPlayer = new mpsPlayer({
        container: 'MPSplayer', // 播放器容器ID，必要参数
        uin: '45524', // 用户ID
        appId: '7zuHm6bum1UyySiS', // 播放实例ID
        hlsUrl: link.includes('m3u8') ? link : '', // 'http://aodi4.feimi0513.xyz/feimi0513/stream.m3u8', // 控制台开通的APP hls地址
        rtmpUrl: link.startsWith('rtmp') ? link : '', // 'rtmp://aodia.feimi0513.xyz/feimi0513/stream', // 控制台开通的APP rtmp地址
        flvUrl: '', // flv地址
        width: '100%', // 播放器宽度，可用数字、百分比等
        height: '100%', // 播放器高度，可用数字、百分比等
        autostart: true, // 是否自动播放，默认为false
        controlbardisplay: 'disable', // 是否显示控制栏，值为：disable、enable默认为disable。
        isclickplay: false, // 是否单击播放，默认为false
        isfullscreen: false, // 是否双击全屏，默认为true
        mobilefullscreen: false, // 移动端是否全屏，默认为false
        enablehtml5: true, // 是否优先使用H5播放器，默认为false
        isloadcount: 1, // 网络波动卡顿loading图标显示(默认1s后)
        verticalScreen: false, // 移动端开启竖屏模式 Boolean ，true 开启 ，false 关闭 ，默认false
        useNewH5: true, // boolean 默认 false 移动端微信qq使用新版x5
        VideoFit: 'cover', // string 默认 contain 视频填充形式（H5有效） "contain">保持宽高比（有黑边） "fill">拉伸完全填充 "cover">保持宽高比完全填充（被裁减） "none">保持原尺寸 "scale-down">取最小尺寸
        orientation: 'landscape' // string  landscape 横屏（默认） portraint 竖屏  安卓移动端全屏 选择是横屏还是竖屏（不针对新版x5）
      })
      console.log(objectPlayer)
      /* rtmpUrl与hlsUrl同时存在时播放器优先加载rtmp*/
      /* 以下为MPS支持的事件 */
      /* objectPlayer.startPlay();//播放 */
      /* objectPlayer.pausePlay();//暂停 */
      /* objectPlayer.stopPlay();//停止*/
      /* objectPlayer.closeConnect();//断开连接 */
      /* objectPlayer.setMute(true);//静音或恢复音量，参数为true|false */
      /* objectPlayer.setVolume(volume);//设置音量，参数为0-100数字 */
      /* objectPlayer.setFullScreenMode(1);//设置全屏模式,1代表按比例撑满至全屏,2代表铺满全屏,3代表视频原始大小,默认值为1。手机不支持 */
    },
    initWebSocket() {
      const webSocket = new WebSocket(this.liveWebSocketUrl)
      this.webSocket = webSocket
      webSocket.onopen = this.webSocketOpenAction
      webSocket.onmessage = this.webSocketMessageAction
      webSocket.onerror = (err) => {
        console.log(err)
      }
      webSocket.onclose = () => {
        this.webSocketConnectStatus = false
      }
    },
    socketSend(param) {
      this.webSocket.send(JSON.stringify(param))
    },
    webSocketOpenAction({ actionType, ...param }) {
      this.webSocketConnectStatus = true
      switch (actionType) {
        case 'login': // 登录
          this.socketSend({
            event: 'login',
            activity_id: this.activityData.id,
            token: this.token,
            live_id: this.liveId
          })
          break
        case 'goodsList': // 商品列表
          this.socketSend({
            event: 'get_goods'
          })
          break
        case 'chat': // 聊天/客服聊天
          this.socketSend({
            event: 'say',
            message: param.message,
            to_user_id: param.userId
          })
          break
        case 'sendOrder': // 购买成功后发送商品订单
          this.socketSend({
            event: 'send_order',
            order_sn: param.orderSn
          })
          break
        case 'updateGoodsData': // 更新直播商品信息
          this.socketSend({
            event: 'update_goods_info',
            type: 'pc',
            id: param.id,
            brand_id: param.brand,
            goods_name: param.name,
            goods_image: param.picture,
            sku: param.standards,
            storage: param.storage,
            old_price: param.prevPrice,
            ms_price: param.livePrice,
            front_money: param.payPrice,
            commission: param.income,
            sort: param.sort
          })
          break
        case 'pushModal': // 推送直播章
          this.socketSend({
            event: 'push_live_badge',
            live_badge_id: param.modalId
          })
          break
        case 'setLiveNotice': // 设置直播公告
          this.socketSend({
            event: 'set_live_content',
            id: param.noticeId
          })
          break
        case 'setAnchorOnLine':
          this.socketSend({
            event: 'set_new_anchor',
            host_id: param.anchorId
          })
          break
        case 'forbidSpeak': // 禁言
          this.socketSend({
            event: 'jinyan',
            user_id: param.userId
          })
          break
        case 'allowSpeak': // 解禁
          this.socketSend({
            event: 'jiejin',
            user_id: param.userId
          })
          break
        default:
          this.webSocketOpenAction({ actionType: 'login' })
          break
      }
    },
    webSocketMessageAction(e) {
      const responseData = validateJSON(e.data)
      console.log(responseData)
      if (responseData) {
        switch (responseData.event) {
          case 'login': // 登录
            this.activityInfoData = responseData.activity_info
            this.userInfotData = responseData.user_info
            this.userListData = responseData.user_list
            this.liveInfoData = responseData.live_info
            this.forbidTableData = responseData.no_user_list

            // 获取商品列表
            this.webSocketOpenAction({ actionType: 'goodsList' })

            this.$nextTick(() => {
              this.initLiveSocket()
            })
            break
          case 'activity_info': // 活动信息
            this.activityInfoData = {
              ...this.activityInfoData,
              ...responseData.activity_info,
              number_of_likes: this.activityInfoData.number_of_likes
            }
            this.formCancelAction()
            break
          case 'user_list': // 用户列表
            this.userListData = responseData.user_list
            this.forbidTableData = responseData.no_user_list
            break
          case 'get_goods': // 商品列表
            this.goodsListData = responseData.goods_list
            break
          case 'update_goods_info': // 更新商品结果通知
            this.$message.success(responseData.message)
            this.formCancelAction()
            break
          case 'set_new_anchor': // 设置主播成功
            this.$message.success(responseData.message)
            this.formCancelAction()
            break
          case 'message': // 聊天信息
            this.messageList.push({ ...responseData.data, content: responseData.data.message })
            this.formCancelAction()
            this.nodeScrollTopAction('messageList')
            break
          case 'jinyan': // 禁言结果
            this.$message.success(responseData.message)
            break
          case 'jiejin': // 解禁结果
            this.$message.success(responseData.message)
            break
          case 'gift_notice': // 购买礼物通知
            this.$message.success(responseData.message)
            break
          case 'goods_notice': // 购买商品通知
            this.$message.success(responseData.message)
            break
          case 'push_live_badge': // 直播章推送结果通知
            this.$message.success(responseData.message)
            break
          case 'user_reward_red_packet': // 用户打赏红包通知
            this.$message.success(responseData.message)
            break
          case 'error': // 错误信息
            this.$message.error(responseData.message)
            break
          default:
            break
        }
      }
    },
    nodeScrollTopAction(refName) {
      this.$nextTick(() => {
        const refNode = this.$refs[refName]
        refNode.scrollTop = refNode.scrollHeight
      })
    },
    autoLiveSectionHeight() {
      const aLiveSection = document.querySelector('.live-section')
      autoNodeHeightCommon(aLiveSection)
    },
    getMessageList() {
      liveMessageList({ ...this.pageData, activityId: this.activityData.id, liveId: this.liveId }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.messageList = [...data, ...this.messageList]
      })
    },
    messageMoreAction() {
      this.pageData.index += 1
      this.getMessageList()
    },
    messageSendAction() {
      this.webSocketOpenAction({ actionType: 'chat', message: this.messageCont })
      this.messageCont = ''
    },
    // 修改商品
    editGoodsAction(item) {
      this.goodsForm = {
        id: item.id,
        brand: item.brand_id,
        name: item.goods_name,
        picture: item.goods_image,
        standards: item.sku,
        storage: item.storage,
        prevPrice: item.old_price,
        livePrice: item.ms_price,
        payPrice: item.front_money,
        income: item.commission,
        sort: item.sort
      }
      this.dialogData = {
        status: true,
        type: 'goodsEdit'
      }
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith('image')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('请上传图片文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB!')
      }
      return isImage && isLt2M
    },
    fileUploadAction(options) {
      fileUpload(options.file).then(response => {
        this.$message.success(response.msg)
        const { resource_id, url } = response.data
        this.goodsForm.picture = { id: resource_id, url }
      })
    },
    formCancelAction() {
      this.dialogData = {
        status: false,
        type: ''
      }
    },
    goodsFormSaveAction() {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          this.webSocketOpenAction({ actionType: 'updateGoodsData', ...this.goodsForm })
        } else {
          return false
        }
      })
    },
    // 预存充值
    preStoreAction() {
      this.preStoreForm.stepIndex = 1
    },
    // 发红包
    redPackageAction() {
      this.dialogData = {
        status: true,
        type: 'redPackage',
        width: '360px'
      }
    },
    tabRedPackageType(typeIndex) {
      this.redPackageForm.typeIndex = typeIndex
    },
    handleAreaListChange(value) {
      console.log(value)
    },
    codeCreator(codeUrl) {
      QRCode.toDataURL(codeUrl, {
        width: 400,
        margin: 2
      }, (error, url) => {
        if (error) {
          console.log(error)
        } else {
          this.redPackageCodeUrl = url
        }
      })
    },
    circleRechargeOrderValidate(orderSn) {
      this.timer = setInterval(() => {
        rechargeOrderData({ activityId: this.activityData.id, orderSn }).then(response => {
          const { pay_status } = response.data
          if (pay_status) {
            clearInterval(this.timer)
            this.webSocketOpenAction({ actionType: 'sendOrder', orderSn })
            this.formCancelAction()
            this.$message.success('红包支付成功')
          }
        }).catch(() => {
          this.formCancelAction()
        })
      }, 4000)
    },
    sendRedPackageAction() {
      redPackageSend({ activityId: this.activityData.id, liveId: this.liveId, ...this.redPackageForm }).then(response => {
        const { code_url, order_sn } = response.data
        this.codeCreator(code_url)
        this.circleRechargeOrderValidate(order_sn)
        this.formCancelAction()
        this.$refs.redPackageForm.resetFields()
        this.dialogData = {
          status: true,
          type: 'redPackageCode',
          width: '360px'
        }
      })
    },
    // 商品
    filterMethod(query, item) {
      return item.goods_name.indexOf(query) > -1
    },
    getGoodsList() {
      return goodsTimeListWidthNoPage({ activityId: this.activityData.id, timeType: goodsTypeData.live })
    },
    getLiveGoodsIdList() {
      return liveGoodsIdList({ activityId: this.activityData.id, liveId: this.liveId })
    },
    async goodsLeadInAction() {
      if (!this.goodsList.length) {
        const resultData = await this.getGoodsList()
        resultData.data && (this.goodsList = resultData.data)
      }
      const response = await this.getLiveGoodsIdList()
      response.data && (this.goodsLeadInForm.selectList = response.data)
      this.dialogData = {
        status: true,
        type: 'goodsLeadIn'
      }
    },
    liveGoodsFormSaveAction() {
      liveGoodsIdSet({
        activityId: this.activityData.id,
        liveId: this.liveId,
        goodsIdList: this.goodsLeadInForm.selectList
      }).then(response => {
        this.$message.success(response.msg)
        this.webSocketOpenAction({ actionType: 'goodsList' })
        this.formCancelAction()
      })
    },
    // 直播素材
    getMaterialList() {
      materialList({
        ...this.materialPageData,
        type: materialTypeData.live,
        activityId: this.activityData.id,
        liveId: this.liveId
      }).then(response => {
        const { data, total } = response.data
        this.materialPageData.total = total
        this.materialTableData = data
      })
    },
    liveMaterialAction() {
      this.getMaterialList()
      this.dialogData = {
        status: true,
        type: 'liveMaterial'
      }
    },
    indexMaterialMethod(indexIndex) {
      const { index, size } = this.materialPageData
      return (index - 1) * size + (indexIndex + 1)
    },
    handleMaterialSelect(value) {
      if (value.length === 0) {
        this.materialSelectedData = {}
      } else if (value.length === 1) {
        this.materialSelectedData = value[0]
      } else {
        this.materialSelectedData = value.find((item, index) => {
          const state = (index === value.length - 1)
          !state && this.$refs['materialSingleTable'].toggleRowSelection(item)
          return state
        })
      }
    },
    handleMaterialAddAction() {
      this.dialogMaterialAddVisible = true
    },
    handleMaterialEditAction(scope) {
      this.materialSetForm = scope.row
      this.handleMaterialAddAction()
    },
    handleMaterialDeleteAction(scope) {
      materialDelete({ activityId: this.activityData.id, liveId: this.liveId, id: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getMaterialList()
      })
    },
    handleMaterialSizeChange(value) {
      this.materialPageData.size = value
      this.getMaterialList()
    },
    handleMaterialCurrentChange(value) {
      this.materialPageData.index = value
      this.getMaterialList()
    },
    setDialogTemplateVisible({ status, content }) {
      this.dialogMaterialAddVisible = status
      if (typeof content === 'string') {
        this.getMaterialList()
      } else {
        this.materialSetForm = {
          content: ''
        }
      }
    },
    materialSendAction() {
      this.webSocketOpenAction({ actionType: 'chat', message: this.materialSelectedData.content })
    },
    // 直播章
    getLiveMedalData() {
      liveMedalData({ activityId: this.activityData.id, liveId: this.liveId }).then(response => {
        const resultData = response.data
        if (resultData && resultData.length) {
          this.medalTableData = resultData
        }
      })
    },
    liveMedalAction() {
      this.getLiveMedalData()
      this.dialogData = {
        status: true,
        type: 'liveMedal'
      }
    },
    liveMedalPushAction(item) {
      console.log(item)
      this.webSocketOpenAction({ actionType: 'pushModal', modalId: item.id })
      this.formCancelAction()
    },
    // 直播公告
    getNoticeList() {
      noticeList({ activityId: this.activityData.id, liveId: this.liveId }).then(response => {
        this.noticeTableData = response.data
      })
    },
    liveNoticeAction() {
      this.getNoticeList()
      this.dialogData = {
        status: true,
        type: 'liveNotice'
      }
    },
    handleNoticeSelect(value) {
      if (value.length === 0) {
        this.noticeSelectedData = {}
      } else if (value.length === 1) {
        this.noticeSelectedData = value[0]
      } else {
        this.noticeSelectedData = value.find((item, index) => {
          const state = (index === value.length - 1)
          !state && this.$refs['noticeSingleTable'].toggleRowSelection(item)
          return state
        })
      }
    },
    handleNoticeAddAction() {
      this.dialogNoticeAddVisible = true
    },
    handleNoticeEditAction(scope) {
      this.noticeSetForm = scope.row
      this.handleNoticeAddAction()
    },
    handleNoticeDeleteAction(scope) {
      noticeDelete({ activityId: this.activityData.id, liveId: this.liveId, id: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getNoticeList()
      })
    },
    noticeSendAction() {
      this.webSocketOpenAction({ actionType: 'setLiveNotice', noticeId: this.noticeSelectedData.id })
    },
    noticeFormCancelAction() {
      this.dialogNoticeAddVisible = false
      this.noticeSetForm = {
        content: ''
      }
    },
    noticeFormSaveAction() {
      const requestName = !this.noticeSetForm.id ? noticeAdd : noticeEdit
      requestName({ activityId: this.activityData.id, liveId: this.liveId, ...this.noticeSetForm }).then(response => {
        this.$message.success(response.msg)
        this.getNoticeList()
        this.noticeFormCancelAction()
      })
    },
    // 禁言
    forbidSpeakAction() {
      this.dialogData = {
        status: true,
        type: 'forbidSpeak',
        width: '400px'
      }
    },
    removeForbidSpeakAction(scope) {
      this.$alert('确定解除该人员禁言吗？', '解禁', {
        confirmButtonText: '确定',
        callback: action => {
          this.webSocketOpenAction({ actionType: 'allowSpeak', userId: scope.row.id })
        }
      })
    },
    // 订单预览
    getLiveOrderList() {
      return new Promise((resolve, reject) => {
        liveOrderList({ ...this.orderPageData, activityId: this.activityData.id, liveId: this.liveId }).then(response => {
          const { data, total } = response.data
          this.orderPageData.total = total
          this.orderTableData = data
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    async orderPreviewAction() {
      await this.getLiveOrderList()
      this.dialogData = {
        status: true,
        width: '480px',
        type: 'orderPreview'
      }
    },
    async handleOrderSizeChange(value) {
      this.orderPageData.size = value
      await this.getLiveOrderList()
    },
    async handleOrderCurrentChange(value) {
      this.orderPageData.index = value
      await this.getLiveOrderList()
    },
    // 主播
    getLiveAnchorList() {
      liveAnchorList({ activityId: this.activityData.id, liveId: this.liveId }).then(response => {
        this.anchorTableData = response.data
      })
    },
    liveAnchorAction() {
      this.getLiveAnchorList()
      this.dialogData = {
        status: true,
        width: '480px',
        type: 'liveAnchor'
      }
    },
    upLineAction(scope) {
      this.webSocketOpenAction({ actionType: 'setAnchorOnLine', anchorId: scope.row.id })
    }
  }
}
</script>

<style lang="scss" scoped>
  .live-home-container{
    height: calc(100vh - 100px);
    min-height: 600px;
    overflow: hidden;
    .live-home-wrap{
      height: 100%;
      min-width: 900px;
      &>div{
        float: left;
        height: 100%;
      }
      .live-section{
        width: calc((100% - 92px) / 3 * 2);
        .live-player-wrap{
          position: relative;
          background: #DDD;
          .liver-wrap{
            position: absolute;
            top: 12px;
            left: 12px;
            z-index: 1000;
            padding: 2px 4px 2px 0;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 20px;
            font-size:12px;
            font-weight:400;
            color:rgba(51,51,51,1);
            .el-avatar,
            span{
              vertical-align: middle;
            }
            span{
              margin-left: 4px;
            }
          }
          .notice-wrap{
            height: 24px;
            background: rgba(0,0,0,0.5);
            .svg-icon{
              position: relative;
              top: -2px;
              margin: 0 8px;
            }
            .notice{
              width: calc(100% - 40px );
              margin-top: 6px;
              color: #FFF;
              font-size: 12px;
            }
          }
        }
        .live-goods{
          margin: 10px 0;
          overflow-y: auto;
          .goods-list{
            padding-bottom: 12px;
            white-space: nowrap;
            overflow-x: auto;
            .goods-item{
              display: inline-block;
              position: relative;
              width:120px;
              height:136px;
              margin: 12px 12px 0 0;
              background:#FFF;
              border-radius:10px;
              .title{
                height:23px;
                background:rgba(255,115,0,1);
                border-radius:10px 10px 0 0;
                font-size:12px;
                font-weight:500;
                color:rgba(255,255,255,1);
                line-height:23px;
                text-align: center;
              }
              .price-edit{
                line-height:14px;
                .price-wrap{
                  .prev-price{
                    font-size:8px;
                    font-weight:400;
                    color:rgba(205,205,205,1);
                    text-decoration: line-through;
                    transform: scale(0.8);
                  }
                  .live-price{
                    font-size:10px;
                    font-weight:400;
                    color:rgba(0,0,0,1);
                    transform: scale(0.8);
                    span{
                      color: #FF0000;
                    }
                  }
                }
                .edit{
                  margin-right: 4px;
                  color: #333;
                  cursor: pointer;
                }
              }
              .live-status{
                position: absolute;
                top: 60px;
                left: 36px;
                padding: 3px 6px;
                background: #F00;
                border-radius: 4px;
                font-size: 12px;
                color: #FFF;
              }
            }
          }
        }
      }
      .chat-section{
        width: calc((100% - 92px) / 3);
        margin: 0 6px;
        background: url('../../../../../assets/live/chat_bg.png') no-repeat left top/100% 100%;
        .chat-title{
          height: 60px;
          font-size:18px;
          font-weight:500;
          color:rgba(255,255,255,1);
          text-align: center;
          line-height: 60px;
        }
        .chat-cont{
          height: calc(100% - 118px);
          margin-bottom: 10px;
          font-size: 12px;
          opacity: 0.8;
          overflow-y: auto;
          .message-more{
            color: #FFF;
            text-align: center;
            line-height: 24px;
            cursor: pointer;
          }
          .notice-item{
            position: relative;
            margin: 8px 10px 0 30px;
            line-height: 16px;
            &>div{
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              color: #F8E71C;
              .item-cont{
                flex: 1;
                position: relative;
              }
            }
            .svg-icon{
              position: absolute;
              top: 0;
              left: -20px;
              font-size: 16px;
            }
          }
          .message-item{
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            margin: 8px 10px 0 30px;
            line-height: 14px;
            color: #FFF;
            &.active{
              .item-user>span,
              .item-cont{
                color: #F8E71C!important;
              }
            }
            .item-user{
              .name{
                color: #F47004;
                &+span{
                  position: relative;
                  top: -1px;
                }
              }
            }
            .item-cont{
              flex: 1;
            }
          }
        }
        .chat-send{
          height: 36px;
          margin: 0 8px 12px;
          padding-right: 6px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 18px;
          .el-input{
            width: calc(100% - 62px);
            line-height: 36px;
            color: #FFF;
          }
          .el-button{
            margin: 4px 0 0 6px;
          }
        }
      }
      .menu-section{
        width: 80px;
        padding: 16px 0;
        background: #4A4A4A;
        overflow-y: auto;
        .menu-item{
          margin: 16px 0;
          font-size:12px;
          font-weight:400;
          color:rgba(255,255,255,1);
          text-align: center;
          cursor: pointer;
          user-select: none;
          .el-avatar{
            padding: 8px;
            margin-bottom: 4px;
          }
        }
      }
    }

    .goods-edit-dialog{
      .dialog-cont{
        padding: 20px 0 0;
        border-top: 1px solid #DDD;
        border-bottom: 1px solid #DDD;
        .el-form{
          .form-item{
            float: left;
            width: calc(50% - 10px);
          }
        }
      }
    }
    .pay-store-dialog{
      .dialog-cont{
        padding: 20px 0;
        .pre-store-code{
          padding-bottom: 24px;
          text-align: center;
          .el-image{
            margin-bottom: 10px;
            background: #EEE;
          }
        }
      }
    }
    .red-package-dialog{
      margin: 0 24px;
      .el-form{
        &>.el-form-item{
          margin-bottom: 12px;
          font-size:16px;
          font-weight:400;
          color:rgba(0,0,0,1);
          &:first-child{
            margin-bottom: 0;
            &+.tabType{
              margin: 4px 0 12px 8px;
              font-size: 14px;
              span{
                color: #FF7300;
                cursor: pointer;
                user-select: none;
              }
            }
          }
          padding: 4px 12px;
          background: #F0F0F0;
          border-radius:6px;
        }
        .pin{
          margin-left: 2px;
          padding: 4px 8px;
          background: #FF7300;
          border-radius: 4px;
          font-size:12px;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
        .introduction{
          font-size:12px;
          font-weight:400;
          color:rgba(255,68,120,1);
          line-height: 15px;
        }
        .total-price{
          font-size:30px;
          font-weight:500;
          color:rgba(255,0,0,1);
          line-height:60px;
          text-align: center;
        }
        .send-action{
          width: 100%;
        }
        .tip{
          padding-bottom: 24px;
          text-align: center;
          font-size:12px;
          font-weight:400;
          color:rgba(74,74,74,1);
        }
      }
    }
    .red-package-code-dialog {
      margin: 0 24px;
    }
    .goods-lead-in-dialog{}
    .live-material-dialog,
    .live-notice-dialog{
      position: relative;
      .dialog-title{
        .el-button{
          position: absolute;
          right: 24px;
          top: 16px;
        }
      }
      .dialog-cont{
        margin: 0 24px;
        .el-table{
          border-top: 1px solid #EBEEF5;
          line-height: 1;
          .table-action{
            margin: 0 8px;
            font-size: 18px;
            cursor: pointer;
          }
        }
      }
    }
    .live-medal-dialog{
      .dialog-cont{
        .medal-list{
          height: 400px;
          padding: 10px 36px 20px;
          overflow-y: auto;
          .medal-item{
            min-width: 100px;
            margin: 24px 10px 0;
            text-align: center;
            .medal{
              position: relative;
              width: 90px;
              height: 90px;
              margin: auto;
              background: url('../../../../../assets/live/medal_bg.png') no-repeat center/100% 100%;
              .el-image{
                position: absolute;
                top: 28px;
                left: 20px;
                width: 50px;
                height: 22px;
              }
            }
            .el-button{
              height: 28px;
              margin-top: 4px;
            }
          }
        }
      }
    }
    .forbid-speak-dialog{}
    .order-preview-dialog{
      .dialog-cont{
        padding: 0 24px;
        .order-item{
          padding: 10px 0;
          border-bottom: 1px solid #EEE;
          .order-left{
            .el-image{
              width: 60px;
              height: 60px;
            }
          }
          .order-center{
            flex: 1;
            margin: 0 20px;
            font-weight:400;
            .title{
              font-size:14px;
              color:rgba(0,0,0,1);
            }
            .prevPrice{
              margin: 10px 0 4px;
              font-size:12px;
              color:#B2B2B2;
              text-decoration: line-through;
            }
            .time{
              font-size:12px;
              color:rgba(0,0,0,1);
            }
          }
          .order-right{
            text-align: right;
            .price{
              font-size:18px;
              font-weight:500;
              color:rgba(255,0,0,1);
            }
            .num{
              margin-top: 10px;
              font-size:16px;
              font-weight:400;
              color:rgba(0,0,0,1);
            }
          }
        }
      }
    }
    .empty-order{
      padding: 40px 0 60px;
      text-align: center;
      font-size: 14px;
      color: #BBB;
    }
  }
</style>

<style lang="scss">
  .chat-section{
    .chat-send{
      .el-input{
        .el-input__inner{
          background: transparent;
          border: none;
        }
        input{
          color: #FFF;
        }
      }
    }
  }

  .el-dialog{
    .dialog-title{
      padding: 20px 0;
      font-size:16px;
      font-weight:400;
      color:rgba(51,51,51,1);
      text-align: center;
    }
    .dialog-footer{
      padding: 20px 0;
      text-align: center;
    }
    .el-table__header{
      tr{
        &>th:first-child{
          .el-checkbox__inner{
            display: none;
          }
        }
      }
    }
  }

  .notice-set-dialog{
    .dialog-cont{
      padding: 0 24px;
    }
  }
</style>
