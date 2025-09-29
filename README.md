# 🚀 Dustkit Dev

**Monorepo universal para proyectos web + mobile de Dustkey.**  
Stack moderno con Next.js 14+, Expo, React Native Web, Supabase y gestión de estado con Zustand + TanStack Query.

---

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Desarrollo](#-desarrollo)
- [Comandos Disponibles](#-comandos-disponibles)
- [Base de Datos](#-base-de-datos)
- [Autenticación](#-autenticación)
- [Despliegue](#-despliegue)
- [Testing](#-testing)
- [Guía de Contribución](#-guía-de-contribución)
- [Troubleshooting](#-troubleshooting)

---

## 🛠 Stack Tecnológico

### Frontend
- **Web:** Next.js 14+ con App Router
- **Mobile:** Expo SDK 51+ (iOS/Android)
- **UI Compartido:** React Native Web + componentes universales
- **Styling:** Tailwind CSS (web) / StyleSheet (mobile)

### Backend & Datos
- **Base de Datos:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth con sistema completo de autenticación (SSR, OAuth, protección de rutas)
- **Storage:** Supabase Storage para archivos
- **Realtime:** Supabase Realtime para actualizaciones en vivo

### Estado & Fetching
- **Estado Global:** Zustand con persist middleware
- **Server State:** TanStack Query v5
- **Forms:** React Hook Form (opcional)

### Tooling & DX
- **Monorepo:** Turborepo + pnpm workspaces
- **TypeScript:** Configuración estricta compartida
- **Linting:** ESLint con reglas personalizadas
- **Formatting:** Prettier + EditorConfig
- **Git Hooks:** Husky + lint-staged
- **Versionado:** Changesets

---

## 📂 Estructura del Proyecto

```
dustkit-dev/
├── apps/
│   ├── web/                    # Aplicación Next.js
│   │   ├── app/                # App Router
│   │   │   ├── auth/           # Sistema de autenticación
│   │   │   │   ├── signin/     # Página de inicio de sesión
│   │   │   │   ├── signup/     # Página de registro
│   │   │   │   ├── callback/   # Callback OAuth
│   │   │   │   └── signout/    # Ruta de cierre de sesión
│   │   │   └── dashboard/      # Dashboard protegido
│   │   ├── lib/                # Utilidades y helpers
│   │   │   ├── auth-helpers.ts # Helpers server-side
│   │   │   ├── auth-hooks.ts   # Hooks client-side
│   │   │   └── supabase-*.ts   # Clientes Supabase
│   │   ├── middleware.ts       # Middleware de auth
│   │   ├── public/             # Assets estáticos
│   │   └── package.json
│   │
│   └── mobile/                 # Aplicación Expo
│       ├── app/                # Expo Router
│       │   ├── (auth)/         # Grupo de rutas de auth
│       │   │   ├── signin.tsx  # Pantalla de login
│       │   │   └── signup.tsx  # Pantalla de registro
│       │   └── dashboard/      # Dashboard móvil
│       ├── src/                # Código fuente
│       │   └── supabase.ts     # Cliente Supabase móvil
│       ├── assets/             # Imágenes y fonts
│       └── package.json
│
├── packages/
│   ├── ui/                     # Design System compartido
│   │   └── src/
│   │       ├── primitives/     # Componentes base
│   │       └── index.ts
│   │
│   ├── core/                   # Lógica de negocio
│   │   └── src/
│   │       ├── store/          # Stores Zustand
│   │       ├── hooks/          # Hooks personalizados
│   │       └── types.ts        # Types compartidos
│   │
│   ├── api-client/             # Cliente HTTP/SDK
│   │   └── src/
│   │       ├── fetcher.ts      # Wrapper de fetch
│   │       └── hooks.ts        # Hooks de React Query
│   │
│   └── integrations/
│       └── supabase/           # Cliente Supabase universal
│           └── src/
│               ├── client.ts
│               └── secureStoreAdapter.expo.ts
│
├── supabase/
│   ├── migrations/             # SQL migrations
│   ├── functions/              # Edge Functions (opcional)
│   └── config.toml            # Configuración local
│
├── tooling/
│   ├── eslint-config/         # Configuración ESLint
│   └── tsconfig/              # Configuraciones TypeScript
│
├── turbo.json                 # Configuración Turborepo
├── pnpm-workspace.yaml        # Workspaces de pnpm
└── package.json              # Scripts del monorepo
```

---

## ✅ Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (instalar con `npm install -g pnpm`)
- **Supabase CLI** (opcional, para desarrollo local)
- **iOS Simulator** (Mac) o **Android Studio** (para desarrollo mobile)
- **Git** para control de versiones

### Instalación de Supabase CLI (opcional)

```bash
# macOS/Linux con Homebrew
brew install supabase/tap/supabase

# NPM (todas las plataformas)
npm install -g supabase

# Verificar instalación
supabase --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/dustkey/dustkit-dev.git
cd dustkit-dev
```

### 2. Instalar dependencias

```bash
pnpm install
```

Esto instalará todas las dependencias del monorepo, incluyendo apps y packages.

### 3. Configurar variables de entorno

#### Web (.env.local en apps/web/)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Solo para server-side

# Autenticación
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Para OAuth redirects

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPx-xxxxxxxxxxxxxxxxxxxxx
```

#### Mobile (.env en apps/mobile/)

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OAuth (opcional)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 4. Configurar base de datos y autenticación

#### Configurar Supabase (requerido para auth)

**Opción A: Supabase Local (desarrollo)**
```bash
# Inicializar Supabase
supabase init

# Levantar servicios locales
supabase start

# Aplicar migraciones (incluye tablas de auth)
supabase db reset
```

**Opción B: Supabase Cloud (producción)**
1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a Settings > API para obtener tus keys
3. Configura variables de entorno con tus valores reales

#### Configurar Google OAuth (opcional)

1. **Crear proyecto en Google Cloud Console:**
   - Ve a [console.cloud.google.com](https://console.cloud.google.com)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la Google+ API

2. **Configurar OAuth 2.0:**
   - Ve a Credentials > Create Credentials > OAuth 2.0 Client ID
   - Selecciona "Web application"
   - Agrega las Authorized redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://tu-dominio.com/auth/callback
     ```

3. **Configurar en Supabase:**
   - Ve a Authentication > Providers
   - Habilita Google
   - Agrega tu Client ID y Client Secret

### 5. Verificar instalación

```bash
# Levantar aplicaciones
pnpm dev

# Verificar que funciona:
# 1. Abre http://localhost:3000
# 2. Ve a /dashboard (debe redirigir a signin)
# 3. Prueba el registro en /auth/signup
# 4. Prueba el login en /auth/signin
```

---

## 💻 Desarrollo

### Ejecutar aplicación web

```bash
# Desde la raíz del monorepo
pnpm dev:web

# O directamente
cd apps/web && pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Ejecutar aplicación mobile

```bash
# Desde la raíz del monorepo
pnpm dev:mobile

# O directamente
cd apps/mobile && pnpm start
```

Opciones:
- Presiona `i` para iOS Simulator
- Presiona `a` para Android Emulator
- Escanea QR con Expo Go para dispositivo físico

### Desarrollo en paralelo

```bash
# Ejecutar web + mobile simultáneamente
pnpm dev
```

---

## 📝 Comandos Disponibles

### Monorepo (raíz)

```bash
# Desarrollo
pnpm dev              # Ejecuta todas las apps en modo desarrollo
pnpm dev:web          # Solo web
pnpm dev:mobile       # Solo mobile

# Build
pnpm build            # Build de producción para todas las apps
pnpm build:web        # Build solo web
pnpm build:mobile     # Build solo mobile (EAS)

# Calidad de código
pnpm lint             # Ejecuta ESLint en todo el monorepo
pnpm type-check       # Verifica tipos TypeScript
pnpm format           # Formatea código con Prettier
pnpm format:check     # Verifica formato sin modificar

# Base de datos
pnpm db:reset         # Reset de la DB local
pnpm db:push          # Push de migraciones
pnpm db:pull          # Pull del schema remoto

# Gestión de packages
pnpm changeset        # Crear changeset para versionado
pnpm version-packages # Versionar packages
pnpm release          # Publicar packages (CI/CD)

# Utilidades
pnpm clean            # Limpia builds y node_modules
```

### Apps específicas

#### Web (apps/web/)

```bash
pnpm dev              # Desarrollo con hot reload
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm lint             # Lint específico de Next.js
```

#### Mobile (apps/mobile/)

```bash
pnpm start            # Expo Dev Server
pnpm ios              # iOS Simulator
pnpm android          # Android Emulator
pnpm web              # Web browser (experimental)
```

---

## 🗄 Base de Datos

### Estructura inicial

La migración base (`supabase/migrations/000_init.sql`) incluye:

- Tabla `profiles` con RLS habilitado
- Trigger para crear perfil en registro
- Bucket de storage para avatares
- Políticas de seguridad básicas

### Crear nueva migración

```bash
# Generar migración
supabase migration new nombre_migracion

# Editar archivo en supabase/migrations/
# Aplicar migración
supabase db reset
```

### Tipos TypeScript

Genera tipos desde tu schema:

```bash
supabase gen types typescript --local > packages/core/src/database.types.ts
```

---

## 🔐 Sistema de Autenticación

Dustkit incluye un sistema completo de autenticación universal que funciona tanto en web como en mobile, con soporte para múltiples métodos de inicio de sesión, protección de rutas automática y manejo de estado compartido.

### 🎯 Características del Sistema

- **Autenticación Universal:** Misma lógica para web y mobile
- **Métodos de Inicio de Sesión:**
  - Email/Contraseña con validación
  - Google OAuth (web y mobile)
  - Registro de nuevos usuarios
- **Protección de Rutas:** Middleware automático que protege rutas privadas
- **Dashboard Integrado:** Interfaz de usuario post-autenticación
- **Hooks Compartidos:** Estado de autenticación accesible en toda la aplicación
- **Manejo de Errores:** Páginas de error específicas y mensajes informativos
- **Redirects Inteligentes:** Redirige a la página original después del login

### 🌐 Implementación Web (Next.js)

#### Protección de Rutas con Middleware

El middleware protege automáticamente las rutas definidas y maneja redirects:

```typescript
// middleware.ts - Configuración automática
const protectedRoutes = [
  '/dashboard',
  '/profile', 
  '/settings'
]
```

#### Autenticación Server-Side (SSR)

```typescript
// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth-helpers'

export default async function DashboardPage() {
  // Redirige automáticamente a /auth/signin si no está autenticado
  const user = await requireAuth()
  
  return (
    <div>
      <h1>Bienvenido, {user.email}</h1>
      {/* Contenido protegido */}
    </div>
  )
}
```

#### Hooks Client-Side

```typescript
// components/user-menu.tsx
'use client'
import { useAuth } from '@/lib/auth-hooks'

export default function UserMenu() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Cargando...</div>
  
  if (!user) {
    return <a href="/auth/signin">Iniciar Sesión</a>
  }
  
  return (
    <div>
      <span>Hola, {user.email}</span>
      <button onClick={signOut}>Cerrar Sesión</button>
    </div>
  )
}
```

### 📱 Implementación Mobile (Expo)

#### Autenticación con SecureStore

```typescript
// app/_layout.tsx
import { supabase } from '@/src/supabase'
import { useAuth } from '@dustkit/core'

export default function Layout() {
  const { user, isAuthenticated } = useAuth(supabase)
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signin" />
  }
  
  return <Stack />
}
```

#### Componente de Login Mobile

```typescript
// app/(auth)/signin.tsx
import { supabase } from '../../src/supabase'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (!error) {
      router.replace('/dashboard')
    }
  }
  
  // Google OAuth con expo-auth-session
  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  })
  
  return (
    <View>
      {/* Formulario de login */}
      <Button title="Continuar con Google" onPress={() => promptAsync()} />
    </View>
  )
}
```

### ⚙️ Configuración de OAuth

#### 1. Configurar Google OAuth en Supabase

1. Ve a **Authentication > Providers** en tu dashboard de Supabase
2. Habilita **Google** como provider
3. Agrega tus credenciales de Google Console:
   ```
   Client ID: xxxxx.apps.googleusercontent.com
   Client Secret: GOCSPx-xxxxxxxxxxxxxxxxxxxxx
   ```

#### 2. URLs de Redirect

Configura estas URLs en tu Google Console y Supabase:

**Web:**
```
http://localhost:3000/auth/callback
https://tu-dominio.com/auth/callback
```

**Mobile:**
```
exp://127.0.0.1:19000/--/(auth)/signin
dustkit://auth/callback
```

#### 3. Variables de Entorno Requeridas

**Web (.env.local):**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPx-xxxxxxxxxxxxxxxxxxxxx
```

**Mobile (.env):**
```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 🛡️ Utilidades y Helpers

#### Protección de Páginas

```typescript
// Requiere autenticación y redirige si no está autenticado
const user = await requireAuth('/protected-page')

// Solo verifica autenticación sin redirigir
const { user, error } = await getCurrentUser()

// Requiere permisos específicos
const user = await requirePermission('admin', '/unauthorized')
```

#### Hooks del Cliente

```typescript
// Hook básico de autenticación
const { user, loading, signOut, refreshSession } = useAuth()

// Verificar si está autenticado
const isAuthenticated = useIsAuthenticated()

// Requiere autenticación en componentes cliente
const { user, loading } = useRequireAuth('/redirect-here')
```

### 🔄 Flujos de Autenticación

#### Flujo de Login

1. Usuario intenta acceder a ruta protegida (`/dashboard`)
2. Middleware detecta usuario no autenticado
3. Redirige a `/auth/signin?redirectTo=/dashboard`
4. Usuario se autentica exitosamente
5. Redirige automáticamente a `/dashboard`

#### Flujo OAuth (Google)

1. Usuario hace clic en "Continuar con Google"
2. Redirige a Google OAuth
3. Google redirige a `/auth/callback?code=...&next=/dashboard`
4. Callback intercambia el código por una sesión
5. Usuario redirigido al dashboard o destino original

#### Flujo de Logout

1. Usuario hace clic en cerrar sesión
2. Sesión eliminada de Supabase
3. Cookies/SecureStore limpiado
4. Redirigido a página principal

### 📄 Páginas de Autenticación

El sistema incluye páginas completas y estilizadas:

- **`/auth/signin`** - Inicio de sesión con email/contraseña y Google OAuth
- **`/auth/signup`** - Registro de nuevos usuarios
- **`/auth/callback`** - Manejo de callbacks OAuth
- **`/auth/auth-code-error`** - Página de errores de autenticación
- **`/dashboard`** - Dashboard protegido post-autenticación

### 🔧 Configuración del Dashboard

El dashboard incluye:
- Información del usuario autenticado
- Opciones de cerrar sesión
- Interfaz responsiva (web y mobile)
- Navegación protegida

```typescript
// app/dashboard/page.tsx
export default async function Dashboard() {
  const user = await requireAuth()
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user.email}</p>
      <DashboardClient /> {/* Componente cliente */}
    </div>
  )
}
```

---

## 🚢 Despliegue

### Web (Vercel)

1. Conecta tu repo en Vercel
2. Configura variables de entorno
3. Settings de build:
   - Framework: Next.js
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm build:web`
   - Output Directory: `apps/web/.next`

