/**
 * @file projectRoutes.js
 * @description Deklarasi rute Express untuk manipulasi spesifik endpoints Proyek 
 * dan mem-bindnya ke controller-controller yang sesuai.
 */

import express from 'express';
import { getProjects, createProject, updateProject, deleteProject, getProjectMetadata } from '../controllers/projectController.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/metadata', getProjectMetadata);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
