<template>
  <el-dialog :model-value="visible" :title="title" width="520" @close="emitClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程" prop="course">
        <el-input v-model="form.course" placeholder="请输入课程" />
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="form.contact" placeholder="手机号 / 邮箱" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="form.remarks"
          placeholder="请输入备注"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5 }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emitClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { EnrollmentFormValues, EnrollmentRecord } from "../types/enrollment";

interface Props {
  visible: boolean;
  title: string;
  initialForm: EnrollmentRecord | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{ (event: "submit", payload: EnrollmentFormValues): void; (event: "close"): void }>();

const formRef = ref<FormInstance>();
const submitting = ref(false);

const emptyForm = (): EnrollmentFormValues => ({
  name: "",
  gender: "",
  course: "",
  contact: "",
  remarks: ""
});

const form = reactive<EnrollmentFormValues>(emptyForm());

watch(
  () => props.initialForm,
  (value) => {
    if (value) {
      Object.assign(form, {
        name: value.name,
        gender: value.gender,
        course: value.course,
        contact: value.contact,
        remarks: value.remarks ?? ""
      });
    } else {
      Object.assign(form, emptyForm());
    }
  },
  { immediate: true }
);

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  course: [{ required: true, message: "请输入课程", trigger: "blur" }],
  contact: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
  remarks: [{ max: 1000, message: "备注长度需在 1000 字以内", trigger: "blur" }]
}));

const emitClose = () => {
  emit("close");
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    submitting.value = true;
    await formRef.value.validate();
    emit("submit", { ...form });
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.dialog-footer {
  display: inline-flex;
  gap: 12px;
}
</style>
