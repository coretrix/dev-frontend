<template>
  <div class="p-10">
    <table>
      <tbody>
        <tr>
          <td>AppMode</td>
          <td>{{ $store.state.app.appMode }}</td>
        </tr>
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

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'
export default class DefaultLayout extends Vue {}
</script>

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
