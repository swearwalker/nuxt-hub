<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: ['auth'],
})

const supabase = useSupabaseClient()

const isNewUser = ref(false)

const signInWithOAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}

const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) displayError(error)
}

const signUp = async (email: string, password: string) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) displayError(error)
  else {
    toast.add({
      title: 'Sign up successful',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    await signIn(email, password)
  }
}

const displayError = ({ message }: { message: string }) => {
  toast.add({
    title: 'Error',
    description: message,
    icon: 'i-lucide-alert-circle',
    color: 'error',
  })
}

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { email, password } = event.data
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)

  if (isNewUser.value) await signIn(email, password)
  else await signUp(email, password)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <USwitch
      v-model="isNewUser"
      label="Auth type"
      description="Switch auth type between sign-in and sign-up"
    />
    <p>{{ isNewUser }}</p>
    <UForm
      :schema="schema"
      :state="state"
      class="flex flex-col items-center gap-2"
      @submit="onSubmit"
    >
      <h1 class="text-primary-500 text-lg font-semibold">
        {{ isNewUser ? 'Sign Up' : 'Sign In' }}
      </h1>
      <UFormField label="Email" name="email" class="w-full">
        <UInput v-model="state.email" class="w-full" />
      </UFormField>
      <UFormField label="Password" name="password" class="w-full">
        <UInput v-model="state.password" type="password" class="w-full" />
      </UFormField>
      <UButton type="submit"> Submit </UButton>
    </UForm>
    <USeparator />
    <div class="flex flex-col items-center justify-center gap-2">
      <p class="text-sm text-neutral-500">Or sign in using social networks</p>
      <UButtonGroup>
        <UButton icon="mdi:google" @click="signInWithOAuth" />
      </UButtonGroup>
    </div>
  </div>
</template>

<style scoped></style>
