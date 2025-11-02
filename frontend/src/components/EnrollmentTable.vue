<template>
  <el-table
    :data="data"
    :loading="loading"
    border
    style="width: 100%"
    class="enrollment-table"
  >
    <template #empty>
      <div class="empty-state">
        <el-empty description="暂无报名数据" />
      </div>
    </template>
    <el-table-column prop="name" label="姓名" min-width="120" />
    <el-table-column prop="gender" label="性别" width="80" align="center" />
    <el-table-column prop="course" label="课程" min-width="160" />
    <el-table-column prop="contact" label="联系方式" min-width="160">
      <template #default="scope">
        <el-tooltip :content="scope.row.contact">
          <span>{{ scope.row.contact }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="remarks" label="备注" min-width="180">
      <template #default="scope">
        <span>{{ scope.row.remarks || "-" }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="创建时间" min-width="180">
      <template #default="scope">
        {{ formatDateTime(scope.row.created_at) }}
      </template>
    </el-table-column>
    <el-table-column prop="updated_at" label="更新时间" min-width="180">
      <template #default="scope">
        {{ formatDateTime(scope.row.updated_at) }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="160" fixed="right">
      <template #default="scope">
        <el-button type="primary" link @click="$emit('edit', scope.row)">
          编辑
        </el-button>
        <el-popconfirm
          width="220"
          confirm-button-text="确认"
          cancel-button-text="取消"
          title="确认删除该报名记录吗？"
          @confirm="$emit('remove', scope.row)"
        >
          <template #reference>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <div class="table-footer">
    <el-pagination
      background
      layout="prev, pager, next, jumper, ->, total"
      :page-size="pagination.pageSize"
      :current-page="pagination.page"
      :total="pagination.total"
      @current-change="emitPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { EnrollmentRecord, PaginationMeta } from "../types/enrollment";

interface Props {
  loading: boolean;
  data: EnrollmentRecord[];
  pagination: PaginationMeta;
}

const props = defineProps<Props>();

const emit = defineEmits<{ (event: "page-change", page: number): void }>();

const formatDateTime = (dateTime: string): string => {
  if (!dateTime) return "-";
  try {
    return new Date(dateTime).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  } catch {
    return dateTime;
  }
};

const emitPageChange = (page: number) => {
  emit("page-change", page);
};
</script>

<style scoped>
.table-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  padding: 40px 0;
}
</style>
