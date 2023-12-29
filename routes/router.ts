import { Router } from 'express';
import {
  addComment,
  createUser,
  getUser,
  getProduct,
  productsList,
  updateFavProduct,
  getProductCategories,
  addSearchBase,
  getSearchBase,
  getProductSimple,
  getUserData,
  validateToken,
  updateUserData,
  getUserDataByID,
  getComments,
  postComment,
  deleteComment,
  getAdminUser,
  updateRole,
  deleteUser,
  getProducts,
  getProductAttributes,
  postAttributes,
  updateProductAttributes,
  updateProduct,
  postProducts,
  deleteProduct,
  getCategories,
  getSubcategories,
  getCategoriesByName,
  
} from '../controllers/controllers'; // , deleteUser, getUser, updateUser 
import asyncHandler from '../middlewares/errorHandler';
import authenticateJWT from '../middlewares/users';
//import userMiddleware from "../middlewares"; //, userMiddleware.validateRegister


const userRoute = () => {
  const router = Router();

  // users
  router.post('/users', asyncHandler(createUser));

  router.post('/validate', asyncHandler(validateToken));

  router.post("/login", asyncHandler(getUser));

  router.get('/users/:id', asyncHandler(getUserDataByID));

  router.put('/users/:id', authenticateJWT, asyncHandler(updateRole));

  router.delete('/users/:id', authenticateJWT, asyncHandler(deleteUser));

  router.get('/users', authenticateJWT, asyncHandler(getUser));

  router.get('/adminusers', authenticateJWT, asyncHandler(getAdminUser));

  router.get('/userdata', authenticateJWT, asyncHandler(getUserData));

  router.post('/userdata', authenticateJWT, asyncHandler(updateUserData));

  router.get('/search', asyncHandler(getProductSimple));

  router.delete('/adminproducts/:id', asyncHandler(deleteProduct));

  router.post('/adminproducts', asyncHandler(postProducts));

  router.get('/adminproducts', asyncHandler(getProducts));

  router.put('/adminproducts/:id', asyncHandler(updateProduct));

  // * productattributes

  router.get('/productsattributes/:id', asyncHandler(getProductAttributes));

  router.post('/attributes', asyncHandler(postAttributes));

  router.put('/productsattributes/:id', asyncHandler(updateProductAttributes));

  router.get('/products/:id', asyncHandler(getProduct));

  router.get('/categories/:id', asyncHandler(getCategoriesByName));

  router.post('/products/:id', authenticateJWT, asyncHandler(addComment));

  router.get('/products/categories/:categoryName', asyncHandler(productsList));

  router.get('/products/categories/:categoryName/:id', asyncHandler(productsList));

  router.patch('/favorites/:id', asyncHandler(updateFavProduct));

  router.get('/productsAttributes', asyncHandler(getProductCategories));

  router.post('/searchBase', asyncHandler(addSearchBase));

  router.get('/searchBase', asyncHandler(getSearchBase));

  router.get('/comments/:id', asyncHandler(getComments));

  router.post('/comments', authenticateJWT, asyncHandler(postComment));

  router.delete('/comments/:id', authenticateJWT, asyncHandler(deleteComment));

  router.get('/categories', asyncHandler(getCategories));

  router.get('/subcategories', asyncHandler(getSubcategories));

  return router;
};

export { userRoute };