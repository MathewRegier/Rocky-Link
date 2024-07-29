import express from 'express';
import multer from 'multer';
import { addLead, getLeads, bulkAddLeads } from '../controllers/leadController.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // Save uploaded files to 'uploads' folder

router.post('/leads', addLead);  // Handling POST requests
router.get('/leads', getLeads);  // Handling GET requests
router.post('/leads/bulk', upload.single('file'), bulkAddLeads);

export default router;
