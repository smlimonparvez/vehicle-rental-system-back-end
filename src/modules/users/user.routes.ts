import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { updateUserValidation } from './user.validation';

const router = Router();
const userController = new UserController();

// Get all users - Admin only
router.get(
  '/',
  authenticate,
  authorize('admin'),
  (req, res) => userController.getAllUsers(req, res)
);

// Update user - Both admin and customer can access, but with different permissions
// Admin: Can update any user
// Customer: Can only update their own profile (authorization check is in controller)
router.put(
  '/:userId',
  authenticate,  // FIXED: Removed authorize('admin') to allow customers to update themselves
  updateUserValidation,
  (req, res) => userController.updateUser(req, res)
);

// Delete user - Admin only
router.delete(
  '/:userId',
  authenticate,
  authorize('admin'),
  (req, res) => userController.deleteUser(req, res)
);

export default router;