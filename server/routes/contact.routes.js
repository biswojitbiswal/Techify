import express from 'express'
import { Router } from 'express'
import authVerify from '../middleware/auth.middleware.js';
import { contactData } from '../controllers/contact.controller.js';

const router = Router();

router.route("/send").post(authVerify, contactData)

export default router