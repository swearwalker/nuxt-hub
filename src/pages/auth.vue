<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  layout: 'auth',
  middleware: ['auth'],
})

const supabase = useSupabaseClient()

const sign = ref<'in' | 'up'>('in')

const items = [
  { label: 'Sign In', value: 'in' },
  { label: 'Sign Up', value: 'up' },
]

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

  if (sign.value === 'in') await signIn(email, password)
  else await signUp(email, password)
}

// const signOut = async () => {
//   const { error } = await supabase.auth.signOut()
//   if (error) console.log(error)
// }
</script>

<template>
  <div>
    <USelect v-model="sign" :items="items" class="w-48" />
    <p>{{ sign }}</p>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>

      <UButton type="submit"> Submit </UButton>
    </UForm>
    <button type="button" class="login-with-google-btn" @click="signInWithOAuth">
      Sign in with Google
    </button>
  </div>
</template>

<style scoped>
.login-with-google-btn {
  transition:
    background-color 0.3s,
    box-shadow 0.3s;

  padding: 12px 16px 12px 42px;
  border: none;
  border-radius: 3px;
  box-shadow:
    0 -1px 0 rgba(0, 0, 0, 0.04),
    0 1px 1px rgba(0, 0, 0, 0.25);

  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;

  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px 11px;

  &:hover {
    box-shadow:
      0 -1px 0 rgba(0, 0, 0, 0.04),
      0 2px 4px rgba(0, 0, 0, 0.25);
  }

  &:active {
    background-color: #eeeeee;
  }

  &:focus {
    outline: none;
    box-shadow:
      0 -1px 0 rgba(0, 0, 0, 0.04),
      0 2px 4px rgba(0, 0, 0, 0.25),
      0 0 0 3px #c8dafc;
  }

  &:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;
    box-shadow:
      0 -1px 0 rgba(0, 0, 0, 0.04),
      0 1px 1px rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
}

div {
  text-align: center;
  padding-top: 2rem;
}
</style>
