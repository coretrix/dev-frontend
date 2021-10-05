<template>
  <div class="speedbox">
    <div
      id="speedbox-score"
      class="speedbox__score"
      :style="[
        {
          transform: `rotate(${Math.round((speed * 180) / 100) - 45}deg)`,
        },
      ]"
    ></div>
    <div class="speedbox__groove"></div>
    <div class="speedbox__odo">
      <h2>{{ speed }}%</h2>
    </div>
    <div class="speedbox__base"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

@Component
export default class SpeedBox extends Vue {
  @Prop({default: undefined}) readonly speed!:number
}
</script>

<style scoped lang="scss">
$boxHeight: 160px;
$halfHeight: $boxHeight/2;

.speedbox {
  margin: 0 auto;
  margin-bottom: -$halfHeight;
  height: $boxHeight;
  width: $boxHeight;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  -webkit-flex-direction: column;
  align-items: center;
  -webkit-align-items: center;
  position: relative;

  &__groove {
    height: $boxHeight/2;
    width: $boxHeight;
    background: transparent;
    border-top-left-radius: 100px;
    border-top-right-radius: 100px;
    border: 20px solid #eee;
    border-bottom: 0;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
  }

  &__score {
    position: absolute;
    left: 0;
    top: 0;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-0deg);
    height: $boxHeight;
    width: $boxHeight;
    background: transparent;
    border-radius: 50%;
    border: 20px solid #5c6f7b;
    border-color: transparent transparent #5c6f7b #5c6f7b;
    box-sizing: border-box;
    cursor: pointer;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  &__base {
    width: $boxHeight;
    height: $boxHeight/2;
    background: white;
    position: relative;
    top: $boxHeight/2;
    z-index: 20;
    &:before {
      content: '';
      width: $boxHeight;
      position: absolute;
      top: 0;
      border-bottom: 1px solid #eee;
      box-shadow: 1px 3px 15px rgba(0, 0, 0, 0.5);
    }
  }

  &__odo {
    text-align: center;
    position: absolute;
    color: #5c6f7b;
    bottom: $boxHeight/2;
    left: 50%;
    transform: translateX(-50%);
    i {
      font-size: 13px;
      opacity: 0.6;
    }
    > div {
      margin-bottom: 0;
    }
    span {
      font-size: 0.7em;
    }
  }
}
</style>
