import { Router } from "express";
import { AuthController } from "./auth.controller";
import { signupValidation, signinValidation } from './auth.validation';

const router = Router();
const authController = new AuthController();

router.post('/signup', signupValidation, (req, res) => authController.signup(req, res));
router.post('/signin', signupValidation, (req, res) => authController.signin(req, res));

export default router