import { useAppDispatch } from '#redux/store';
import { useSelector } from 'react-redux';
import { categoriesListSelector, isCategoriesRequestPendingSelector } from '#redux/selectors';
import { useEffect } from 'react';
import { Operations } from '#redux/operations/operations';

export const useLoadCategoriesList = (): void => {
  const dispatch = useAppDispatch();
  const isPending = useSelector(isCategoriesRequestPendingSelector);
  const categories = useSelector(categoriesListSelector);

  useEffect(() => {
    if (!isPending && !categories) {
      dispatch(Operations.getCategoriesList());
    }
  }, [isPending, categories, dispatch]);
};