### Mobile (EAS)

1. Instala EAS CLI: `npm install -g eas-cli`
2. Configura proyecto: `cd apps/mobile && eas build:configure`
3. Build para stores:

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### Supabase

1. Crea proyecto en [supabase.com](https://supabase.com)
2. Push de migraciones:

```bash
supabase link --project-ref tu-proyecto
supabase db push
```

---

## 🧪 Testing

### Setup inicial

```bash
# Instalar dependencias de testing
pnpm add -D vitest @testing-library/react @testing-library/react-native
```

### Ejecutar tests

```bash
pnpm test              # Ejecuta todos los tests
pnpm test:watch        # Modo watch
pnpm test:coverage     # Con coverage
```

### Estructura de tests

```typescript
// packages/ui/src/primitives/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native'
import { Button } from './Button'

describe('Button', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn()
    const { getByText } = render(
      <Button title="Test" onPress={onPress} />
    )
    
    fireEvent.press(getByText('Test'))
    expect(onPress).toHaveBeenCalled()
  })
})
```

---

## 👥 Guía de Contribución

### Flujo de trabajo

1. **Fork y clone** el repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/amazing-feature`
3. **Haz commits** con mensajes descriptivos
4. **Push** a tu fork
5. **Crea un Pull Request**

### Convenciones de código

- **Commits:** Usar [Conventional Commits](https://www.conventionalcommits.org/)
  - `feat:` Nueva funcionalidad
  - `fix:` Corrección de bug
  - `docs:` Documentación
  - `style:` Formateo
  - `refactor:` Refactoring
  - `test:` Tests
  - `chore:` Tareas de mantenimiento

- **Naming:**
  - Componentes: PascalCase
  - Funciones/hooks: camelCase
  - Constantes: UPPER_SNAKE_CASE
  - Archivos: kebab-case o PascalCase para componentes

### Crear nuevo package

```bash
# Estructura básica
mkdir packages/nuevo-package
cd packages/nuevo-package

# package.json mínimo
cat > package.json << EOF
{
  "name": "@dustkit/nuevo-package",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@dustkit/eslint-config": "workspace:*",
    "@dustkit/tsconfig": "workspace:*"
  }
}
EOF

