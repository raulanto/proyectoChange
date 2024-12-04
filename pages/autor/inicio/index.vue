<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import core from "@redocly/ajv/lib/vocabularies/core";
import {NavigationMenuLink, navigationMenuTriggerStyle} from "~/components/ui/navigation-menu";
definePageMeta({
    layout: 'cusmtom',

})
const orreo=ref()
</script>

<template>
    <div class="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <div class="mx-auto grid w-[350px] gap-6">
                <div class="grid gap-2 text-center">
                    <h1 class="text-2xl font-bold">
                        Inicio de sesión
                    </h1>
                    <p class="text-balance text-muted-foreground">
                        Ingrese su correo y contraseña
                    </p>
                </div>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="email">Correo</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            v-model="orreo"
                        />
                    </div>
                    <div class="grid gap-2">
                        <div class="flex items-center">
                            <Label for="password">contraseña</Label>

                        </div>
                        <Input id="password" type="password" required />
                    </div>

                    <NavigationMenuLink href="/panel/" :class="navigationMenuTriggerStyle()">
                        Registro
                    </NavigationMenuLink>
                    <Button variant="outline" class="w-full">
                        Registro
                    </Button>
                </div>

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