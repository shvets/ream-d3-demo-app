<template>
  <div>{{message}}!</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export const preload = () => {
  return {
    props: {
      message: 'Hello Ream!',
    },
  }
}

export default defineComponent({
// Loaded props
props: ['message']
})
</script>

