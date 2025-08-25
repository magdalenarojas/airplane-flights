# Usa la imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que usa la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
# En desarrollo usa nodemon, en producción usa node
CMD ["npm", "run", "dev"]