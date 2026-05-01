/**
 * User routes for TestMind API
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateCreateUser, validateUpdateUser } = require('../middleware/validation');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/email/:email', userController.getUserByEmail);
router.get('/username/:username', userController.getUserByUsername);
router.get('/search', userController.searchUsers);
router.get('/active', userController.getActiveUsers);
router.get('/recent', userController.getRecentUsers);
router.get('/count', userController.getUserCount);
router.post('/', validateCreateUser, userController.createUser);
router.put('/:id', validateUpdateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/activate', userController.activateUser);
router.patch('/:id/deactivate', userController.deactivateUser);

module.exports = router;
