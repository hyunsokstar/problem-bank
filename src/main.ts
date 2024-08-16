// src\main.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // 여러 주소를 포함하는 CORS 설정
//   const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://192.168.219.168:3000',
//     'http://52.79.208.201:3000', 'http://15.164.149.51:3000'];

//   app.enableCors({
//     origin: allowedOrigins,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
//   });

//   const config = new DocumentBuilder()
//     .setTitle('Sweet Dream Edu Api')
//     .setDescription('Sweet Dream Edu Api API description')
//     .setVersion('1.0')
//     .build();
//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document, {
//     swaggerOptions: {
//       docExpansion: 'none', // 모든 엔드포인트가 처음 로드될 때 접힌 상태로 설정
//     },
//   });

//   await app.listen(8080);
// }
// bootstrap();

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 여러 주소를 포함하는 CORS 설정
  const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://192.168.219.168:3000',
    'http://52.79.208.201:3000', 'http://15.164.149.51:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  // 전역 접두사 설정
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Sweet Dream Edu Api')
    .setDescription('Sweet Dream Edu Api API description')
    .setVersion('1.0')
    .addTag('api/')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  await app.listen(8080);
}
bootstrap();
