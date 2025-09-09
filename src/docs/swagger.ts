import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";

const endpointsFiles = ["../routes/api.ts"];

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi Api ACARA",
    description: "Dokumentasi Api ACARA",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "local Server",
    },
    {
      url: "https://back-end-acara-gamma-ten.vercel.app/api",
      description: "Deploy Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "Adnan Progammer",
        password: "password123",
      },

      RegisterRequest: {
        fullName: "anaya",
        userName: "anaya",
        email: "anaya2025@yopmail.com",
        password: "123",
        confirmPassword: "123",
      },

      ActivationRequest: {
        code: "abcdef",
      },
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
