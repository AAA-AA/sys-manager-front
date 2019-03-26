export default {
	methods: {
		/**
		 * 获取所有展开节点的keys
		 */
		getAllExpandeKeys(tree) {
			return this.getExpandeKeys(tree.root.childNodes);
		},
		/**
		 * 获取展开节点的keys
		 */
		getExpandeKeys(nodes, result = []) {
			nodes.forEach(att => {
				if (att.expanded) {
					result.push(att.key);
				}
				if (att.childNodes) {
					this.getExpandeKeys(att.childNodes, result);
				}
			});
			return result;
		},

	}
};
