<template>
  <div>{{message}}!</div>
</template>

<script lang="ts">
import { Load } from 'ream/app'
import { defineComponent } from 'vue'

export const load: Load = (options) => {
  return {
    props: {
      message: `Hello Ream!: ${options.host}/${options.path}`
    }
  }
}

export default defineComponent({
  // Loaded props
  props: ['message']
})
</script>
