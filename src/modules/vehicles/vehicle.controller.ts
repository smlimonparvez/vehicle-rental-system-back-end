import { Request, Response } from 'express';
import { VehicleService } from './vehicle.service';
import { sendSuccess, sendError } from '../../utils/response.utils';

const vehicleService = new VehicleService();

export class VehicleController {
  async createVehicle(req: Request, res: Response): Promise<Response> {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      return sendSuccess(res, 201, 'Vehicle created successfully', vehicle);
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  }

  async getAllVehicles(req: Request, res: Response): Promise<Response> {
    try {
      const vehicles = await vehicleService.getAllVehicles();
      const message = vehicles.length > 0 ? 'Vehicles retrieved successfully' : 'No vehicles found';
      return sendSuccess(res, 200, message, vehicles);
    } catch (error: any) {
      return sendError(res, 500, error.message);
    }
  }

  async getVehicleById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.vehicleId as string, 10);
      const vehicle = await vehicleService.getVehicleById(id);
      
      if (!vehicle) {
        return sendError(res, 404, 'Vehicle not found');
      }

      return sendSuccess(res, 200, 'Vehicle retrieved successfully', vehicle);
    } catch (error: any) {
      return sendError(res, 500, error.message);
    }
  }

  async updateVehicle(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.vehicleId as string, 10);
      const vehicle = await vehicleService.updateVehicle(id, req.body);
      return sendSuccess(res, 200, 'Vehicle updated successfully', vehicle);
    } catch (error: any) {
      const statusCode = error.message === 'Vehicle not found' ? 404 : 400;
      return sendError(res, statusCode, error.message);
    }
  }

  async deleteVehicle(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.vehicleId as string, 10);
      await vehicleService.deleteVehicle(id);
      return sendSuccess(res, 200, 'Vehicle deleted successfully');
    } catch (error: any) {
      const statusCode = error.message === 'Vehicle not found' ? 404 : 400;
      return sendError(res, statusCode, error.message);
    }
  }
}