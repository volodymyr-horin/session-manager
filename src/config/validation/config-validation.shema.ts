import * as Joi from 'joi';
import { Environment } from '@src/common/enums/environment.enum';

// Helper functions
const stringEnum = (targetEnum: Record<string, string>) =>
  Joi.string().valid(...Object.values(targetEnum));

// Validation schema
export const ConfigValidationSchema = Joi.object({
  NODE_ENV: stringEnum(Environment),
  PORT: Joi.number(),
  LOG_LEVELS: Joi.string(),
  POSTGRES_CONNECTION_STRING: Joi.string(),
  REDIS_CONNECTION_STRING: Joi.string(),
  JWT_SECRET: Joi.string().required(),
});
