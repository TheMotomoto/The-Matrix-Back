import { parentPort, workerData } from 'node:worker_threads';

// El worker necesita acceso a parentPort para comunicarse con el hilo principal
if (!parentPort) {
  throw new Error('Este script debe ejecutarse como un worker thread');
}

// Solo se pueden pasar valores primitivos al worker (números, strings, booleanos, null, undefined, etc.)
let { value } = workerData;
value += 10;

// Enviamos el resultado de vuelta al hilo principal en lugar de un return
parentPort.postMessage(value);
