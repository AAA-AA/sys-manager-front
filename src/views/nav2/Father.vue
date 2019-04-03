<template>
  <div>
    <p>father</p>
    <child :mes=loginJson.animal :class="demoClass" @sendiptVal='showChildMsg'></child>
  </div>
</template>

<script>
	import Child from "./Child";
	export default {
		name: "Father",
    data() {
			return {
				message: 'hello msg',
        demoClass: "width: 100px",
        loginJson: {
					"animal":"dog"
        }
      }
    },
		components: {Child},
    methods: {
			showChildMsg: function (childVal) {
				this.$alert(childVal, '标题名称', {
					confirmButtonText: '确定',
					callback: action => {
						this.$message({
							type: 'info',
							message: `action: ${ action }`
						});
					}
				});
        console.log(childVal)
			}
    }
	}
</script>

<style scoped>

</style>
