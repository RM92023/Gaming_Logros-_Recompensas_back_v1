import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { EventPublisher } from './events/event.publisher';

/**
 * Servicio de Jugadores - Punto de entrada principal
 * Principio SOLID S: Solo responsable de inicializar la aplicación
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Necesario para webhook de Stripe
  });
  
  // Habilita la validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Habilita CORS para desarrollo
  app.enableCors();

  const portEnv = process.env.PORT;
  const port = portEnv ? parseInt(portEnv, 10) : 3001;
  
  console.log(`📌 Environment PORT=${portEnv}, Using port ${port}`);
  
  try {
    // Inicializa el publicador de eventos
    const eventPublisher = app.get<EventPublisher>('IEventPublisher');
    console.log('📡 Inicializando el publicador de eventos...');
    await eventPublisher.connect();
    console.log('✅ Publicador de eventos conectado a RabbitMQ');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.warn('⚠️ Advertencia: No se pudo conectar a RabbitMQ:', errorMessage);
    console.warn('El servicio continuará sin publicar eventos');
  }

  console.log(`🎮 El servicio de jugadores está iniciando en el puerto ${port}...`);
  await app.listen(port);
  
  console.log(`🎮 El servicio de jugadores está ejecutándose en el puerto ${port}`);
}

bootstrap();

