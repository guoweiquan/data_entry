<template>
  <el-form :inline="true" :model="form" label-width="70px" class="filter-form">
    <el-form-item label="姓名">
      <el-input v-model="form.name" placeholder="请输入姓名" clearable />
    </el-form-item>
    <el-form-item label="性别">
      <el-select v-model="form.gender" placeholder="全部" clearable>
        <el-option label="男" value="男" />
        <el-option label="女" value="女" />
        <el-option label="其他" value="其他" />
      </el-select>
    </el-form-item>
    <el-form-item label="课程">
      <el-input v-model="form.course" placeholder="请输入课程" clearable />
    </el-form-item>
    <el-form-item label="联系方式">
      <el-input v-model="form.contact" placeholder="手机号 / 邮箱" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="emitSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { EnrollmentFilterPayload } from "../types/enrollment";

const emit = defineEmits<{ (event: "search", payload: EnrollmentFilterPayload): void }>();

const form = reactive<EnrollmentFilterPayload>({
  name: "",
  gender: "",
  course: "",
  contact: ""
});

const emitSearch = () => {
  emit("search", { ...form });
};

const handleReset = () => {
  form.name = "";
  form.gender = "";
  form.course = "";
  form.contact = "";
  emitSearch();
};
</script>

<style scoped>
.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
