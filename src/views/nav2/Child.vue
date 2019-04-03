<template>
  <div>
    <!-- 添加一个input输入框 添加keypress事件-->
    <input type="text" :class="testClass" v-model="inputValue" @keypress.enter="enter">
    <p>{{mes}}</p>
  </div>
</template>

<script>
	export default {
		name: "Child",
		data () {
			return {
				inputValue: ''
			}
		},
    props: ["testClass",'mes'],
    methods: {
			enter () {
				this.$emit("sendiptVal", this.inputValue)
				//子组件发射自定义事件sendiptVal 并携带要传递给父组件的值，
				// 如果要传递给父组件很多值，这些值要作为参数依次列出 如 this.$emit('valueUp', this.inputValue, this.mesFather);
			}
    }
    
	}
</script>

<style scoped>

</style>