# Agregar a las apps que lo necesiten
pnpm add @dustkit/nuevo-package --filter @dustkit/web
```

---

## 🔧 Troubleshooting

### Errores comunes

#### 1. "Cannot find module '@dustkit/...'"

```bash
# Rebuild packages
pnpm build --filter='./packages/*'

# Clear cache
pnpm clean && pnpm install
```

#### 2. Metro bundler issues (Mobile)

```bash
# Clear Metro cache
cd apps/mobile
npx expo start -c
```

#### 3. TypeScript errors en packages

```bash
# Verificar configuración
pnpm type-check

# Regenerar declaraciones
pnpm build --filter='./packages/*'
```

#### 4. Supabase connection failed

- Verifica variables de entorno
- Confirma que el proyecto esté activo
- Revisa políticas RLS en las tablas

### 🔐 Problemas de Autenticación

#### 1. Redirect loops infinitos

**Problema:** El usuario queda atrapado en redirects entre páginas de auth.

**Solución:**
```bash
# Verifica la configuración del middleware
# Revisa que las rutas protegidas estén bien definidas
# Confirma que /auth/* no esté en protectedRoutes
```

#### 2. Google OAuth no funciona

**Problema:** Error al intentar iniciar sesión con Google.

**Soluciones:**
```bash
# Verifica las variables de entorno
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPx-xxxxxxxxxxxxxxxxxxxxx

