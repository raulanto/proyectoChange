<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
const { toast } = useToast()
const router = useRouter()

import {toTypedSchema} from '@vee-validate/zod'
import {useForm} from 'vee-validate'
import {h} from 'vue'
import * as z from 'zod'

definePageMeta({
    layout: 'cusmtom',

})
const error=ref()
const apiError = ref<string | null>(null)

const formSchema = toTypedSchema(
    z.object({
        usuario: z.object({
            username: z.string().min(2, 'El nombre de usuario debe tener al menos 2 caracteres').max(16, 'El nombre de usuario no puede exceder 16 caracteres'),
            password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(16, 'La contraseña no puede exceder 16 caracteres'),
            first_name: z.string().min(1, 'El nombre es obligatorio').max(50, 'El nombre no puede exceder 50 caracteres'),
            last_name: z.string().min(1, 'El apellido es obligatorio').max(50, 'El apellido no puede exceder 50 caracteres'),
            email: z.string().email('Debe ser un correo electrónico válido'),
        }),
        telefono: z.string().optional().nullable(),
        ciudad: z.string().min(1, 'La ciudad es obligatoria').max(100, 'La ciudad no puede exceder 100 caracteres'),
        edad: z.number().int('La edad debe ser un número entero positivo').positive('La edad debe ser mayor a 0'),
        foto_cedula: z.any().optional().nullable(),
    })
);
const {isFieldDirty, handleSubmit} = useForm({
    validationSchema: formSchema,
})
const apiUrl = useRuntimeConfig().public.apiKey;
const onSubmit = handleSubmit(async (values) => {
    console.log(values)
    try {
        const { data, error } = await useFetch(`${apiUrl}/api/v1/trabajador/registro/`, {
            method: 'POST',

            body: {
                ciudad:values.ciudad,
                edad:values.edad,
                telefono:values.telefono,
                foto_cedula:values.foto_cedula,
                usuario:values.usuario
            }
        })
        console.log(error)
        router.push('/autor/inicio/')
        toast({
            title: 'Ceunta Creada Correctamente',
            description: 'Ingrese a la cuenta'
        })
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error)
        apiError.value = 'Error de conexión con el servidor.'
    }
})

</script>

<template>


    <div class="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <div class=" grid w-96 gap-6">
                <div class="grid gap-2 text-center">
                    <h1 class="text-2xl font-bold">
                        Inicio de sesión
                    </h1>
                    <p class="text-balance text-muted-foreground">
                        Ingrese su Usuario y contraseña
                    </p>
                </div>
                <div class="grid gap-2">
                    <form class="space-y-4" @submit="onSubmit">
                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="usuario.username">
                            <FormItem>
                                <FormLabel>Usuario</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Usuario" type="text" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa el nombre de usuario.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="usuario.password">
                            <FormItem>
                                <FormLabel>Contraseña</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Contraseña" type="password" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa la contraseña (8-16 caracteres).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="usuario.first_name">
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Nombre" type="text" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa el primer nombre del usuario.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="usuario.last_name">
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Apellido" type="text" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa el apellido del usuario.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="usuario.email">
                            <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Correo Electrónico" type="email" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa un correo electrónico válido.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="telefono">
                            <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Teléfono" type="text" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa un número de teléfono (7-15 dígitos).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="ciudad">
                            <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Ciudad" type="text" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa el nombre de la ciudad.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="edad">
                            <FormItem>
                                <FormLabel>Edad</FormLabel>
                                <FormControl>
                                    <Input class="w-full" placeholder="Edad" type="number" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Ingresa la edad del usuario.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="foto_cedula">
                            <FormItem>
                                <FormLabel>Foto de la Cédula</FormLabel>
                                <FormControl>
                                    <Input class="w-full" type="file" v-bind="componentField" />
                                </FormControl>
                                <FormDescription>
                                    Sube una imagen de la cédula.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        </FormField>



                        <Button type="submit" class="w-full">
                            Registrar
                        </Button>
                    </form>
                    <div class="text-red-500">
                        {{apiError}}
                    </div>
                </div>
                <NuxtLink to="/autor/inicio">
                    <Button variant="outline" class="w-full">
                        Iniciar
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

<style scoped>

</style>