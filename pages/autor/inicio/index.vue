<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
const authStore = useAuthStore()
const router = useRouter()
import {toTypedSchema} from '@vee-validate/zod'
import {useForm} from 'vee-validate'

import * as z from 'zod'
import { useAuthStore } from '~/stores/auth'
definePageMeta({
    layout: 'cusmtom',

})
const error=ref()
const apiError = ref<string | null>(null)

const formSchema = toTypedSchema(z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(16),
}))

const {isFieldDirty, handleSubmit} = useForm({
    validationSchema: formSchema,
})
const apiUrl = useRuntimeConfig().public.apiKey;
const onSubmit = handleSubmit(async (values) => {
    console.log(values)
    try {
        const { data, error } = await useFetch(`${apiUrl}api-token-auth/`, {
            method: 'POST',
            body: {
                username: values.username,
                password: values.password
            }
        })

        if (data.value && data.value.token) {
            authStore.setToken(data.value.token)
            authStore.setUser({
                id: data.value.user_id,
                email: data.value.email,
                firstName: data.value.first_name
            })
            // Redirigir a la página principal u otra página protegida
            await router.push('/panel/')
        } else if (error.value) {
            // Verifica si existen `non_field_errors` en la respuesta
            if (error.value.data?.non_field_errors) {
                console.error('Error de credenciales:', error.value.data.non_field_errors[0])
                apiError.value = error.value.data.non_field_errors[0]

            } else {
                console.error('Error:', error.value)
                apiError.value = 'Ocurrió un error inesperado.'
            }
        }
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error)
        apiError.value = 'Error de conexión con el servidor.'
    }
})

</script>

<template>
    <Toaster />
    <div class="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <div class="mx-auto grid w-[350px] gap-6">
                <div class="grid gap-2 text-center">
                    <h1 class="text-2xl font-bold">
                        Inicio de sesión
                    </h1>
                    <p class="text-balance text-muted-foreground">
                        Ingrese su Usuario y contraseña
                    </p>
                </div>
                <div class="grid gap-4">
                    <form class=" space-y-6" @submit="onSubmit">
                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="username">
                            <FormItem>
                                <FormLabel>Usuario</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="usuario" type="text" v-bind="componentField"/>
                                </FormControl>
                                <FormDescription>
                                    Ingresa nombre de usuario
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>

                        </FormField>
                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="password">
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="contraseña" type="password" v-bind="componentField"/>
                                </FormControl>

                                <FormMessage/>
                            </FormItem>

                        </FormField>
                        <Button type="submit" class="w-full">
                            Entrar
                        </Button>
                    </form>
                    <div class="text-red-500">
                        {{apiError}}
                    </div>
                </div>
                <NuxtLink to=/autor/inicio/registro>
                    <Button variant="outline"  class="w-full">
                        Registro
                    </Button>

                </NuxtLink>
            </div>

        </div>
        <div class="hidden bg-muted lg:block">
            <img
                src="~/assets/fondo12%201.svg"
                alt="Image"
                width="1920"
                height="1080"
                class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            >
        </div>
    </div>
</template>