import { Router } from 'express';
import { 
  addComment, 
  createUser, 
  getUser, 
  getProduct, 
  productsList, 
  updateFavProduct
} from '../controllers/controllers'; // , deleteUser, getUser, updateUser 
import asyncHandler from '../middlewares/errorHandler';
import authenticateJWT from '../middlewares/users';
//import userMiddleware from "../middlewares"; //, userMiddleware.validateRegister


const userRoute = () => {
  const router = Router();

  // users
  router.post('/users', asyncHandler(createUser));

  // router.post("/login", userController.login);
  router.get('/users', asyncHandler(getUser));

  // router.get('/users', asyncHandler(getUser));

  // router.patch('/users/:id', asyncHandler(updateUser));

  // router.delete('/users/:id', asyncHandler(deleteUser));

  router.get('/products/:id', asyncHandler(getProduct));

  router.post('/products/:id', authenticateJWT, asyncHandler(addComment));

  router.get('/products/categories/:categoryName', asyncHandler(productsList));

  router.patch('/favorites/:id', asyncHandler(updateFavProduct));

  return router;
};

export { userRoute };