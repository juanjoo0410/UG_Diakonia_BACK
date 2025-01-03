import { Router } from 'express';
import {
    createSubmenu,
    getSubmenus,
    getSubmenusByIdMenu,
    getSubmenuById,
    updateSubmenu,
    deleteSubmenu
} from '../controllers/submenuController';

const router = Router();

router.post('/', createSubmenu);
router.get('/', getSubmenus);
router.get('/:idMenu', getSubmenusByIdMenu);
router.get('/:id', getSubmenuById);
router.put('/:id', updateSubmenu);
router.delete('/:id', deleteSubmenu);

export default router;