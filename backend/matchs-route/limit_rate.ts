
  const withError = (config: { max: number; timeWindow: string }) => ({
    ...config,
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: 'Too many request, please try again later',
    }),
  });

// Original rate limits (commented out for testing)
// export const RateLimits = {
//   login: withError({ max: 15, timeWindow: '1 minute' }),
//   getUsers: withError({ max: 50, timeWindow: '2 minutes' }),
//   heavyApi: withError({ max: 20, timeWindow: '1 minute' }),
//   signup: withError({max : 10, timeWindow: '1 minute'}),
//   patch_user: withError({max : 40, timeWindow: '1 minute'}),
//   delete_user: withError({max : 20, timeWindow: '1 minute'}),
//   friends: withError({max : 90, timeWindow: '1 minute'}),
//   Tournament: withError({max : 20, timeWindow: '1 minute'}),
//   matchs: withError({max : 20, timeWindow: '1 minute'}),
//   upload: withError({max : 20, timeWindow: '1 minute'})
// };

// Temporarily disabled rate limits for testing
export const RateLimits = {
  login: withError({ max: 100, timeWindow: '1 minute' }),
  getUsers: withError({ max: 100, timeWindow: '1 minutes' }),
  heavyApi: withError({ max: 1000, timeWindow: '1 minute' }),
  signup: withError({ max: 100, timeWindow: '1 minute' }),
  patch_user: withError({ max: 100, timeWindow: '1 minute' }),
  delete_user: withError({ max: 100, timeWindow: '1 minute' }),
  friends: withError({ max: 1000, timeWindow: '1 minute' }),
  Tournament: withError({ max: 100, timeWindow: '1 minute' }),
  matchs: withError({ max: 100, timeWindow: '1 minute' }),
  upload: withError({ max: 100, timeWindow: '1 minute' })
};