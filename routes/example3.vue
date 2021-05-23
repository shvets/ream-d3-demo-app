<template>
<!--  <vue-csv-import-->
<!--      v-model="csv"-->
<!--      :fields="{name: {required: false, label: 'Name'}, age: {required: true, label: 'Age'}}"-->
<!--  >-->
<!--    <vue-csv-toggle-headers></vue-csv-toggle-headers>-->
<!--    <vue-csv-errors></vue-csv-errors>-->
<!--    <vue-csv-input></vue-csv-input>-->
<!--    <vue-csv-map></vue-csv-map>-->
<!--  </vue-csv-import>-->

  <div class="container-fluid">
    <h1>D3 Brush and linking Tutorial <small>VAST 2017 Minichallenge 1</small></h1>
    <div class="row">
      <div class="col-xs-12">
        <h2>Timeline</h2>
        <div id="timeline"></div>
      </div>


      <!-- On small screens fills the full grid, on medium+ ones only half -->
      <div class="col-xs-12 col-md-4">
        <h2>Car Types</h2>
        <div class="barChart" id="carTypes"></div>
      </div>

      <!-- On small screens fills the full grid, on medium+ ones only half -->
      <div class="col-xs-12 col-md-8">
        <h2>Gates</h2>
        <div class="barChart" id="gates"></div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">

import '../pages/example3.js'
import { VueCsvImport } from 'vue-csv-import';

import { defineComponent, ref, onMounted } from 'vue'

export default defineComponent({
  setup() {
    const svg = ref(null)
    const csv = {}

    onMounted(() => {
      // new Example2(svg.value)
    })

    return {
      svg, csv
    }
  },
  components: {
    VueCsvImport
  },
})
</script>

<style>
  #timeline .line {
    fill: none;
    stroke: #000;
    stroke-width: 1.5px;
  }

  #timeline .area {
    /*fill: #969696;*/
    fill: steelblue;
  }

  #timeline .attention {
    background: yellow;
    margin: -4px;
    padding: 4px;
  }

  .barChart .bar {
    fill: steelblue;
  }
  .barChart .x.axis path {
    display: none;
  }
  #gates .x.axis text {
    text-anchor: end;
  }

  #gates svg {
    overflow: visible;
  }
</style>
