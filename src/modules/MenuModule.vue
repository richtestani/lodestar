<template>
  <section class="section section--surface">
    <div class="container menu-wrap">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <div class="menu-groups">
        <div v-for="(group, gi) in groups" :key="gi" class="menu-group">
          <h3 class="menu-group-name">{{ group.name }}</h3>
          <ul>
            <li v-for="(item, ii) in group.items" :key="ii" class="menu-item">
              <div class="menu-item-head">
                <span class="menu-item-name">{{ item.name }}</span>
                <span class="menu-dots" aria-hidden="true"></span>
                <span class="menu-item-price">{{ item.price }}</span>
              </div>
              <p v-if="item.desc" class="menu-item-desc">{{ item.desc }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ eyebrow: String, title: { type: String, default: '' }, groups: { type: Array, default: () => [] } })
</script>

<style scoped>
.menu-wrap { max-width: 860px; }
.menu-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem 3.5rem; }
.menu-group-name { font-size: 0.74rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--primary); margin-bottom: 1.25rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }
.menu-group ul { list-style: none; display: flex; flex-direction: column; gap: 1.1rem; }
.menu-item-head { display: flex; align-items: baseline; gap: 0.5rem; }
.menu-item-name { font-family: var(--font-display); font-weight: 600; font-size: 1.02rem; }
.menu-dots { flex: 1; border-bottom: 1px dotted var(--border); transform: translateY(-3px); }
.menu-item-price { color: var(--primary); font-weight: 600; }
.menu-item-desc { font-size: 0.86rem; color: var(--text-muted); margin-top: 0.2rem; line-height: 1.5; }
@media (max-width: 700px) { .menu-groups { grid-template-columns: 1fr; } }
</style>
