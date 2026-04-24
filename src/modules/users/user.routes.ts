import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { updateUserValidation } from './user.validation';

const router = Router();
const userController = new UserController();

router.get(
  '/',
  authenticate,
  authorize('admin'),
  (req, res) => userController.getAllUsers(req, res)
);

router.put(
  '/:userId',
  authenticate,
  updateUserValidation,
  (req, res) => userController.updateUser(req, res)
);

router.delete(
  '/:userId',
  authenticate,
  authorize('admin'),
  (req, res) => userController.deleteUser(req, res)
);

export default router;