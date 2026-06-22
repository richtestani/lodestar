<template>
  <main class="contact-page">
    <section class="section">
      <div class="container contact-inner">
        <div class="section-head is-center">
          <p class="eyebrow">Get in touch</p>
          <h1 class="h-title">Contact us</h1>
          <p>We would love to hear from you — questions, orders, or anything else.</p>
        </div>
        <ContactForm />
      </div>
    </section>
  </main>
</template>

<script setup>
import ContactForm from '@/components/ui/ContactForm.vue'
</script>

<style scoped>
.contact-page { padding-top: var(--nav-height); }
.contact-inner { max-width: 620px; }
</style>
