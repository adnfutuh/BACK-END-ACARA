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
        identifier: "rizki@example.com",
        password: "Password123",
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
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        description: "",
        banner: "fileUrl",
        category: "category ObjectId",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinates: [0, 0],
        },
        isOnline: false,
        isFeatured: false,
      },
      RemoveMediaRequest: {
        fileUrl: "",
      },
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
