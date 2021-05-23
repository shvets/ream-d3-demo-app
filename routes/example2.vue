<template>
  <h1 style="color:green;">Example 2</h1>

  <svg ref="svg" width="600" height="300"></svg>
</template>

<script lang="ts">

import {Example2} from '../pages/example2.js'

import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const svg = ref(null)

    onMounted(() => {
      new Example2(svg.value)
    })

    return {
      svg
    }
  }
})
</script>

<style>
  circle {
    fill-opacity: 0.2;
  }

  circle.active {
    fill-opacity: 0.8;
    stroke: red;
    fill: green;
  }
</style>
