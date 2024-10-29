// app.config.js

export default ({ config }) => ({
    ...config,
    extra: {
      openaiApiKey: process.env.OPENAI_API_KEY, // Hämtar API-nyckeln från process.env
    },
  });
  