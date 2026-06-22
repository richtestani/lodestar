<template>
  <section class="section section--surface">
    <div class="container contact-wrap">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
        <p v-if="text">{{ text }}</p>
      </div>
      <ContactForm />
    </div>
  </section>
</template>

<script setup>
import ContactForm from '@/components/ui/ContactForm.vue'
defineProps({ eyebrow: String, title: { type: String, default: 'Get in touch' }, text: String })
</script>

<style scoped>
.contact-wrap { max-width: 620px; }
</style>
