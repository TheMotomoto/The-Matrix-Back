export const healthService = {
    getStatus: async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    },
  };