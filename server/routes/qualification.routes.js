import express from 'express';
import * as controller from '../controllers/qualification.controller.js';

const router = express.Router();

router.route('/')
  .get(controller.list)
  .post(controller.create)
  .delete(controller.removeAll);

router.route('/:id')
  .get(controller.read)
  .put(controller.update)
  .delete(controller.remove);

export default router;
