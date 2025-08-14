# API de Vuelos - Entorno de Desarrollo

Este proyecto proporciona un entorno de desarrollo completo usando Docker Compose que incluye:

- **MongoDB**: Base de datos NoSQL
- **API REST**: Aplicación Node.js con Express

### Prerrequisitos

- Docker
- Docker Compose

### Instalación y Ejecución

1. **Clonar el repositorio y navegar al directorio:**

   ```bash
   cd airplane-flights
   ```

2. **Construir y ejecutar los contenedores:**

   ```bash
   docker-compose up --build
   ```

3. **Verificar que todo esté funcionando:**

   - API: http://localhost:3000
   - MongoDB: localhost:27017

4. **Poblar la base de datos con datos reales:**

   ```bash
   docker-compose exec app npm run seed
   ```

## 🔧 Endpoints de la API

### Vuelos

| Método | Endpoint             | Descripción                     |
| ------ | -------------------- | ------------------------------- |
| GET    | `/api/flights`       | Obtener todos los vuelos        |
| GET    | `/api/flights/:code` | Obtener un vuelo por flightCode |
| POST   | `/api/flights`       | Crear un nuevo vuelo            |
| PUT    | `/api/flights/:code` | Actualizar un vuelo             |
| DELETE | `/api/flights/:code` | Eliminar un vuelo               |

### Pasajeros

| Método | Endpoint                                     | Descripción                   |
| ------ | -------------------------------------------- | ----------------------------- |
| POST   | `/api/flights/:code/passengers`              | Agregar pasajero a un vuelo   |
| DELETE | `/api/flights/:code/passengers/:passengerId` | Eliminar pasajero de un vuelo |

## 🗄️ Esquema de Datos

### Vuelo (Flight)

```javascript
{
  flightCode: String (requerido, único),
  passengers: Array<Passenger> (opcional),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

### Pasajero (Passenger)

```javascript
{
  id: Number (requerido),
  name: String (requerido),
  hasConnections: Boolean (requerido),
  age: Number (requerido),
  flightCategory: "Black" | "Platinum" | "Gold" | "Normal" (requerido),
  reservationId: String (requerido),
  hasCheckedBaggage: Boolean (requerido)
}
```

### Flujo de trabajo:

1. **Ejecutar seed**: Crea vuelos vacíos y muestra estadísticas de pasajeros disponibles
2. **Usar API**: Agregar pasajeros a los vuelos usando `POST /api/flights/:id/passengers`
3. **Consultar**: Ver vuelos y pasajeros usando los endpoints de la API

### Comandos Útiles

```bash
# Ejecutar en modo desarrollo (con hot reload)
docker-compose up --build

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir solo la aplicación
docker-compose build app
docker-compose up app

# Poblar la base de datos con datos de ejemplo
docker-compose exec app npm run seed
```

**Ejemplos de Body para crear vuelo:**

```json
{
  "flightCode": "TEST123",
  "passengers": [
    {
      "id": 139577,
      "name": "Martín Alvarez",
      "hasConnections": false,
      "age": 2,
      "flightCategory": "Gold",
      "reservationId": "8ZC5KYVK",
      "hasCheckedBaggage": false
    }
  ]
}
```
