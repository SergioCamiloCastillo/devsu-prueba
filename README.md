# Prueba Técnica — Banco App

Aplicación móvil en React Native que consume una API REST local (Express/TypeScript) para gestión de productos financieros.

---

## Estructura del repositorio

```
repo-interview-main/
├── backend/      → API REST (Express + TypeScript)
└── BancoApp/     → App móvil (React Native 0.84)
```

---

## Requisitos previos

- Node.js >= 22.11.0
- npm
- Android Studio + emulador configurado (para Android)
- Xcode (para iOS, solo macOS)
- JDK 17+

---

## 1. Backend (API REST)

### Tecnologías
- Express 4
- TypeScript 4
- routing-controllers
- class-validator
- Puerto: **3002**
- Prefijo de rutas: `/bp`

### Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/bp/products` | Listar todos los productos |
| POST | `/bp/products` | Crear un producto |
| GET | `/bp/products/:id` | Obtener un producto por ID |
| PUT | `/bp/products/:id` | Actualizar un producto |
| DELETE | `/bp/products/:id` | Eliminar un producto |
| GET | `/bp/products/verification/:id` | Verificar si un ID ya existe |

### Instalación y ejecución

```bash
cd backend
npm install
npm run start:dev
```

El servidor quedará corriendo en `http://localhost:3002`.

> Los datos se almacenan **en memoria**, se reinician al detener el servidor.

---

## 2. Frontend — BancoApp (React Native)

### Tecnologías
- React Native 0.84 / React 19
- TypeScript
- TanStack Query (server state)
- Zustand (UI state)
- React Navigation (native-stack)
- @react-native-community/datetimepicker
- react-native-image-picker

### Arquitectura

```
src/
├── domain/
│   ├── entities/          → Product, FormErrors
│   ├── repositories/      → ProductRepository (interfaz)
│   └── usecases/          → GetProducts, CreateProduct, UpdateProduct,
│                             DeleteProduct, VerifyProductId, GetProduct
├── data/
│   ├── datasources/       → ProductRemoteDataSource (fetch a la API)
│   └── repositories/      → ProductRepositoryImpl
└── presentation/
    ├── hooks/             → useProducts, useCreateProduct, etc. (TanStack Query)
    ├── store/             → productStore (Zustand)
    ├── navigation/        → AppNavigator
    ├── screens/           → ProductListScreen, ProductDetailScreen, ProductFormScreen
    └── components/        → Header, SkeletonLoader, DeleteModal
```

### Funcionalidades

| ID | Descripción |
|----|-------------|
| F1 | Listado de productos financieros |
| F2 | Búsqueda por nombre |
| F3 | Contador de resultados |
| F4 | Agregar producto (formulario con validaciones) |
| F5 | Editar producto |
| F6 | Eliminar producto (modal de confirmación) |

El campo **logo** permite tomar foto con la cámara o elegir desde la galería.  
El campo **Fecha Liberación** abre un calendario nativo.  
El campo **Fecha Revisión** se calcula automáticamente (1 año después).

### Instalación

```bash
cd BancoApp
npm install
```

### Ejecución

#### Paso 1 — Iniciar el backend primero

```bash
cd backend
npm run start:dev
```

#### Paso 2 — Iniciar Metro (bundler)

```bash
cd BancoApp
npm start
```

#### Paso 3 — Correr en Android

```bash
cd BancoApp
npm run android
```

#### Paso 3 — Correr en iOS

```bash
cd BancoApp
npm run ios
```

> **Nota Android:** La app se conecta al backend usando `http://10.0.2.2:3002` (dirección del host desde el emulador Android). Si usas dispositivo físico, reemplaza `10.0.2.2` por la IP local de tu máquina en `src/data/datasources/ProductRemoteDataSource.ts`.

### Tests

```bash
cd BancoApp
npm test
```

Cobertura mínima configurada: **70%**. Actualmente supera el **85%**.

---

## Validaciones del formulario

| Campo | Regla |
|-------|-------|
| ID | 3–10 caracteres, único (verificado contra la API) |
| Nombre | 5–100 caracteres |
| Descripción | 10–200 caracteres |
| Logo | Requerido (URL o imagen seleccionada) |
| Fecha Liberación | Debe ser igual o mayor a hoy |
| Fecha Revisión | Exactamente 1 año después de Fecha Liberación (auto-calculado) |
