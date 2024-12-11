<script lang="ts" setup>
import {useAuthStore} from '~/stores/auth'
import {Button} from '@/components/ui/button'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {useToast} from '@/components/ui/toast/use-toast'
import {toTypedSchema} from '@vee-validate/zod'
import {useForm} from 'vee-validate'
import * as z from 'zod'
import {Textarea} from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const {toast} = useToast()
definePageMeta({
    layout: 'panel',
});
const authStore = useAuthStore()
const router = useRouter()
const apiUrl = useRuntimeConfig().public.apiKey
const apiError = ref<string | null>(null)
// Esquema de validación
const formSchema = toTypedSchema(
    z.object({
        nombre: z
            .string()
            .min(3, "El nombre del ejercicio debe tener al menos 3 caracteres.")
            .max(100, "El nombre del ejercicio no puede exceder 100 caracteres.")
            .describe("Nombre del ejercicio."),
        descripcion: z
            .string()
            .optional(),

        duracion: z
            .number()
            .min(1, "La duración debe ser al menos 1 minuto.")
            .max(300, "La duración no puede exceder 300 minutos."),
        repeticiones: z
            .number()
            .min(1, "Debe haber al menos 1 repetición.")
            .max(100, "Las repeticiones no pueden exceder 100."),
        nivel_dificultad: z
            .string()
            .refine((val) => ["básico", "intermedio", "avanzado"].includes(val), "Nivel de dificultad inválido."),
        grupo_muscular: z
            .string()
            .refine((val) => ["piernas", "brazos", "espalda", "pecho", "core", "completo"].includes(val), "Grupo muscular inválido."),
    })
)

const {isFieldDirty, handleSubmit} = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
    console.log(values);

    try {
        const { data, error } = await useFetch(`${apiUrl}api/v1/ejercicio/registro/`, {
            method: 'POST',
            headers: {
                Authorization: `Token ${authStore.token}`,
            },
            body: JSON.stringify({
                autor: authStore.user.id,
                nombre: values.nombre,
                descripcion: values.descripcion,
                duracion: values.duracion,
                repeticiones: values.repeticiones,
                nivel_dificultad: values.nivel_dificultad,
                grupo_muscular: values.grupo_muscular,
            }),
        });
        console.log(error)
        console.log(data)
        toast({
            title: 'Ejercicio Cread',
        })
        router.push('/rutina/ejercicios/')
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error)
        apiError.value = 'Error de conexión con el servidor.'
    }
})

</script>

<template>
    <h1 class="text-center text-gray-950 font-bold text-xl">Crear Ejercicio</h1>
    <form class="space-y-6 px-64" @submit="onSubmit">
        <FormField name="nombre" :validate-on-blur="!isFieldDirty" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Nombre del Ejercicio</FormLabel>
                <FormControl>
                    <Input v-bind="componentField" placeholder="Ejemplo: Sentadilla" />
                </FormControl>
                <FormDescription>Ingresa un nombre descriptivo para el ejercicio.</FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="descripcion" :validate-on-blur="!isFieldDirty" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                    <Textarea v-bind="componentField" placeholder="Describe brevemente el ejercicio." rows="4" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="duracion" :validate-on-blur="!isFieldDirty" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Duración (en minutos)</FormLabel>
                <FormControl>
                    <Input type="number" v-bind="componentField" placeholder="Duración en minutos" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="repeticiones" :validate-on-blur="!isFieldDirty" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Repeticiones</FormLabel>
                <FormControl>
                    <Input type="number" v-bind="componentField" placeholder="Cantidad de repeticiones" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="nivel_dificultad" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Nivel de Dificultad</FormLabel>
                <FormControl>
                    <Select v-bind="componentField">
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona nivel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="básico">Básico</SelectItem>
                                <SelectItem value="intermedio">Intermedio</SelectItem>
                                <SelectItem value="avanzado">Avanzado</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField name="grupo_muscular" v-slot="{ componentField }">
            <FormItem>
                <FormLabel>Grupo Muscular</FormLabel>
                <FormControl>
                    <Select v-bind="componentField">
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona grupo muscular" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="piernas">Piernas</SelectItem>
                                <SelectItem value="brazos">Brazos</SelectItem>
                                <SelectItem value="espalda">Espalda</SelectItem>
                                <SelectItem value="pecho">Pecho</SelectItem>
                                <SelectItem value="core">Core</SelectItem>
                                <SelectItem value="completo">Cuerpo completo</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button class="w-full" type="submit">Registrar Ejercicio</Button>
    </form>
</template>
