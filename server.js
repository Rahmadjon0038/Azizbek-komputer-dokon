const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const db = require('./config/db');
const authRoutes = require('./routers/auth');
const catalogRoutes = require('./routers/catalog');

dotenv.config();
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Azizbek Dokon API',
      version: '1.0.0',
      description: 'E-commerce backend API with authentication',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            fullName: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routers/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/', (req, res) => {
	res.json({ ok: true, message: 'Azizbek-dokon-backend ishlayapti' });
});

app.use('/auth', authRoutes);
app.use('/api', catalogRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`✅ Server ishga tushdi: http://localhost:${PORT}`);
	console.log(`📚 Swagger hujjatlar: http://localhost:${PORT}/api-docs`);
});
