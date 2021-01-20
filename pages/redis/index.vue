<template>
  <div>
    <v-row v-if="redisData">
      <v-col v-for="(entry, id) in redisData" :key="id" cols="md-3">
        <v-card
          :to="`/redis/details?id=${id}`"
          height="150px"
          class="d-flex flex-column"
        >
          <h3
            class="text-center mt-7 len"
            :class="{
              'green--text': entry.Len <= 100000,
              'orange--text': entry.Len > 100000 && entry.Len <= 500000,
              'red--text': entry.Len > 500000,
            }"
          >
            <span>{{ entry.Len }}</span>
          </h3>
          <v-card-text class="mt-auto">
            <div class="text-center stream">{{ entry.Stream }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'RedisIndex',
  props: {
    redisData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.len {
  font-size: 42px;
  line-height: 1;
}
.stream {
  font-weight: bold;
  font-size: 16px;
}
</style>
