<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
              {{ scope.row }}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-search"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 内容主题曲 -->
      <!-- <span>这是一段信息</span> -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改角色分配"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="reset"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="角色" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisble"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- tree空间 -->
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolelist: [],
      addDialogVisible: false,
      // 添加用户得表单数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加表单验证规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 6,
            message: '用户名的长度在3~6之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色秒速描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10之间',
            trigger: 'blur',
          },
        ],
      },
      editDialogVisible: false,
      // 查询用户对象保存
      editForm: {},
      SetRightDialogVisble: false,
      //所有权限的数据
      rightlist: [],
      //!tree控件属性绑定
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      //!默认选中的节点id数组
      defkeys: [],
      //当前即将分配权限的id
      roleId: '',
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolelist = res.data
      // console.log(this.rolelist)
    },
    //!监听关闭添加对话框
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // !点击按钮添加新用户
    async add() {
      const { data: res } = await this.$http.post('/roles', this.addForm)
      // console.log(res);
      if (res.meta.status !== 201) {
        this.$message.error('添加角色失败！')
      }
      this.$message.success('添加角色成功！')
      //!隐藏添加对话框
      this.addDialogVisible = false
      //刷新列表
      this.getRolesList()
    },
    //!展示编辑对话框
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get('roles/' + id)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
      // console.log(this.editForm);
    },
    //!重置修改表单
    reset() {
      this.$refs.addFormRef.resetFields()
    },
    //! 发起用户修改数据请求
    async submit() {
      const { data: res } = await this.$http.put(
        'roles/' + this.editForm.roleId,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        }
      )
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }
      //!隐藏对话框
      this.editDialogVisible = false
      //!刷新数据列表
      this.getRolesList()
      //!提示成功
      this.$message.success('更新成功！')
    },
    //!根据id删除对应角色
    async removeUserById(id) {
      // console.log(id)
      //弹框询问是否散出角色
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败！')
      }
      this.$message.success('删除用户成功！')
      //!刷新列表
      this.getRolesList()
    },
    //!根据id删除对应权限
    async removeRightById(role, rightId) {
      //!弹框提示是否要删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      //! console.log('确认了删除');
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      //!删除成功,刷新列表
      // !this.getRolesList()
      role.children = res.data
    },
    //!展示分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      //!获取权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据权限失败！')
      }
      this.rightlist = res.data
      // console.log(this.rightlist)
      //!通过递归获取三级节点id
      this.getLeafKeys(role, this.defkeys)
      this.SetRightDialogVisble = true
    },
    //!通过递归的形式，获取角色下的所有三级权限
    getLeafKeys(node, arr) {
      //!如果当前node节点不包括childre属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    //!监听关闭权限管理，并清空数组
    setRightDialogClosed() {
      this.defkeys = []
    },
    //!为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // console.log(keys);
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败!')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.SetRightDialogVisble = false
    },
  },
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>