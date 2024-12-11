<script setup lang="ts">
definePageMeta({
    layout: 'panel',
});
import {Card, CardContent, CardHeader, CardTitle,} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {PlusCircle, Download} from 'lucide-vue-next';
import {useAuthStore} from '~/stores/auth';
import { ref } from 'vue';
const authStore = useAuthStore();

const {public: {apiKey: apiUrl}} = useRuntimeConfig();

const {data: postData, error, refresh, status} = useAsyncData('fetch-cita', () =>
    $fetch(`${apiUrl}api/v1/ejercicio/?autor=${authStore.user.id}`, {
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    })
);
const descargarTablaComoCSV = () => {
    // Verifica si los datos existen
    if (!postData?.value?.results) {
        console.error('No hay datos disponibles para descargar.');
        return;
    }

    // Define los encabezados del CSV
    const headers = [
        'ID',
        'Nombre Ejercicio',
        'Duración (min)',
        'Repeticiones',
        'Nivel de Dificultad',
        'Grupo Muscular',
    ];

    // Construye las filas del CSV
    const rows = postData.results.map((item) => [
        item.id,
        item.nombre,
        item.duracion,
        item.repeticiones,
        item.nivel_dificultad,
        item.grupo_muscular,
    ]);

    // Convierte las filas en un formato CSV
    const csvContent =
        [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    // Crea un blob con el contenido del CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Crea un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ejercicios.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

</script>

<template>
    <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Ejercicios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">
                        {{ postData.count }}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div class="flex min-h-screen w-full flex-col">
            <div class="flex flex-col sm:gap-4">
                <main class="grid flex-1 items-start gap-4 p-4 md:gap-8">
                    <div class="flex items-center">
                        <div class="ml-auto flex items-center gap-2">
                            <NuxtLink to="/rutina/ejercicios/crear">
                                <Button class="h-7 gap-1" size="sm">
                                    <PlusCircle class="h-3.5 w-3.5" />
                                    <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Agregar Ejercicio</span>
                                </Button>
                            </NuxtLink>
                            <Button @click="descargarTablaComoCSV" class="h-7 gap-1" size="sm" variant="secondary">
                                <Download class="h-3.5 w-3.5" />
                                <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Descargar CSV</span>
                            </Button>
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
                                        <TableHead>Nombre Ejercicio</TableHead>
                                        <TableHead class="hidden md:table-cell">Duracion</TableHead>
                                        <TableHead>Numero de repeticiones</TableHead>
                                        <TableHead>Nivel de Difcultad</TableHead>
                                        <TableHead>Grupo muscular</TableHead>

                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="comida in postData.results" :key="comida.id">
                                        <TableCell class="font-medium">{{ comida.id }}</TableCell>
                                        <TableCell>{{ comida.nombre }}</TableCell>
                                        <TableCell>{{ comida.duracion }} min</TableCell>
                                        <TableCell>{{ comida.repeticiones }} x</TableCell>
                                        <TableCell>{{ comida.nivel_dificultad }}</TableCell>
                                        <TableCell>{{ comida.grupo_muscular }}</TableCell>
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

<style scoped>

</style>