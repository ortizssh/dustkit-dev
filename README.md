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
- **Auth:** Supabase Auth con soporte SSR y OAuth
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
│   │   ├── lib/                # Utilidades (Supabase clients)
│   │   ├── public/             # Assets estáticos
│   │   └── package.json
│   │
│   └── mobile/                 # Aplicación Expo
│       ├── app/                # Expo Router
│       ├── src/                # Código fuente
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

# Opcional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Mobile (.env en apps/mobile/)

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OAuth (opcional)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 4. Configurar base de datos (opcional)

Si usas Supabase local:

```bash
# Inicializar Supabase
supabase init

# Levantar servicios locales
supabase start

# Aplicar migraciones
supabase db reset
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

## 🔐 Autenticación

### Web (SSR con cookies)

```typescript
// app/layout.tsx
import { createClient } from '@/lib/supabase-server'

export default async function RootLayout() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <html>
      {/* ... */}
    </html>
  )
}
```

### Mobile (SecureStore)

```typescript
// app/_layout.tsx
import { supabase } from '@/src/supabase'
import { useSession } from '@dustkit/core'

export default function Layout() {
  const { user, isAuthenticated } = useSession(supabase)
  
  if (!isAuthenticated) {
    return <Redirect href="/login" />
  }
  
  return <Stack />
}
```

### OAuth Setup

1. Configurar providers en Supabase Dashboard
2. Agregar redirect URLs:
   - Web: `http://localhost:3000/auth/callback`
   - Mobile: `dustkit://auth/callback`

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

### Reset completo

```bash
# Limpieza total
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
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