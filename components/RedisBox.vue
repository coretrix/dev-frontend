<template>
  <v-card height="75px" class="d-flex flex-column">
    <slot name="top">
      <h4 class="text-center mt-3 mb-2 len">
        <span
          v-if="secondaryText === 'blocked_clients'"
          :class="{
            'orange--text': focusText > 50 && focusText <= 100,
            'red--text': focusText > 100,
          }"
        >
          {{ focusText }}
        </span>
        <span v-else>
          {{ focusText }}
        </span>
      </h4>
    </slot>
    <slot name="bottom">
      <v-card-text v-if="secondaryText" class="mt-auto px-3 pb-2 pt-0">
        <div class="text-center">
          {{ secondaryText }}
        </div>
      </v-card-text>
    </slot>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component
export default class RedisBox extends Vue {
  @Prop({ default: undefined }) readonly focusText!:string
  @Prop({ default: undefined }) readonly secondaryText!:string
  @Prop({ default: undefined }) readonly keyType!:string
}
</script>

<style scoped lang="scss"></style>
