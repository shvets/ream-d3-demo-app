<template>
  <svg ref="svg" style="height: 500; width: 500px; margin-right: 0; margin-left: 0">
    <g class="plot-area" />
    <g class="x-axis" />
    <g class="y-axis" />

    <g class="tooltip-area">
      <text class="tooltip-area__text">aas</text>
    </g>
  </svg>
</template>

<script lang="ts">

import {BarChar3} from '../pages/bar-chart3.js'

import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const svg = ref(null)

    onMounted(() => {
      new BarChar3(svg.value)
    })

    return {
      svg
    }
  }
})
</script>
