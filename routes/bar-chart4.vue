<template>
  <svg ref="svg" width="400" height="300">
    <g class="plot-area"/>
    <g class="x-axis" />
    <g class="y-axis" />
    <g class="brush" />
  </svg>
</template>

<script lang="ts">

import {BarChar4, getData} from '../pages/bar-chart4.js'

import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const svg = ref(null)

    onMounted(() => {
      new BarChar4(svg.value, getData())
    })

    return {
      svg
    }
  }
})
</script>

<style>
  div.tooltip {
    position: absolute;
    text-align: center;
    /*width: 60px;*/
    /*height: 28px;*/
    padding: 2px;
    font: 12px sans-serif;
    background: lightsteelblue;
    border: 0;
    border-radius: 8px;
    pointer-events: none;
  }
</style>
