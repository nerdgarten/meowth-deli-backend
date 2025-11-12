import { apiReference } from '@scalar/express-api-reference';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { type Express } from "express";
import { StatusCodes } from "http-status-codes";
import swaggerJsdoc from "swagger-jsdoc";

import { RouterManager } from "@/routes";

const allowedOrigins = [
  "http://localhost:3000",
  "https://meowth.borworntat.com",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Meowth Deli API',
      version: '1.0.0',
      description: 'API documentation for Meowth Deli Backend',
    },
    servers: [
      {
        url: 'http://localhost:3030',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Add paths to files with JSDoc comments if needed
};

const specs = swaggerJsdoc(swaggerOptions);

const app: Express = express();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

app.use('/api-docs', apiReference({
  spec: {
    url: '/openapi.json',
  },
}));

const routerManager = new RouterManager();

app.use(routerManager.getRouter());
app.get("/healthz", (req, res) => {
  res.status(StatusCodes.OK).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default app;
