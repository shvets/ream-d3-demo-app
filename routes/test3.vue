<script lang="ts">
import { defineComponent } from 'vue'
import { Head } from 'ream/app'

export default defineComponent({
  components: {
    Head
  }
})
</script>

<template>
  <Head>
    <title>Hello World</title>
    <html lang="en-US" class="theme-dark" />
  </Head>

  <div>Hello Ream3!</div>
</template>
