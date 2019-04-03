<template>
  <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
    <el-form-item label="id" prop="id" v-show="false">
      <el-input v-model="form.id"></el-input>
    </el-form-item>
    <el-form-item label="菜单名称" prop="name">
      <el-input v-model="form.name" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="菜单url">
      <el-input v-model="form.url"></el-input>
    </el-form-item>
    <el-form-item label="上级菜单">
      <el-input v-if="false" v-model="form.parentId"></el-input>
      <select-menu :data='treeData' :value="form.parentMenuName" @onNodeClick='onNodeClick'></select-menu>
    </el-form-item>
    <el-form-item label="菜单类型">
      <el-radio-group v-model="form.type">
        <el-radio :label="1">菜单</el-radio>
        <el-radio :label="2">按钮</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="图标">
      <el-input v-model="form.icon"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input type="textarea" v-model="form.mark"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
	import selectMenu from "../SelectMenu";
	import {selectMenuTree} from '../../../api/api';
	export default {
		name: "EditMenu",
		data() {
			return {
				treeData: [],
				formRules: {
					name: [
						{
							required: true,
							message: "请输入菜单名称",
              trigger: 'blur'
						}
					],
					url: [
						{
							required: true,
							message: "请输入菜单url",
							trigger: 'blur'
						}
					],
					type: [
						{
							required: true,
              type: 'number',
							message: "请输入菜单类型",
						}
					],
     
				}

			}
		},
    components: {
			selectMenu
    },
    created() {
			selectMenuTree().then(result => {
				this.treeData = result.data.data;
			})
		},
    props: {
			form: Object
    },
    methods: {
			onNodeClick(parentId) {
				this.form.parentId = parentId
			}
    }
	}
</script>

<style scoped>

</style>
