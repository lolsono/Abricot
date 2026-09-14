import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
} from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Crée un nouveau compte utilisateur.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               name:
 *                 type: string
 *                 example: Jean Dupont
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: L'utilisateur existe déjà
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Connexion d'un utilisateur
 *     description: Authentifie un utilisateur et retourne un token JWT.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post("/login", login);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     tags:
 *       - Authentification
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     description: Retourne les informations du profil de l'utilisateur authentifié.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         description: Token JWT manquant ou invalide
 *       404:
 *         description: Utilisateur introuvable
 */
router.get("/profile", authenticateToken, getProfile);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     tags:
 *       - Authentification
 *     summary: Mettre à jour le profil de l'utilisateur connecté
 *     description: Permet de modifier le nom et/ou l'adresse email de l'utilisateur connecté.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nouveau nom de l'utilisateur
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nouvelle adresse email
 *                 example: jean.dupont@example.com
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token JWT manquant ou invalide
 *       409:
 *         description: Cette adresse email est déjà utilisée
 */
router.put("/profile", authenticateToken, updateProfile);

/**
 * @swagger
 * /auth/password:
 *   put:
 *     tags:
 *       - Authentification
 *     summary: Mettre à jour le mot de passe de l'utilisateur connecté
 *     description: Permet à l'utilisateur connecté de modifier son mot de passe.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe actuel
 *                 example: OldPassword123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: Nouveau mot de passe
 *                 example: NewPassword456!
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Token JWT invalide ou mot de passe actuel incorrect
 */
router.put("/password", authenticateToken, updatePassword);

export default router;
