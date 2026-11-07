<template>
  <main class="contact-page">
    <section class="section">
      <div class="container contact-inner">
        <div class="section-head is-center">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <h1 class="h-title">{{ title }}</h1>
          <p v-if="intro">{{ intro }}</p>
        </div>
        <ContactForm v-bind="form" />
      </div>
    </section>
  </main>
</template>

<script setup>
// The 'contact' view — a general form page. With no extra config it's the
// original "Contact us" page. Any page with view: 'contact' can set its own
// copy and form, so a booking or quote page is just another config file:
//
//   { slug: 'booking', name: 'Booking', view: 'contact',
//     eyebrow: 'Book a show', title: '…', intro: '…',
//     form: { fields: [...], subject, endpoint, submitLabel, success } }
//
// See components/ui/ContactForm.vue for the field format.
import { computed } from 'vue'
import ContactForm from '@/components/ui/ContactForm.vue'

const props = defineProps({ page: { type: Object, default: () => ({}) } })

const isDefault = computed(() => props.page.eyebrow === undefined && props.page.title === undefined && props.page.intro === undefined)
const eyebrow = computed(() => props.page.eyebrow ?? (isDefault.value ? 'Get in touch' : ''))
const title   = computed(() => props.page.title ?? (isDefault.value ? 'Contact us' : props.page.name))
const intro   = computed(() => props.page.intro ?? (isDefault.value ? 'We would love to hear from you — questions, orders, or anything else.' : ''))
const form    = computed(() => props.page.form || {})
</script>

<style scoped>
.contact-page { padding-top: var(--nav-height); }
.contact-inner { max-width: 620px; }
</style>
