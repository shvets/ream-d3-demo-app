<template>
  <h1 style="color:green;">Example 1</h1>

  <button>Click</button>
  <br><br>

  <svg ref="svg" style="background-color: lightgreen;" width="500" height="100"></svg>
</template>

<script lang="ts">

import {Example1} from '../pages/example1.js'

import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const svg = ref(null)

    onMounted(() => {
      new Example1(svg.value)
    })

    return {
      svg
    }
  }
})
</script>
