import { Request, Response } from "express";
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from "../../utils/response.utils";

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response): Promise<Response> {
    try {
      const user = await authService.signup(req.body);
      return sendSuccess(res, 201, "User registered successfully", user);
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  }

  async signin(req: Request, res: Response): Promise<Response> {
    try {
      const result = await authService.signin(req.body);
      return sendSuccess(res, 200, "login successfully", result);
    } catch (error: any) {
      return sendError(res, 401, error.message);
    }
  }
}
