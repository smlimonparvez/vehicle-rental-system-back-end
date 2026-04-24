import { Response } from 'express';
import { UserService } from './user.service';
import { sendSuccess, sendError } from '../../utils/response.utils';
import { AuthRequest } from '../../types';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const users = await userService.getAllUsers();
      return sendSuccess(res, 200, 'Users retrieved successfully', users);
    } catch (error: any) {
      return sendError(res, 500, error.message);
    }
  }

  async updateUser(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId);
      const currentUser = req.user!;

      // Check authorization: admin can update anyone, customer can only update self
      if (currentUser.role === 'customer' && currentUser.id !== userId) {
        return sendError(res, 403, 'Access denied. You can only update your own profile');
      }

      // Customers cannot change their own role
      if (currentUser.role === 'customer' && req.body.role) {
        return sendError(res, 403, 'Access denied. You cannot change your own role');
      }

      const user = await userService.updateUser(userId, req.body);
      return sendSuccess(res, 200, 'User updated successfully', user);
    } catch (error: any) {
      const statusCode = error.message === 'User not found' ? 404 : 400;
      return sendError(res, statusCode, error.message);
    }
  }

  async deleteUser(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = parseInt(req.params.userId);
      await userService.deleteUser(userId);
      return sendSuccess(res, 200, 'User deleted successfully');
    } catch (error: any) {
      const statusCode = error.message === 'User not found' ? 404 : 400;
      return sendError(res, statusCode, error.message);
    }
  }
}