# Confirma las URLs de redirect en Google Console:
# Web: http://localhost:3000/auth/callback
# Mobile: exp://127.0.0.1:19000/--/(auth)/signin

# Verifica que Google esté habilitado en Supabase Dashboard
```

#### 3. Sesión no persiste

**Problema:** El usuario debe iniciar sesión constantemente.

**Soluciones:**
```bash
# Web: Verifica cookies en DevTools
# Confirma NEXT_PUBLIC_SITE_URL en .env.local

# Mobile: Verifica SecureStore
# Reinstala la app si es necesario
```

#### 4. Error "Invalid auth code"

**Problema:** Enlaces de autenticación dan error.

**Soluciones:**
```bash
# Verifica que las URLs de callback estén configuradas correctamente
# Confirma que el proyecto Supabase esté activo
# Revisa los logs de Supabase Dashboard > Auth > Logs
```

#### 5. Dashboard no se carga

**Problema:** Error 500 o página en blanco en el dashboard.

**Soluciones:**
```bash
# Verifica que el usuario esté autenticado
# Revisa los logs del servidor en terminal
# Confirma que las tablas de profiles existan
# Verifica las políticas RLS en Supabase
```

#### 6. Mobile: Expo AuthSession issues

**Problema:** OAuth no funciona en mobile.

**Soluciones:**
```bash
# Verifica EXPO_PUBLIC_GOOGLE_CLIENT_ID
# Usa expo start --clear para limpiar cache
# Confirma la configuración de AuthSession.makeRedirectUri()
# Prueba con un dispositivo real si el simulador falla
```

### Reset completo

```bash
# Limpieza total
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Debug de Autenticación

