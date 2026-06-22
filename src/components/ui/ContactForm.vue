<template>
  <div class="cf">
    <template v-if="!submitted">
      <form class="cf-form" @submit.prevent="handleSubmit">
        <div class="cf-row">
          <label for="cf-name">Name</label>
          <input id="cf-name" v-model="form.name" type="text" placeholder="Your name" required />
        </div>
        <div class="cf-row">
          <label for="cf-email">Email</label>
          <input id="cf-email" v-model="form.email" type="email" placeholder="you@email.com" required />
        </div>
        <div class="cf-row">
          <label for="cf-message">Message</label>
          <textarea id="cf-message" v-model="form.message" rows="5" placeholder="How can we help?" required></textarea>
        </div>
        <p v-if="error" class="cf-error">{{ error }}</p>
        <button type="submit" class="btn cf-submit" :disabled="sending">{{ sending ? 'Sending…' : 'Send message' }}</button>
        <p v-if="!endpoint" class="cf-hint">Add your Formspree endpoint in <code>site.config.js</code> → <code>contact.formspree</code> to enable sending.</p>
      </form>
    </template>
    <template v-else>
      <div class="cf-done">
        <p class="eyebrow">Message sent</p>
        <h3 class="h-sub">Thank you</h3>
        <p class="muted">We received your message and will be in touch soon.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { site } from '@/site.config.js'

const endpoint  = site.contact.formspree
const submitted = ref(false)
const sending   = ref(false)
const error     = ref('')
const form = reactive({ name: '', email: '', message: '' })

async function handleSubmit() {
  error.value = ''
  if (!endpoint) { error.value = 'No form endpoint configured yet.'; return }
  sending.value = true
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...form }),
    })
    if (res.ok) submitted.value = true
    else {
      const data = await res.json()
      error.value = data?.errors?.[0]?.message || 'Something went wrong. Please try again.'
    }
  } catch {
    error.value = 'Unable to send. Check your connection and try again.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.cf-form { display: flex; flex-direction: column; gap: 1.1rem; }
.cf-row { display: flex; flex-direction: column; gap: 0.4rem; text-align: left; }
.cf-row label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--primary); }
.cf-row input, .cf-row textarea {
  width: 100%; padding: 0.7rem 0.85rem; border-radius: var(--radius);
  background: var(--bg); color: var(--text); border: 1px solid var(--border);
  font-family: var(--font-body); font-size: 1rem; outline: none; transition: border-color 0.2s;
}
.cf-row input:focus, .cf-row textarea:focus { border-color: var(--primary); }
.cf-row textarea { resize: vertical; min-height: 120px; }
.cf-submit { align-self: flex-start; margin-top: 0.4rem; }
.cf-error { color: #d24545; font-size: 0.85rem; }
.cf-hint { font-size: 0.78rem; color: var(--text-muted); }
.cf-hint code { background: var(--surface); padding: 1px 5px; border-radius: 4px; }
.cf-done { text-align: center; padding: 2rem 0; }
.cf-done .h-sub { margin: 0.6rem 0; }
</style>
