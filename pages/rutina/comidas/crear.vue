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
import {Slider} from '@/components/ui/slider'
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

const router = useRouter()


const error = ref()
const apiError = ref<string | null>(null)

const formSchema = toTypedSchema(
    z.object({
        nombre_comida: z
            .string()
            .min(3, "El nombre de la comida debe tener al menos 3 caracteres.")
            .max(100, "El nombre de la comida no puede exceder 100 caracteres.")
            .describe("Nombre de la comida."),
        descripcion: z
            .string()
            .min(10, "La descripción debe tener al menos 10 caracteres.")
            .max(500, "La descripción no puede exceder 500 caracteres.")
            .optional()
            .describe("Descripción opcional."),
        horario: z
            .string()
            .nullable()
            .optional()
            .describe("El horario es opcional y puede ser nulo."),
        calorias: z.array(
            z.number().min(10).max(1000),
        ),
        proteinas: z.array(
            z.number().min(10).max(1000),
        ),
        carbohidratos: z.array(
            z.number().min(10).max(1000),
        ),
        grasas: z.array(
            z.number().min(10).max(1000),
        ),
        nivel_importancia: z
            .string()
    })
)
const {isFieldDirty, handleSubmit} = useForm({
    validationSchema: formSchema,
})
const authStore = useAuthStore()
const apiUrl = useRuntimeConfig().public.apiKey;
const onSubmit = handleSubmit(async (values) => {
    console.log(values)

    try {
        const {data, error} = await useFetch(`${apiUrl}api/v1/alimentacion/registro/`, {
            method: 'POST',
            headers: {
                Authorization: `Token ${authStore.token}`
            },
            body: {
                autor: authStore.user.id,
                nombre_comida: values.nombre_comida,
                descripcion: values.descripcion,
                horario: values.horario,
                calorias: values.calorias[0],
                proteinas: values.proteinas[0],
                carbohidratos: values.carbohidratos[0],
                grasas: values.grasas[0],
                nivel_importancia: values.nivel_importancia

            }
        })
        console.log(error)
        console.log(data)
        toast({
            title: 'Publicacion Creada',

        })
    } catch (error) {
        console.error('Error en la solicitud de inicio de sesión:', error)
        apiError.value = 'Error de conexión con el servidor.'
    }
})


definePageMeta({
    layout: 'panel',

})

const valor = ref()

const valor2 = ref()
const value = ref()
const value2 = ref()
const value3 = ref()
const value4 = ref()
const value5 = ref()

const cities = ref([
    {name: 'Para publico en general', code: true},
    {name: 'Solo para autor', code: false},
]);
</script>


<template>
    <h1 class="text-center text-gray-950 font-bold text-xl">Creacion de Comida</h1>
    <form class="space-y-6 px-64" @submit="onSubmit">
        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="nombre_comida">
            <FormItem>
                <FormLabel>Nombre de la comida</FormLabel>
                <FormControl>
                    <Input
                        class="w-full"
                        placeholder="Ejemplo: Ensalada César"
                        type="text"
                        v-bind="componentField"
                    />
                </FormControl>
                <FormDescription>
                    Ingresa el nombre del platillo (mínimo 3 caracteres, máximo 100).
                </FormDescription>
                <FormMessage/>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="descripcion">
            <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
        <Textarea
            class="w-full"
            placeholder="Describe brevemente el platillo"
            rows="4"
            v-bind="componentField"
        />
                </FormControl>
                <FormDescription>
                    Proporciona una descripción opcional para el platillo.
                </FormDescription>
                <FormMessage/>
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="horario">
            <FormItem>
                <FormLabel>Horario</FormLabel>
                <FormControl>
                    <Input
                        class="w-full"
                        placeholder="Ejemplo: Desayuno, Almuerzo, Cena"
                        type="time"
                        v-bind="componentField"
                    />
                </FormControl>
                <FormDescription>
                    Indica el horario en el que se consume el platillo (opcional).
                </FormDescription>
                <FormMessage/>
            </FormItem>
        </FormField>

        <div class="px-14">
            <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="calorias">
                <FormItem>
                    <FormLabel>Calorías</FormLabel>
                    <FormControl>
                        <Slider
                            v-model="value"
                            :default-value="[30]"
                            :max="1000"
                            :min="0"
                            :step="10"
                            v-bind="componentField"
                        />
                        <FormDescription class="flex justify-between">
                            <span>Ingresa la calorias</span>
                            <span>{{ value?.[0] }} kcal</span>
                        </FormDescription>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="proteinas">
                <FormItem>
                    <FormLabel>Proteínas</FormLabel>
                    <FormControl>
                        <Slider
                            v-model="value2"
                            :default-value="[30]"
                            :max="1000"
                            :min="0"
                            :step="10"
                            v-bind="componentField"
                        />
                        <FormDescription class="flex justify-between">
                            <span> Ingresa la cantidad de proteínas en gramos (opcional).</span>
                            <span>{{ value2?.[0] }} g</span>
                        </FormDescription>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="carbohidratos">
                <FormItem>
                    <FormLabel>Carbohidratos</FormLabel>
                    <FormControl>
                        <Slider
                            v-model="value3"
                            :default-value="[30]"
                            :max="1000"
                            :min="0"
                            :step="10"
                            v-bind="componentField"
                        />
                        <FormDescription class="flex justify-between">
                            <span> Ingresa la cantidad de carbohidratos en gramos (opcional).</span>
                            <span>{{ value3?.[0] }} g</span>
                        </FormDescription>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="grasas">
                <FormItem>
                    <FormLabel>Grasas</FormLabel>
                    <FormControl>
                        <Slider
                            v-model="value4"
                            :default-value="[30]"
                            :max="1000"
                            :min="0"
                            :step="10"
                            v-bind="componentField"
                        />
                        <FormDescription class="flex justify-between">
                            <span>Ingresa la cantidad de grasas en gramos (opcional)..</span>
                            <span>{{ value4?.[0] }} g</span>
                        </FormDescription>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            </FormField>
        </div>


        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="nivel_importancia">
            <FormItem>
                <FormLabel>Nivel de Importancia</FormLabel>
                <FormControl>
<!--                    <Select-->
<!--                        v-model="nivelImportancia"-->
<!--                        :options="[-->
<!--            { value: 1, label: 'Baja' },-->
<!--            { value: 2, label: 'Media Baja' },-->
<!--            { value: 3, label: 'Media' },-->
<!--            { value: 4, label: 'Alta' },-->
<!--            { value: 5, label: 'Muy Alta' },-->
<!--          ]"-->
<!--                        class="w-full"-->
<!--                        placeholder="Selecciona nivel"-->
<!--                        v-bind="componentField"-->
<!--                    />-->
                    <Select v-bind="componentField" v-model="valor5">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="baja">
                                    Baja
                                </SelectItem>
                                <SelectItem value="media">
                                    Media
                                </SelectItem>
                                <SelectItem value="alta">
                                    alta
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormDescription>
                    Selecciona un nivel de importancia.
                </FormDescription>
                <FormMessage/>
            </FormItem>
        </FormField>
        <Button class="w-full" type="submit">
            Registrar
        </Button>
    </form>
</template>

