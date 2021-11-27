
<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDiallog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="序号"
        border
        show-row-hover
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="modify(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="modifyOpen(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            clearable
            change-on-select
            expand-trigger="hover"
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //修改-->
    <el-dialog title="修改" :visible.sync="modifyDialogVisible" width="50%">
      <el-form ref="modifyform" :model="modifyForm" label-width="70px">
        <el-form-item label="修改分类">
          <el-input v-model="modifyForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //!查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catelist: [],
      //!总数居条数
      total: 0,
      //!为table属性指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
      //!控制添加分类对话框显示和隐藏
      addCateDialogVisible: false,
      //!添加分类的表单数据对象
      addCateForm: {
        //!将要添加的分类名称
        cat_name: '',
        //!父级分类的id
        cat_pid: 0,
        //!分类的等级，默认以及
        cat_level: 0,
      },
      //!添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //!父级分类的列表
      parentCateList: [],
      //!指定选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //!选中父级选择器的Id数组
      selectKeys: [],
      modifyDialogVisible: false,
      modifyForm: {},
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    //!获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      // console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      //!把数据列表赋值catelist
      this.catelist = res.data.result
      // console.log(this.catelist);
      //!为总数条数赋值
      this.total = res.data.total
    },
    //!监听pagesize改变
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //!监听pagenum 改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    //!点击按钮，添加分类对话框
    showAddCateDiallog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //!获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败！')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    //!选择项发生变化触发这个函数
    parentCateChanged() {
      // console.log(this.selectKeys)
      //!如果selectKeys的length大于0，证明选择了父级分类
      //!反之就是没有选择任何父级分类
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        //!为当前分类等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        //!为当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //!点击按钮，添加新的分类
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    //!监听对话框关闭事件，重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //!展示修改
    async modify(id) {
      // console.log(id.cat_id)
      this.modifyDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + id.cat_id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类失败')
      }
      this.modifyForm = res.data
      this.modifyDialogVisible = true
      // console.log(this.modifyForm)
    },
    //!监听修改对话框关闭事件
    // modifyClosed(){
    //   this.$refs.modifyform.resetFields()
    // },
    async modifyInfo() {
      //!发起网络请求
      const { data: res } = await this.$http.put(
        'categories/' + this.modifyForm.cat_id,
        {
          cat_name: this.modifyForm.cat_name,
        }
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('修改分类名称失败！')
      }
      this.$message.success('修改分类名称成功！')
      this.getCateList()
      this.modifyDialogVisible = false
    },
    async modifyOpen(id) {
      const divide = await this.$confirm(
        '此操作将永久删除此分类, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // console.log(divide);
      if (divide !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }
      this.$message.success('删除分类成功！')
      //!刷新列表
      this.getCateList()
    },
  },
}
</script>

<style scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>