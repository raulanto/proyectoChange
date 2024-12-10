<script setup lang="ts">
definePageMeta({
    layout: 'panel',
})

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PlusCircle, MoreHorizontal } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

import { useToast } from '@/components/ui/toast/use-toast'
const authStore = useAuthStore()
const { toast } = useToast()
const { public: { apiKey: apiUrl } } = useRuntimeConfig()

const { data: postData, error, refresh, status } = useAsyncData('fetch-cita', () =>
    $fetch(`${apiUrl}/api/v1/post/?autor=${authStore.user.id}`, {
        headers: {
            Authorization: `Token ${authStore.token}`
        }
    })
)
refresh()
onMounted(() => {
    refresh()
})

onBeforeMount(()=>{
    refresh()
})

const deleteRutina = async (rutinaId: numberm,titulo:string) => {
    try {
        await $fetch(`${apiUrl}api/v1/post/${rutinaId}/`, {
            method: 'DELETE',
            headers: {
                Authorization: `Token ${authStore.token}`
            }
        })
        // Refresca los datos después de eliminar
        refresh()
        toast({
            title: 'Eleminado Correctamente',
            description: titulo,
        });
    } catch (err) {
        console.error('Error eliminando la rutina:', err)
    }
}
</script>

<template>
    <div class="flex flex-1 flex-col gap-4 p-4">
        <!-- Verifica si postData está disponible -->
        <div v-if="postData" class="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Total Post
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        {{ postData.count }}
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Indicador de carga mientras postData no está disponible -->
        <div v-else class="text-center text-gray-500">
            Cargando datos...
        </div>

        <!-- Tabla de publicaciones -->
        <div v-if="postData" class="flex min-h-screen w-full flex-col bg-muted/40">
            <div class="flex flex-col sm:gap-4">
                <main class="grid flex-1 items-start gap-4 p-4 md:gap-8">
                    <div class="flex items-center">
                        <div class="ml-auto flex items-center gap-2">
                            <NuxtLink to="/post/crear/">
                                <Button class="h-7 gap-1" size="sm">
                                    <PlusCircle class="h-3.5 w-3.5" />
                                    <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Agregar Publicación</span>
                                </Button>
                            </NuxtLink>
                        </div>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Publicaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Título</TableHead>
                                        <TableHead class="hidden md:table-cell">Publicado</TableHead>
                                        <TableHead class="hidden md:table-cell">Puntuación Total</TableHead>
                                        <TableHead><span class="sr-only">Acciones</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="invoice in postData.results" :key="invoice.id">
                                        <TableCell class="font-medium">{{ invoice.id }}</TableCell>
                                        <TableCell>{{ invoice.titulo }}</TableCell>
                                        <TableCell>
                                            <Badge :variant="invoice.publicado ? 'success' : 'destructive'">
                                                {{ invoice.publicado ? 'Sí' : 'No' }}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{{ invoice.puntuacion_total }}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger as-child>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal class="h-4 w-4" />
                                                        <span class="sr-only">Menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <NuxtLink :to="{ path: `/post/mostrar/${invoice.id,invoice.titulo}`, params: { id: invoice.id } }">
                                                        <DropdownMenuItem>Mostrar</DropdownMenuItem>
                                                    </NuxtLink>
                                                    <DropdownMenuItem @click="deleteRutina(invoice.id)" >Eliminar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    </div>
</template>
