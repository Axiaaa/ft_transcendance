import { Tournament } from "./tournaments";

  const withError = (config: { max: number; timeWindow: string }) => ({
    ...config,
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Too many request, please try again later',
    }),
  });

export const RateLimits = {
    login: withError({ max: 10, timeWindow: '1 minute' }),
    getUsers: withError({ max: 20, timeWindow: '2 minutes' }),
    heavyApi: withError({ max: 5, timeWindow: '1 minute' }),
    signup: withError({max : 5, timeWindow: '1 minute'}),
    patch_user: withError({max : 10, timeWindow: '1 minute'}),
    delete_user: withError({max : 5, timeWindow: '1 minute'}),
    friends: withError({max : 50, timeWindow: '1 minute'}),
    Tournament: withError({max : 20, timeWindow: '1 minute'}),
    matchs: withError({max : 20, timeWindow: '1 minute'}),
  };