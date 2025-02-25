# Transactions APP

## Descripción
Transactions APP es una aplicación web diseñada para gestionar transacciones financieras. Permite a los usuarios visualizar, agregar, editar y eliminar transacciones, así como filtrar transacciones por diferentes criterios. La aplicación también proporciona una vista de dashboard para mostrar un resumen de las transacciones, incluyendo ingresos y gastos.

## Tecnologías Utilizadas
- Vue.js 3
- Vue Composition API
- Vue Router
- Axios
- Tailwind CSS
- Chart.js
- Vue Chart.js
- Vue Toastification
- Vuelidate
- Oh Vue Icons
- TypeScript
- Vite

## Estructura del Proyecto
Explicación de la estructura de carpetas y archivos principales.

```plaintext
├── public/                     # Archivos estáticos públicos
│   └── index.html              # Archivo HTML principal
├── src/                        # Código fuente del proyecto
│   ├── api/                    # Funciones de API para interactuar con el backend
│   │   ├── categories.ts       # Funciones de API para categorías
│   │   ├── clients.ts          # Funciones de API para clientes
│   │   └── transactions.ts     # Funciones de API para transacciones
│   ├── assets/                 # Recursos estáticos como imágenes y estilos
│   ├── components/             # Componentes reutilizables de Vue
│   │   ├── Table.vue           # Componente de tabla para mostrar datos
│   │   └── FormTransaccion.vue # Componente de formulario para transacciones
|   |   └── Navbar.vue          # Componente para el navbar de la aplicación
|   |   └── StatisticalCard.vue # Componente para las card de estadisticas
│   ├── models/                 # Definiciones de tipos y modelos
│   │   ├── Category.ts         # Modelo de categoría
│   │   ├── Client.ts           # Modelo de cliente
│   │   └── Transaccion.ts      # Modelo de transacción
│   ├── utils/                  # Utilidades y configuraciones
│   │   └── axios.ts            # Configuración de la instancia de Axios con manejo de errores
│   ├── views/                  # Vistas principales de la aplicación
│   │   ├── Dashboard.vue       # Vista del dashboard
│   │   └── Transactions.vue    # Vista de transacciones
│   │   └── NotFound.vue        # Vista para las rutas 404
│   ├── App.vue                 # Componente raíz de la aplicación
│   ├── main.ts                 # Punto de entrada principal de la aplicación
│   └── router.ts               # Configuración de rutas de Vue Router
├── .gitignore                  # Archivos y directorios a ignorar por Git
├── package.json                # Dependencias y scripts del proyecto
└── README.md                   # Documentación del proyecto
```
## Configuración

Funciona con variables de entorno `.env` Asegúrate de crear el archivos y agregar los iguiente:

### `.env`

```env
VITE_API_CATEGORIES_URL=http://localhost:5003/api
VITE_API_TRANSACTIONS_URL=http://localhost:5002/api
VITE_API_CLIENTS_URL=http://localhost:5001/api
```

## Instalación
Pasos para instalar y configurar el proyecto localmente.

```bash
# Clonar el repositorio
git clone https://github.com/Nivaldo21/front-forte.git

# Navegar al directorio del proyecto
cd front-forte

# Instalar dependencias
npm install

# Ejecutar el proyecto en modo desarrollo
npm run dev
```

El server se levantara en la ruta:  
**http://localhost:5173/**
## Autores

- [@Nivaldo21](https://github.com/Nivaldo21)