<script setup lang="ts">
definePageMeta({
    layout: 'panel',
});
import {Card, CardContent, CardHeader, CardTitle,} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table';
import {PlusCircle, Download} from 'lucide-vue-next';
import {useAuthStore} from '~/stores/auth';

const authStore = useAuthStore();

const {public: {apiKey: apiUrl}} = useRuntimeConfig();

const {data: postData, error, refresh, status} = useAsyncData('fetch-cita', () =>
    $fetch(`${apiUrl}api/v1/alimentacion/?autor=${authStore.user.id}`, {
        headers: {
            Authorization: `Token ${authStore.token}`,
        },
    })
);

// Función para descargar el CSV
function descargarTablaComoCSV() {
    if (!postData?.value?.results) {
        alert("No hay datos disponibles para exportar.");
        return;
    }

    const rows = postData.value.results.map(item => [
        item.id,
        item.nombre_comida,
        item.nivel_importancia,
        item.calorias,
        item.proteinas,
        item.carbohidratos,
        item.grasas,
    ]);

    // Encabezados de la tabla
    const headers = ["ID", "Nombre Comida", "Nivel de Importancia", "Calorías", "Proteínas", "Carbohidratos", "Grasas"];

    // Convertir datos a formato CSV
    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(value => `"${value}"`).join(",")),
    ].join("\n");

    // Crear archivo descargable
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);

    // Crear y disparar descarga
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "comidas.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

<template>
    <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">Comidas</CardTitle>
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
                            <NuxtLink to="/rutina/comidas/crear">
                                <Button class="h-7 gap-1" size="sm">
                                    <PlusCircle class="h-3.5 w-3.5" />
                                    <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">Agregar Comida</span>
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
                                        <TableHead>Nombre Comida</TableHead>
                                        <TableHead class="hidden md:table-cell">Nivel de importancia</TableHead>
                                        <TableHead>Calorías</TableHead>
                                        <TableHead>Proteínas</TableHead>
                                        <TableHead>Carbohidratos</TableHead>
                                        <TableHead>Grasas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow v-for="comida in postData.results" :key="comida.id">
                                        <TableCell class="font-medium">{{ comida.id }}</TableCell>
                                        <TableCell>{{ comida.nombre_comida }}</TableCell>
                                        <TableCell>{{ comida.nivel_importancia }}</TableCell>
                                        <TableCell>{{ comida.calorias }}</TableCell>
                                        <TableCell>{{ comida.proteinas }}</TableCell>
                                        <TableCell>{{ comida.carbohidratos }}</TableCell>
                                        <TableCell>{{ comida.grasas }}</TableCell>
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
