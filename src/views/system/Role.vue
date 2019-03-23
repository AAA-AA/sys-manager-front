<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item style="width: 140px;">
					<el-input v-model="filters.name" placeholder="角色名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRoles">查询</el-button>
				</el-form-item>
				<el-form-item style="float: right;">
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="角色名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="roleKey" label="角色key" width="130" sortable>
			</el-table-column>
			<el-table-column prop="mark" label="备注" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		<el-dialog title="编辑"
							 width="30%"
							 :visible.sync="editFormVisible"
							 :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="id" prop="id" v-show="false">
					<el-input v-model="editForm.id" ></el-input>
				</el-form-item>
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色key">
					<el-input v-model="editForm.roleKey"></el-input>
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
							 :visible.sync="addRoleFormVisible"
							 :close-on-click-modal="false"
							 width="30%"
								>
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色key" prop="mail">
					<el-input v-model="addForm.roleKey" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="addForm.mark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addRoleFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
	
</template>
<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getRoleListPage, removeRole, updateRole, addRole } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				roles: [],
				total: 0,
				pageSize:5,
				pageNum: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					roleKey: '',
					mark: ''
				},

				addRoleFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					id: 0,
					name: '',
					roleKey: '',
					mark: ''
				}

			}
		},
		methods: {
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getRoles();
			},
			//获取用户列表
			getRoles() {
				let para = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getRoleListPage(para).then((res) => {
					if (res.data != null) {
						this.total = res.data.totalCount;
						this.roles = res.data.list;
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
					let para = { id: row.id };
					removeRole(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getRoles();
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
				this.addRoleFormVisible = true;
				this.addForm = {
					id: 0,
					name: '',
					roleKey: '',
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							updateRole(para).then((res) => {
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
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addRole(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addRoleFormVisible = false;
								this.getRoles();
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
			this.getRoles();
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
