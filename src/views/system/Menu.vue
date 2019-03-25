<template>
  <section>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="菜单名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getMenus">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    
    <el-table :data="menus" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="菜单名称" sortable>
      </el-table-column>
      <el-table-column prop="url" label="菜单url">
      </el-table-column>
      <el-table-column prop="type" label="类型" :formatter="formatButton">
      </el-table-column>
      <el-table-column label="图标">
        <template scope="scope" >
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="mark" label="备注">
      </el-table-column>
      <el-table-column prop="createTime" :formatter="formatToDateTime" label="创建时间"></el-table-column>
      <el-table-column prop="updateTime" :formatter="formatToDateTime" label="更新时间"></el-table-column>
      
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" circle
                     @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" circle
                     @click="handleDel(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                     :total="total" style="float:right;">
      </el-pagination>
    </el-col>
    
    <el-dialog title="编辑"
               width="30%"
               :visible.sync="editFormVisible"
               :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="id" prop="id" v-show="false">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单url">
          <el-input v-model="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-input v-model="editForm.parentId" v-show="false"></el-input>
          <el-input v-model="editForm.parentMenuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="editForm.type">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editForm.mark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="新增"
               :visible.sync="addFormVisible"
               :close-on-click-modal="false"
               width="30%">
      <el-form :model="addForm" label-width="20%" :rules="addFormRules" ref="addForm">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单url">
          <el-input v-model="addForm.url"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-input v-model="addForm.parentId" v-show="false"></el-input>
          <el-input v-model="addForm.parentMenuName"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="addForm.type">
            <el-radio label="1">菜单</el-radio>
            <el-radio label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="addForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="addForm.mark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>

</template>
<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import {getMenuListPage, removeMenu, updateMenu, addMenu} from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        menus: [],
        total: 0,
        pageSize: 5,
        pageNum: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          url: '',
          type: '',
          icon: '',
          mark: ''
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          url: '',
          type: '',
          icon: '',
          mark: ''
        }

      }
    },
    methods: {
      formatButton: function (row, column) {
        return row.type == 1 ? '菜单' : row.type == 2 ? '按钮' : '未知';
      },
      formatToDateTime: function (row, column) {
        if (column.property == 'updateTime') {
          return util.formatDateTime(row.updateTime);
        }

        if (column.property == 'createTime') {
          return util.formatDateTime(row.createTime)
        }
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getRoles();
      },
      //获取用户列表
      getMenus() {
        let para = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.filters.name
        };
        this.listLoading = true;
        //NProgress.start();
        getMenuListPage(para).then((res) => {
          if (res.data != null) {
            this.total = res.data.totalCount;
            this.menus = res.data.list;
          }
          this.listLoading = false;
          //NProgress.done();
        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: row.id};
          removeMenu(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getMenus();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          url: '',
          type: '',
          icon: '',
          mark: ''
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              updateMenu(para).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getRoles();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.addForm);
              addMenu(para).then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getMenus();
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
    },
    mounted() {
      this.getMenus();
    }
  }
</script>

<style scoped>
  .el-input, .el-input__inner {
    width: 75%;
    display: inline-block;
  }
  
  .el-dialog {
    width: 38%;
  }
</style>
