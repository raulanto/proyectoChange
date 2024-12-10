<script setup lang=ts>
definePageMeta({
    layout: 'panel',

})
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Tabs, TabsContent,} from '@/components/ui/tabs'
import {File, MoreHorizontal, PlusCircle,} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()


const {public: {apiKey: apiUrl}} = useRuntimeConfig()


const {data: postData, error, refresh,status} = useAsyncData('fetch-cita', () =>
    $fetch(`${apiUrl}api/v1/alimentacion/?autor=${authStore.user.id}`, {
        headers: {
            Authorization: `Token ${authStore.token}`
        }
    })
)



</script>

<template>

    <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="grid  gap-4 md:grid-cols-3">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">
                        Comidas
                    </CardTitle>

                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        {{postData.count}}
                    </div>

                </CardContent>
            </Card>
        </div>
        <div class="flex min-h-screen w-full flex-col ">
            <div class="flex flex-col sm:gap-4  ">
                <main class="grid flex-1 items-start gap-4 p-4  md:gap-8">
                    <div class="flex items-center">
                        <div class="ml-auto flex items-center gap-2">
                            <NuxtLink to="/rutina/comidas/crear">
                                <Button class="h-7 gap-1" size="sm">
                                    <PlusCircle class="h-3.5 w-3.5"/>
                                    <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Agrear Comida</span>
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
                                        <TableHead>Nombre Comida</TableHead>
                                        <TableHead class="hidden md:table-cell">
                                           Nivel de importancia
                                        </TableHead>
                                        <TableHead>Calorias</TableHead>
                                        <TableHead>Proteinas</TableHead>
                                        <TableHead>Carbohidratos</TableHead>
                                        <TableHead>Grasas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="invoice in postData.results" :key="invoice.invoice">
                                        <TableCell class="font-medium">
                                            {{ invoice.id }}
                                        </TableCell>
                                        <TableCell>{{ invoice.nombre_comida }}</TableCell>

                                        <TableCell class="">
                                            {{ invoice.nivel_importancia  }}
                                        </TableCell>
                                        <TableCell class="">
                                            {{ invoice.calorias  }}
                                        </TableCell>
                                        <TableCell class="">
                                            {{ invoice.proteinas  }}
                                        </TableCell>
                                        <TableCell class="">
                                            {{ invoice.carbohidratos  }}
                                        </TableCell>
                                        <TableCell class="">
                                            {{ invoice.grasas  }}
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