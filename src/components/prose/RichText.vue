<!--
  RichText — renders a config string with inline markdown inside the tag
  you name. Drop-in for `<h2 class="h-title">{{ title }}</h2>`:

    <RichText as="h2" class="h-title" :text="title" />

  Supports **bold**, *italic*, `code`, [links](/about) and ==highlight==
  (accent color — the two-tone title). Syntax and rules: richText.js.
-->
<template>
  <component :is="as" class="rich" v-html="html" @click="onRichClick" />
</template>

<script setup>
import { computed } from 'vue'
import { renderInline } from './richText.js'
import { useRichLinks } from './useRichLinks.js'

const props = defineProps({
  text: { type: String, default: '' },
  as: { type: String, default: 'span' },
})

const html = computed(() => renderInline(props.text))
const { onRichClick } = useRichLinks()
</script>
