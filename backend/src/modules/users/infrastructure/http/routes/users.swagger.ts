/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Administrative user name
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: Administrative user email
 *           example: joao.silva@escola.com
 *         password:
 *           type: string
 *           format: password
 *           description: Administrative user password
 *           example: "senha123"
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated user ID (uuid)
 *           example: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name:
 *           type: string
 *           description: User name
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *           example: joao.silva@escola.com
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date the user was created
 *           example: 2023-01-01T10:00:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date the user was last updated
 *           example: 2023-01-01T10:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Administrative user management
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new administrative user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         description: Validation failed
 *       401:
 *         description: Unauthenticated
 *       409:
 *         description: Email already used by another user
 */
