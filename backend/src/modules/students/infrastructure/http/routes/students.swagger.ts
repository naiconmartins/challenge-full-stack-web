/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStudentRequest:
 *       type: object
 *       required:
 *         - ra
 *         - name
 *         - email
 *         - cpf
 *       properties:
 *         ra:
 *           type: string
 *           description: Student registration number (unique, not editable after creation)
 *           example: "20230001"
 *         name:
 *           type: string
 *           description: Student full name (at least two words, max 100 characters)
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: Student email
 *           example: joao.silva@escola.com
 *         cpf:
 *           type: string
 *           description: Student CPF (unique, not editable after creation)
 *           example: "529.982.247-25"
 *     UpdateStudentRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: Student full name (at least two words, max 100 characters)
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: Student email
 *           example: joao.silva@escola.com
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated student ID (uuid)
 *           example: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         ra:
 *           type: string
 *           description: Student registration number
 *           example: "20230001"
 *         name:
 *           type: string
 *           description: Student full name
 *           example: João Silva
 *         email:
 *           type: string
 *           format: email
 *           description: Student email
 *           example: joao.silva@escola.com
 *         cpf:
 *           type: string
 *           description: Student CPF
 *           example: "529.982.247-25"
 *         created_by:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the user who created the student record
 *           example: 48a6ea85-04f5-44dc-a192-f47030786
 *         updated_by:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: ID of the user who last updated the student record
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Date the student record was created
 *           example: 2023-01-01T10:00:00Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Date the student record was last updated
 *           example: 2023-01-01T10:00:00Z
 *     StudentListResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Student'
 *         total:
 *           type: integer
 *           description: Total number of students
 *           example: 150
 *         current_page:
 *           type: integer
 *           description: Current page number
 *           example: 1
 *         per_page:
 *           type: integer
 *           description: Number of items per page
 *           example: 15
 *         last_page:
 *           type: integer
 *           description: Last page number
 *           example: 10
 */

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student registration management
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Student successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthenticated
 *       409:
 *         description: A student with this CPF, RA or email already exists
 *       422:
 *         description: Validation failed
 */

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student's name and email
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudentRequest'
 *     responses:
 *       200:
 *         description: Student successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Student not found
 *       409:
 *         description: A student with this email already exists
 *       422:
 *         description: Validation failed
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: List students with pagination and optional filtering
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 15
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [name, created_at]
 *         description: Field to sort by
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter by name, RA or CPF
 *     responses:
 *       200:
 *         description: Students listed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentListResponse'
 *       401:
 *         description: Unauthenticated
 *       422:
 *         description: Validation failed
 */

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Student not found
 *       422:
 *         description: Validation failed
 */

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Student ID
 *     responses:
 *       204:
 *         description: Student successfully deleted
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Student not found
 *       422:
 *         description: Validation failed
 */
