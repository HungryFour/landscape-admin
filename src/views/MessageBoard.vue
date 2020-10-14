<template>
  <div class="container">
    <el-table :data="messages" style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="name" label="姓名" fixed="left"></el-table-column>
      <el-table-column prop="tel" :show-overflow-tooltip="true" label="联系方式"></el-table-column>
      <el-table-column prop="email" :show-overflow-tooltip="true" label="Email"></el-table-column>
      <el-table-column prop="content" :show-overflow-tooltip="true" label="留言内容"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        messages: [],
        tableLoading: false
      }
    },
    mounted () {
      this.getMessages()
    },
    methods: {
      getMessages () {
        this.tableLoading = true
        this.$api.getMessages({}).then((res) => {
          this.tableLoading = false
          this.messages = res.data.data
        }).catch((err) => {
          this.tableLoading = false
          console.error(err)
        })
      }
    }
  }
</script>

<style>
  .container {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .el-pagination {
    margin-top: 20px;
  }

</style>
