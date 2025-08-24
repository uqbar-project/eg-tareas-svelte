#!/bin/bash
set -e

BACKEND_DIR="../eg-tareas-springboot-kotlin"
PORT=9000

# Levantar backend en subshell y capturar PID
(cd "$BACKEND_DIR" && ./gradlew bootRun -Pserver.port=$PORT --no-daemon &) 
BACKEND_PID=$!

# Esperar hasta que el puerto esté listo
while ! nc -z localhost $PORT; do
  sleep 1
done

echo "Backend is ready!"
