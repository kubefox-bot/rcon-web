<template>
          <h3>Result</h3>
          
          <pre v-if="props.result?.length">{{ props.result }}</pre>
          
</template>

<script setup lang="ts">
  import {  defineProps } from 'vue';

 const props =  defineProps({
    result:String
 });
</script>

<style lang="css" scoped>
pre {
    background: #111;
    color: #0f0;
    padding: 1rem;
    white-space: pre-wrap;
  }
</style>