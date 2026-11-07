<template>
  <div class="cf">
    <template v-if="!submitted">
      <form class="cf-form" @submit.prevent="handleSubmit">
        <div
          v-for="f in list" :key="f.name"
          class="cf-row" :class="{ 'is-half': f.half, 'is-check': f.type === 'checkbox' }"
        >
          <label v-if="f.type === 'checkbox'" class="cf-check">
            <input :id="id(f)" v-model="form[f.name]" type="checkbox" :name="f.name" :required="f.required" />
            <span>{{ f.label }}</span>
          </label>
          <template v-else>
            <label :for="id(f)">{{ f.label }}<span v-if="!f.required && showOptional" class="cf-opt"> (optional)</span></label>
            <textarea
              v-if="f.type === 'textarea'"
              :id="id(f)" v-model="form[f.name]" :name="f.name"
              :rows="f.rows || 5" :placeholder="f.placeholder" :required="f.required"
            ></textarea>
            <select
              v-else-if="f.type === 'select'"
              :id="id(f)" v-model="form[f.name]" :name="f.name" :required="f.required"
            >
              <option value="" disabled>{{ f.placeholder || 'Choose one…' }}</option>
              <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
            </select>
            <input
              v-else
              :id="id(f)" v-model="form[f.name]" :name="f.name" :type="f.type"
              :placeholder="f.placeholder" :required="f.required" :autocomplete="f.autocomplete"
              :min="f.min" :max="f.max"
            />
          </template>
        </div>

        <!-- Honeypot: hidden from people, irresistible to bots. If it's filled,
             the submit is silently dropped. Formspree also auto-discards on _gotcha. -->
        <input
          v-model="honeypot" type="text" name="_gotcha"
          class="cf-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />

        <p v-if="error" class="cf-error">{{ error }}</p>
        <button type="submit" class="btn cf-submit" :disabled="sending">{{ sending ? 'Sending…' : submitLabel }}</button>
        <p v-if="!url" class="cf-hint">Add your Formspree endpoint in <code>config/site.js</code> → <code>contact.formspree</code> (or this form's own <code>endpoint</code>) to enable sending.</p>
      </form>
    </template>
    <template v-else>
      <div class="cf-done">
        <p class="eyebrow">{{ done.eyebrow }}</p>
        <h3 class="h-sub">{{ done.title }}</h3>
        <p class="muted">{{ done.text }}</p>
      </div>
    </template>
  </div>
</template>

<script setup>
// The form behind the 'contact' view and the `contact` module. With no
// props it's the original name / email / message form. Pass `fields` to
// turn it into any other form — booking inquiries, quote requests,
// catering orders — without a new view:
//
//   fields: [
//     { name: 'name',  label: 'Name',  type: 'text',  required: true, half: true },
//     { name: 'date',  label: 'Date',  type: 'date',  half: true },
//     { name: 'type',  label: 'Event type', type: 'select', options: ['Bar', 'Private'] },
//     { name: 'notes', label: 'Details', type: 'textarea', rows: 4 },
//   ]
//
// types: text · email · tel · date · time · number · url · select · textarea · checkbox
// per field: name (required — the key sent to Formspree), label, required,
//   placeholder, half (two-up on wide screens), rows (textarea), options
//   (select: strings or { label, value }), min/max, autocomplete, value (initial).
//
// Keep a field named `email` — Formspree uses it as the reply-to address.
import { computed, reactive, ref, useId } from 'vue'
import { site } from '@/site.config.js'

const DEFAULT_FIELDS = [
  { name: 'name',    label: 'Name',    type: 'text',     placeholder: 'Your name',        required: true, autocomplete: 'name' },
  { name: 'email',   label: 'Email',   type: 'email',    placeholder: 'you@email.com',    required: true, autocomplete: 'email' },
  { name: 'message', label: 'Message', type: 'textarea', placeholder: 'How can we help?', required: true },
]
const DEFAULT_SUCCESS = { eyebrow: 'Message sent', title: 'Thank you', text: 'We received your message and will be in touch soon.' }

const props = defineProps({
  fields:      { type: Array,  default: () => [] },   // empty → the default contact fields
  endpoint:    { type: String, default: '' },         // empty → site.contact.formspree
  subject:     { type: String, default: '' },         // sent as Formspree's _subject (email subject line)
  submitLabel: { type: String, default: 'Send message' },
  success:     { type: Object, default: () => ({}) },  // { eyebrow, title, text } — omitted keys keep the default
})

const uid = useId()
const url = computed(() => props.endpoint || site.contact?.formspree || '')
const done = computed(() => ({ ...DEFAULT_SUCCESS, ...props.success }))

const list = computed(() => (props.fields.length ? props.fields : DEFAULT_FIELDS).map(f => ({
  type: 'text', ...f,
  options: (f.options || []).map(o => (typeof o === 'object' ? o : { label: o, value: o })),
})))
// Only mark "(optional)" on custom forms — the default form is all-required anyway.
const showOptional = computed(() => props.fields.length > 0)

const blank = f => (f.value !== undefined ? f.value : f.type === 'checkbox' ? false : '')
const form = reactive(Object.fromEntries(list.value.map(f => [f.name, blank(f)])))
const id = f => `cf-${uid}-${f.name}`

const submitted = ref(false)
const sending   = ref(false)
const error     = ref('')
const honeypot  = ref('')

async function handleSubmit() {
  error.value = ''
  // Bot trap: a real user never fills this. Fake success so the bot moves on.
  if (honeypot.value) { submitted.value = true; return }
  if (!url.value) { error.value = 'No form endpoint configured yet.'; return }
  sending.value = true
  const payload = {}
  for (const f of list.value) {
    const v = form[f.name]
    payload[f.name] = f.type === 'checkbox' ? (v ? 'Yes' : 'No') : v
  }
  if (props.subject) payload._subject = props.subject
  payload._gotcha = honeypot.value
  try {
    const res = await fetch(url.value, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) submitted.value = true
    else {
      const data = await res.json().catch(() => ({}))
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
.cf-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem 1rem; }
.cf-row { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 0.4rem; text-align: left; min-width: 0; }
@media (min-width: 560px) { .cf-row.is-half { grid-column: span 1; } }
.cf-row > label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--primary); }
.cf-opt { text-transform: none; letter-spacing: 0; font-weight: 400; color: var(--text-muted); }
.cf-row input, .cf-row textarea, .cf-row select {
  width: 100%; padding: 0.7rem 0.85rem; border-radius: var(--radius);
  background: var(--bg); color: var(--text); border: 1px solid var(--border);
  font-family: var(--font-body); font-size: 1rem; outline: none; transition: border-color 0.2s;
}
.cf-row input:focus, .cf-row textarea:focus, .cf-row select:focus { border-color: var(--primary); }
.cf-row input:not([type=checkbox]), .cf-row select { height: 2.7rem; line-height: 1.2; }
.cf-row textarea { resize: vertical; min-height: 120px; }
.cf-check { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.95rem; color: var(--text); cursor: pointer; }
.cf-row .cf-check input { width: auto; margin-top: 0.2rem; padding: 0; accent-color: var(--primary); }
.cf-submit { grid-column: 1 / -1; justify-self: start; margin-top: 0.4rem; }
.cf-error, .cf-hint { grid-column: 1 / -1; }
.cf-error { color: #d24545; font-size: 0.85rem; }
.cf-hint { font-size: 0.78rem; color: var(--text-muted); }
.cf-hint code { background: var(--surface); padding: 1px 5px; border-radius: 4px; }
.cf-done { text-align: center; padding: 2rem 0; }
.cf-done .h-sub { margin: 0.6rem 0; }

/* Honeypot — kept in the layout but off-screen (display:none gets skipped by some bots). */
.cf-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
</style>
