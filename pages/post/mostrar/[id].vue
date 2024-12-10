<script setup lang="ts">
definePageMeta({
    layout: 'panel',

})
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth'
import {Button} from '@/components/ui/button'
const authStore = useAuthStore()
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const apiUrl = useRuntimeConfig().public.apiKey;
const route = useRoute();
const id = route.params.id;

const {data: posdata, error, refresh,status} = useAsyncData('fetch-publi', () =>
    $fetch(`${apiUrl}/api/v1/post/${id}/`, {
        headers: {
            Authorization: `Token ${authStore.token}`
        }
    })
)

import dayjs from "dayjs";

const handlePostAction = async (postId) => {
    try {
        const { data, error } = await useFetch(`${apiUrl}api/v1/puntuacion/registro/`, {
            method: 'POST',
            headers: {
                Authorization: `Token ${authStore.token}`
            },
            body: {
                post: postId,
                usuario: authStore.user.id,
                puntuacion: 1,
            },
        })

        if (error.value) {
            console.error('Error en el registro del post:', error.value)
            toast({
                title: 'Error',
                description: 'No se pudo agregar la puntuación.',
                variant: 'destructive',
            })
            return
        }

        // Si la solicitud fue exitosa
        console.log(data.value)
        toast({
            title: '¡Puntuación añadida!',
            description: `Has puntuado la publicación ${postId}.`,
        })
    } catch (error) {
        console.error('Error en la solicitud:', error)
        toast({
            title: 'Error de conexión',
            description: 'No se pudo conectar con el servidor.',
            variant: 'destructive',
        })
    }
}
watch(route, () => {
    refresh()
})

</script>

<template>
    <main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased">
        <div class="flex justify-between px-4 mx-auto max-w-screen-xl">
            <article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                <header v-if="posdata" class="mb-4 lg:mb-6 not-format">
                    <address class="flex items-center mb-6 not-italic">
                        <div class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                            <img class="mr-4 w-16 h-16 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.jpg" alt="Jese Leos">
                            <div>
                                <a href="#" rel="author" class="text-xl font-bold text-gray-900 dark:text-white">{{ authStore.user.firstName }}</a>
                                <p class="text-base text-gray-500 dark:text-gray-400"><time pubdate datetime="2022-02-08" title="February 8th, 2022"></time></p>
                            </div>
                        </div>
                    </address>
                    <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
                        {{ posdata.titulo }}</h1>

                </header>

                <div v-if="posdata" v-html="posdata.contenido"></div>
                <p v-else class="text-center text-gray-500 dark:text-gray-400">Cargando datos...</p>
            </article>
        </div>
    </main>
</template>


<style scoped>

</style>