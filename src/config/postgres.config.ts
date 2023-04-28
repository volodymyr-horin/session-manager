import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { parse } from 'pg-connection-string';

export default registerAs('postgres', () => {
  const postgresConfig = parse(process.env.POSTGRES_CONNECTION_STRING);

  return {
    type: 'postgres',
    host: postgresConfig.host,
    port: parseInt(postgresConfig.port, 10),
    database: postgresConfig.database,
    username: postgresConfig.user,
    password: postgresConfig.password,
    autoLoadEntities: true,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
});
