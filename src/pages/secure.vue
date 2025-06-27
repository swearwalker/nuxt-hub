<script setup lang="ts">
const { t } = useI18n()

const supabase = useSupabaseClient()

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.log(error)
  navigateTo('/auth')
}
</script>

<template>
  <main class="main">
    <UContainer>
      <h1>Hi Index! {{ t('title') }}</h1>
      <button type="button" @click="signOut">Log Out</button>
    </UContainer>
  </main>
</template>

<style scoped></style>
