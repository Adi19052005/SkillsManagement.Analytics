import { Router } from 'express';

import { allocationEngineController } from './controller';

import {
  generateAllocationValidator,
} from './validators';

const router = Router();

router.post(
  '/generate',
  generateAllocationValidator,
  allocationEngineController.generate
);

export default router;