<template>
  <div>
    <v-btn to="/redis-stats" class="mr-4 white--text" color="blue">Back</v-btn>
    <pre class="mt-5">
    {{ JSON.stringify(pool, null, 2) }}
  </pre
    >
  </div>
</template>

<script>
export default {
  name: 'RedisChild',
  props: {
    redisData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data: () => {
    return {
      // expanded: [0, 1, 2],
      groupHeaders: [
        {
          text: 'Group Name',
          value: 'Group',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Pending',
          value: 'Pending',
          width: '10%',
          sortable: false,
        },
        {
          text: 'LastDeliveredID',
          value: 'LastDeliveredID',
          width: '12%',
          sortable: false,
        },
        {
          text: 'LastDeliveredDuration',
          value: 'LastDeliveredDuration',
          width: '10%',
          sortable: false,
        },
        {
          text: 'Lower',
          value: 'Lower',
          width: '10%',
          sortable: false,
        },
        {
          text: 'LowerDuration',
          value: 'LowerDuration',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Higher',
          value: 'Higher',
          width: '10%',
          sortable: false,
        },
        {
          text: 'HigherDuration',
          value: 'HigherDuration',
          width: '10%',
          sortable: false,
        },
        {
          text: 'Consumers',
          value: 'Consumers',
          width: '8%',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    pool() {
      const redisPool = this.$route.query.RedisPool
      const result = this.redisData.filter((pool) => {
        return pool.RedisPool === redisPool
      })

      return result[0]
    },
  },
}
</script>
<style lang="scss" scoped></style>
