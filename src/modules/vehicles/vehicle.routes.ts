import { Router } from 'express';
import { VehicleController } from './vehicle.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { createVehicleValidation, updateVehicleValidation } from './vehicle.validation';

const router = Router();
const vehicleController = new VehicleController();

router.post(
  '/',
  authenticate,
  authorize('admin'),
  createVehicleValidation,
  (req, res) => vehicleController.createVehicle(req, res)
);

router.get('/', (req, res) => vehicleController.getAllVehicles(req, res));

router.get('/:vehicleId', (req, res) => vehicleController.getVehicleById(req, res));

router.put(
  '/:vehicleId',
  authenticate,
  authorize('admin'),
  updateVehicleValidation,
  (req, res) => vehicleController.updateVehicle(req, res)
);

router.delete(
  '/:vehicleId',
  authenticate,
  authorize('admin'),
  (req, res) => vehicleController.deleteVehicle(req, res)
);

export default router;