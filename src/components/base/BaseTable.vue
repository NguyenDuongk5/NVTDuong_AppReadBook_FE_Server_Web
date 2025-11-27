<template>
  <div class="base-table">
    <table class="w-full border-collapse border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th
            v-for="(col, index) in columns"
            :key="index"
            class="border border-gray-300 px-4 py-2 text-left"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          @click="handleRowClick(row)"
          class="hover:bg-gray-100 cursor-pointer"
        >
          <td
            v-for="(col, colIndex) in columns"
            :key="colIndex"
            class="border border-gray-300 px-4 py-2"
          >
            {{ row[col.field] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "BaseTable",
  props: {
    columns: { type: Array, required: true },
    data: { type: Array, required: true },
  },
  methods: {
    handleRowClick(row) {
      this.$emit("row-click", row); // gửi sự kiện ra ngoài
    },
  },
};
</script>

<style scoped>
.base-table {
  width: 100%;
  overflow-x: auto;
}
</style>
