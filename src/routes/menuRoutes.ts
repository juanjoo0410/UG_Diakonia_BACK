import { Router } from 'express';
import {
    createMenu,
    getMenus,
    getMenuById,
    updateMenu,
    deleteMenu
} from '../controllers/menuController';

const router = Router();

router.post('/', createMenu);
router.get('/', getMenus);
router.get('/:id', getMenuById);
router.put('/:id', updateMenu);
router.delete('/:id', deleteMenu);

export default router;