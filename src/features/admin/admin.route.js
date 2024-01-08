import express from 'express';
import { addEmployee, deleteEmployee, grantAdminAccess, renderAdminView, reviewForm, signOut, updateEmployee } from './admin.controller.js';



const router = express.Router();

router.get('/dashboard',renderAdminView);
router.post('/assign-review/:id',reviewForm);
router.post('/update/:id',updateEmployee);
router.post('/delete/:id',deleteEmployee);
router.post('/add-employee',addEmployee);
router.get('/signout',signOut);
router.post('/grant-admin-access/:id',grantAdminAccess);


export default router;
