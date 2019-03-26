<template>
  <div>
    <el-input v-if="false" v-model="value"/>
    <el-popover placement="right" width="260" trigger="click">
      <el-input placeholder="请选择上级菜单" v-model="parentMenuName" slot="reference" readonly="readonly"></el-input>
      <el-tree empty-text="暂无数据"
               :data="data"
               :default-expanded-keys="defaultExpandedKeys"
               :expand-on-click-node="false"
               :filter-node-method="filterNode"
               :highlight-current="true"
               @node-click="handleNodeClick"
               node-key="id">
        <div class="associate-personnel" slot-scope="{ node, data }">
          <i class="el-icon-menu"></i>
          <span>{{ data.label }}</span>
          <div class="associate-personnel-edit">
            <em><span v-show="!data.type ">{{ data.name }}</span></em>
          </div>
        </div>
      </el-tree>
    </el-popover>
  </div>
</template>

<script>
	import tree from '@/mixins/tree'

	export default {
		name: "selectMenu",
		mixins: [tree],
		props: {
			value: "",
			data: {
				default() {
					return [];
				},
				type: Array,
				required: true
			},
			containerWidth: {
				default() {
					return 500;
				},
				type: Number
			}

		},
		data() {
			return {
				keyword: '',
				defaultExpandedKeys: [1],
				parentMenuName: this.value
			};
		},
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			// 2.方法
			// 点击菜单对象的选择器的树节点
			handleNodeClick(data) {
				//this.formData.name = data.name;
				//this.formData.id = data.id;
				this.$emit('onNodeClick', data.id);
				this.parentMenuName = data.name;
			}
		}

	}
</script>

<style scoped>

</style>
