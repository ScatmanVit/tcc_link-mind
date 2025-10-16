import PrivateCategoriesUserControllers from "../../../../controllers/private/user/categories/private.categories.controllers.js";
import { Router } from "express";
const router = Router()

router.post('/category/create', PrivateCategoriesUserControllers.category_create_Controller_POST)
router.get('/categories/list', PrivateCategoriesUserControllers.categories_list_Controller_GET)

export default router 