<template>
  <el-config-provider namespace="ep">
    <div class="app-container">
      <header class="app-header">
        <h1>报名信息管理系统</h1>
        <el-button type="primary" @click="openCreateModal">新增报名</el-button>
      </header>
      <section class="filter-section">
        <EnrollmentFilters @search="handleSearch" />
      </section>
      <section class="table-section">
        <EnrollmentTable
          :loading="loading"
          :data="enrollmentStore.enrollments"
          :pagination="enrollmentStore.pagination"
          @edit="openEditModal"
          @remove="handleDelete"
          @page-change="handlePageChange"
        />
      </section>
      <footer class="app-footer">
        <el-button type="success" :loading="exporting" @click="handleExport">
          导出数据
        </el-button>
      </footer>
    </div>
    <EnrollmentFormModal
      :visible="modalVisible"
      :title="modalMode === 'create' ? '新增报名' : '编辑报名'"
      :initial-form="currentRecord"
      @submit="handleFormSubmit"
      @close="modalVisible = false"
    />
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useEnrollmentStore } from "./stores/enrollmentStore";
import EnrollmentFilters from "./components/EnrollmentFilters.vue";
import EnrollmentTable from "./components/EnrollmentTable.vue";
import EnrollmentFormModal from "./components/EnrollmentFormModal.vue";
import { EnrollmentFormValues, EnrollmentRecord } from "./types/enrollment";

const enrollmentStore = useEnrollmentStore();
const loading = ref(false);
const exporting = ref(false);
const modalVisible = ref(false);
const modalMode = ref<"create" | "edit">("create");
const currentRecord = ref<EnrollmentRecord | null>(null);
const filters = reactive({
  name: "",
  gender: "",
  course: "",
  contact: ""
});

const fetchData = async (page = 1) => {
  loading.value = true;
  try {
    await enrollmentStore.fetchEnrollments({ ...filters, page });
  } finally {
    loading.value = false;
  }
};

const handleSearch = async (payload: typeof filters) => {
  Object.assign(filters, payload);
  await fetchData(1);
};

const openCreateModal = () => {
  modalMode.value = "create";
  currentRecord.value = null;
  modalVisible.value = true;
};

const openEditModal = (record: EnrollmentRecord) => {
  modalMode.value = "edit";
  currentRecord.value = record;
  modalVisible.value = true;
};

const handleFormSubmit = async (values: EnrollmentFormValues) => {
  loading.value = true;
  try {
    if (modalMode.value === "create") {
      await enrollmentStore.createEnrollment(values);
    } else if (currentRecord.value) {
      await enrollmentStore.updateEnrollment(currentRecord.value.id, values);
    }
    modalVisible.value = false;
    await fetchData(enrollmentStore.pagination.page);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (record: EnrollmentRecord) => {
  loading.value = true;
  try {
    await enrollmentStore.deleteEnrollment(record.id);
    await fetchData(enrollmentStore.pagination.page);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = async (page: number) => {
  await fetchData(page);
};

const handleExport = async () => {
  exporting.value = true;
  try {
    await enrollmentStore.exportEnrollments({ ...filters });
  } finally {
    exporting.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section,
.table-section {
  background: var(--el-color-white);
  padding: 16px;
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.app-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
