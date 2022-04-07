import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginOperation } from '#redux/operations/slices/login-operation';
import { registrationOperation } from '#redux/operations/slices/registration-operation';
import { editProfileOperation } from '#redux/operations/slices/edit-profile-operation';
import { setPhotoOperation } from '#redux/operations/slices/set-photo-operation';
import { changePasswordOperation } from '#redux/operations/slices/change-password-operation';
import { getUserItemsListOperation } from '#redux/operations/slices/get-user-items-list-operation';
import { deleteItemOperation } from '#redux/operations/slices/delete-item-operation';
import { getCategoriesListOperation } from '#redux/operations/slices/get-categories-list-operation';
import { createItemOperation } from '#redux/operations/slices/create-item-operation';
import { editItemOperation } from '#redux/operations/slices/edit-item-operation';
import { setItemPhotosOperation } from '#redux/operations/slices/set-item-photos-operation';
import { getAccountsListOperation } from '#redux/operations/slices/get-accounts-list-operation';
import { deleteAccountOperation } from '#redux/operations/slices/delete-account-operation';
import { deleteCategoryOperation } from '#redux/operations/slices/delete-category-operation';
import { createCategoryOperation } from '#redux/operations/slices/create-category-operation';
import { loadCatalogueOperation } from '#redux/operations/slices/load-catalogue-operation';
import { deleteCatalogueItemOperation } from '#redux/operations/slices/delete-catalogue-item-operation';
import { getItemOperation } from '#redux/operations/slices/get-item-operation';
import { checkUserExistenceOperation } from '#redux/operations/slices/check-user-existence-operation';
import { loadRecommendationsOperation } from '#redux/operations/slices/load-recommendations-operation';
import { resetUserItemsOperation } from '#redux/operations/slices/reset-user-items-operation';
import { createTradeOperation } from '#redux/operations/slices/create-trade-operation';
import { resetUserTradesOperation } from '#redux/operations/slices/reset-user-trades-operation';
import { cancelTradeOperation } from '#redux/operations/slices/cancel-trade-operation';
import { getUserOwnedTradesOperation } from '#redux/operations/slices/get-user-owned-trades-list-operation';
import { getUserIncomingTradesOperation } from '#redux/operations/slices/get-user-incoming-trades-list-operation';
import { acceptTradeOperation } from '#redux/operations/slices/accept-trade-operation';

export const Operations = {
  resetUserItems: createAsyncThunk(
    `resetUserItems`,
    resetUserItemsOperation,
  ),
  resetUserTrades: createAsyncThunk(
    `resetUserTrades`,
    resetUserTradesOperation,
  ),
  login: createAsyncThunk(
    `login`,
    loginOperation,
  ),
  registration: createAsyncThunk(
    `registration`,
    registrationOperation,
  ),
  editProfile: createAsyncThunk(
    `editProfile`,
    editProfileOperation,
  ),
  setPhoto: createAsyncThunk(
    `setPhoto`,
    setPhotoOperation,
  ),
  changePassword: createAsyncThunk(
    `changePassword`,
    changePasswordOperation,
  ),
  getUserItemsList: createAsyncThunk(
    `getUserItemsList`,
    getUserItemsListOperation,
  ),
  deleteItem: createAsyncThunk(
    `deleteItem`,
    deleteItemOperation,
  ),
  getCategoriesList: createAsyncThunk(
    `getCategoriesList`,
    getCategoriesListOperation,
  ),
  createItem: createAsyncThunk(
    `createItem`,
    createItemOperation,
  ),
  editItem: createAsyncThunk(
    `editItem`,
    editItemOperation,
  ),
  setItemPhotos: createAsyncThunk(
    `setItemPhotos`,
    setItemPhotosOperation,
  ),
  getAccountsList: createAsyncThunk(
    `getAccountsList`,
    getAccountsListOperation,
  ),
  deleteAccount: createAsyncThunk(
    `deleteAccount`,
    deleteAccountOperation,
  ),
  deleteCategory: createAsyncThunk(
    `deleteCategory`,
    deleteCategoryOperation,
  ),
  createCategory: createAsyncThunk(
    `createCategory`,
    createCategoryOperation,
  ),
  loadCatalogue: createAsyncThunk(
    `loadCatalogue`,
    loadCatalogueOperation,
  ),
  deleteCatalogueItem: createAsyncThunk(
    `deleteCatalogueItem`,
    deleteCatalogueItemOperation,
  ),
  getItem: createAsyncThunk(
    `getItem`,
    getItemOperation,
  ),
  checkUserExistence: createAsyncThunk(
    `checkUserExistence`,
    checkUserExistenceOperation,
  ),
  loadRecommendations: createAsyncThunk(
    `loadRecommendations`,
    loadRecommendationsOperation,
  ),
  createTrade: createAsyncThunk(
    `createTrade`,
    createTradeOperation,
  ),
  cancelTrade: createAsyncThunk(
    `cancelTrade`,
    cancelTradeOperation,
  ),
  getUserOwnedTrades: createAsyncThunk(
    `getUserOwnedTrades`,
    getUserOwnedTradesOperation,
  ),
  getUserIncomingTrades: createAsyncThunk(
    `getUserIncomingTrades`,
    getUserIncomingTradesOperation,
  ),
  acceptTrade: createAsyncThunk(
    `acceptTrade`,
    acceptTradeOperation,
  ),

};