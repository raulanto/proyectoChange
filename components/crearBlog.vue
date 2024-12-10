<script setup lang="ts">

import {Button} from '@/components/ui/button'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'
import Editor from 'primevue/editor';
const { toast } = useToast()
import Select from 'primevue/select';

const router = useRouter()


import {toTypedSchema} from '@vee-validate/zod'
import {useForm} from 'vee-validate'
import * as z from 'zod'
const error=ref()
const apiError = ref<string | null>(null)

const formSchema = toTypedSchema(
    z.object({
        titulo: z
            .string()
            .min(1, 'El título es obligatorio')
            .max(200, 'El título no puede exceder 200 caracteres'),
        contenido: z
            .string()
            .min(1, 'El contenido no puede estar vacío'),
        imagen: z
            .any()
            .optional()
            .nullable(),
        publicado: z.any(),
        etiquetas: z.any(),
    })
);

const {isFieldDirty, handleSubmit} = useForm({
    validationSchema: formSchema,
})
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const apiUrl = useRuntimeConfig().public.apiKey;
const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    const obtenerIds = (datos) => datos.map((item) => item.id);
    console.log(values.publicado.value.code);

    const ids = obtenerIds(values.etiquetas.value);
    console.log(ids);

    try {
        const { data: crearData, error } = await useFetch(`${apiUrl}/api/v1/post/registro/`, {
            method: 'POST',
            body: {
                titulo: values.titulo,
                contenido: values.contenido,
                autor: authStore.user.id,
                imagen: values.imagen,
                etiquetas: ids,
                publicado: values.publicado.value.code,
            },
        });

        if (!crearData.value) {
            throw new Error('No se recibió una respuesta válida del servidor.');
        }

        console.log(crearData.value.id);
        toast({
            title: 'Publicación Creada',
        });
        router.push(`/post/mostrar/${crearData.value.id}`);
    } catch (error) {
        console.error('Error en la solicitud:', error);
        toast({
            title:"El titulo ya existe",
        });
        // Manejo de errores específicos
        if (error.data) {
            console.error('Detalles del error:', error.data);
        }

        apiError.value = 'Error de conexión con el servidor.';
    }
});



definePageMeta({
    layout: 'cusmtom',
})

const valor=ref()

const valor2=ref()


const {data: postData, refresh,status} = useAsyncData('fetch-cita', () =>
    $fetch(`${apiUrl}/api/v1/etiqueta/`, {
    })
)

const cities = ref([
    { name: 'Para publico en general', code: true },
    { name: 'Solo para autor', code: false },
]);


</script>


<template>
    <h1 class="text-center text-gray-950 font-bold text-xl">Creacion de Publicacion</h1>
    <form class="space-y-6 px-64" @submit="onSubmit">
        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="titulo">
            <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                    <Input class="w-full" placeholder="Título del post" type="text" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                    Ingresa un título único para el post (máximo 200 caracteres).
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="contenido">
            <FormItem>
                <FormLabel>Contenido</FormLabel>
                <FormControl>
                    <Editor editorStyle="height: 320px" v-bind="componentField" />
                </FormControl>
                <FormDescription>
                    Escribe el contenido del post.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

<!--        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="imagen">-->
<!--            <FormItem>-->
<!--                <FormLabel>Imagen Destacada</FormLabel>-->
<!--                <FormControl>-->
<!--                    <Input class="w-full" type="file" v-bind="componentField" />-->
<!--                </FormControl>-->
<!--                <FormDescription>-->
<!--                    Sube una imagen destacada para el post (opcional).-->
<!--                </FormDescription>-->
<!--                <FormMessage />-->
<!--            </FormItem>-->
<!--        </FormField>-->

        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="publicado">
            <FormItem>
                <FormLabel>Publicado</FormLabel>
                <FormControl >
                    <Select v-bind="componentField" v-model="valor2" :options="cities" optionLabel="name" placeholder="Select a City" size="small" class="w-full md:w-56" />
                </FormControl>
                <FormDescription>
                    Indica si el post debe estar publicado inmediatamente.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" :validate-on-blur="!isFieldDirty" name="etiquetas">
            <FormItem>
                <FormLabel>Etiquetas</FormLabel>
                <FormControl>
                    <MultiSelect v-bind="componentField" v-model="valor" :options="postData.results" optionLabel="nombre" :maxSelectedLabels="3" class="w-full md:w-80" placeholder="Normal" />
                </FormControl>
                <FormDescription>
                    Selecciona las etiquetas asociadas al post.
                </FormDescription>
                <FormMessage />
            </FormItem>
        </FormField>

        <Button type="submit" class="w-full">
            Registrar Post
        </Button>

    </form>

    {{valor2}}
</template>

