<template>
  <section class="section section--surface">
    <div class="container contact-wrap">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <RichText as="h2" class="h-title" :text="title" />
        <RichText as="p" v-if="text" :text="text" />
      </div>
      <ContactForm v-bind="form" />
    </div>
  </section>
</template>

<script setup>
import RichText from '../components/prose/RichText.vue'
// `form` takes the same object as a contact page's `form` key —
// { fields, subject, endpoint, submitLabel, success } — so a booking or
// quote form can sit as a section on any page. Omit it for the default
// name / email / message form.
import ContactForm from '@/components/ui/ContactForm.vue'
defineProps({
  eyebrow: String,
  title: { type: String, default: 'Get in touch' },
  text: String,
  form: { type: Object, default: () => ({}) },
})
</script>

<style scoped>
.contact-wrap { max-width: 620px; }
</style>
