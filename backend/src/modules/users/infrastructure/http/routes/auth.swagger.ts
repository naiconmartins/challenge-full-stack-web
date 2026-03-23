/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Administrative user email
 *           example: admin@escola.com
 *         password:
 *           type: string
 *           format: password
 *           description: Administrative user password
 *           example: "senha123"
 *     TokenResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: JWT token for authenticating subsequent requests
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjAwMTYzOTMsImV4cCI6MTcyMDEwMjc5Mywic3ViIjoiNDhhNmVhODUtMDRmNS00NGRjLWExOTItZjQ3MDMwNzg2M2RmIn0.i2e7TQ5dSY7dhdL0kldySVOeYiLHC75OVo7P4yvBGmw
 *     MeResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [ADMINISTRATIVE]
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Administrative user authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate an administrative user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       422:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Invalidate the current access token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Token successfully revoked
 *       401:
 *         description: Token is missing or invalid
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Return authenticated user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Token is missing or invalid
 */
