import type { INestApplication } from '@nestjs/common';

import { getErrorMessage } from '#src/shared/get-error-message.util';

export type CorsConfig = {
  origins: string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
};

function createCorsConfig(): CorsConfig {
  const envOrigins = process.env.CORS_ORIGINS;

  if (!envOrigins?.trim()) {
    throw new Error(
      `CORS_ORIGINS environment variable is required.
      \nExample: CORS_ORIGINS=http://localhost:3000,https://yourdomain.com`,
    );
  }

  const origins = envOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one valid origin');
  }

  origins.forEach((origin) => {
    try {
      new URL(origin);
    } catch {
      throw new Error(`Invalid CORS origin: ${origin}`);
    }
  });

  return {
    origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  };
}

/**
 * Configures CORS for the NestJS application with environment-based origins
 */
export function configureCors(app: INestApplication): void {
  try {
    const corsConfig = createCorsConfig();

    app.enableCors({
      origin: corsConfig.origins,
      methods: corsConfig.methods,
      allowedHeaders: corsConfig.allowedHeaders,
      credentials: corsConfig.credentials,
    });

    console.log('CORS configured for origins:', corsConfig.origins);
  } catch (error: unknown) {
    console.error('CORS configuration failed:', getErrorMessage(error));
    process.exit(1);
  }
}