```bash
# Para debuggear problemas de auth:

# 1. Revisa logs del navegador (web)
# F12 > Console > busca errores de Supabase

# 2. Revisa logs de Supabase
# Dashboard > Auth > Logs

# 3. Verifica middleware (web)
# Agrega console.log en middleware.ts

# 4. Testa rutas manualmente
curl -I http://localhost:3000/dashboard
curl -I http://localhost:3000/auth/signin
```

---

## 📚 Recursos

### Documentación oficial
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Docs](https://pnpm.io)

### Ejemplos y templates
- [Next.js + Supabase](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
- [Expo + Supabase](https://github.com/supabase/supabase/tree/master/examples/auth/expo)
- [Turborepo Examples](https://github.com/vercel/turbo/tree/main/examples)

### Comunidad
- [Discord de Dustkey](https://discord.gg/dustkey)
- [GitHub Issues](https://github.com/dustkey/dustkit-dev/issues)

---

## 📄 Licencia

MIT © Dustkey

---

## 🎯 Roadmap

- [ ] Storybook para `packages/ui`
- [ ] Tests E2E con Playwright (web) y Detox (mobile)
- [ ] CI/CD con GitHub Actions
- [ ] Generadores con Plop
- [ ] Soporte para NativeWind/Tamagui
- [ ] Dashboard de métricas
- [ ] Documentación con Docusaurus
- [ ] CLI personalizado para scaffolding

---

**Happy coding! 🚀**

Para soporte o preguntas, abre un issue o contacta al equipo de Dustkey.