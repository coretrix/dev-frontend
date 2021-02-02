<template>
  <div class="p-10">
    <table>
      <tbody>
        <tr>
          <td>process.env.NODE_ENV</td>
          <td>{{ $config.env }}</td>
        </tr>
        <tr>
          <td>process.env.NUXT_API_BASE_URL</td>
          <td>{{ $config.baseURL }}</td>
        </tr>
        <tr>
          <td colspan="2">
            <pre>
            {{ $config.everything }}
          </pre
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  overflow: auto;
  table-layout: fixed;
}
td {
  border: 1px solid #ccc;
  min-width: 50%;
}
</style>
