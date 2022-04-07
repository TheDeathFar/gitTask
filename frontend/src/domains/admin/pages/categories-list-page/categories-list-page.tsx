import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from '#redux/store';
import { useSelector } from 'react-redux';
import { categoriesListSelector, isCategoriesRequestPendingSelector } from '#redux/selectors';
import { Operations } from '#redux/operations/operations';
import { keyToLabelText } from '#src/js/util/key-to-label-text';
import { useShowCategoriesRequestError } from '#src/js/hooks/use-show-categories-request-error';
import { Link } from 'react-router-dom';
import { Actions } from '#components/actions/actions';

export const CategoriesListPage: FC = () => {
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const categoriesList = useSelector(categoriesListSelector);
  const isPending = useSelector(isCategoriesRequestPendingSelector);

  useEffect(() => {
    dispatch(Operations.getCategoriesList());
    setIsDispatched(true);
    // eslint-disable-next-line
  }, []);

  useShowCategoriesRequestError(isDispatched);

  if (!categoriesList)
    return null;

  if (!isPending && isDispatched && categoriesList?.length === 0)
    return (
      <div
        className={`uk-width-1-1 uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-text-center uk-padding-small`}>
        <h2 className={`uk-text-muted`}>Здесь будет список пользователей</h2>
      </div>
    );

  return (
    <div
      className={`WithScrollbar uk-overflow-auto uk-flex uk-flex-center uk-flex-wrap uk-padding-small uk-padding-remove-top`}>
      <div className={`uk-width-1-1 uk-width-1-2@m`}>
        <Actions>
          <Link to={`/admin/categories/add`} className={`uk-button uk-button-default uk-flex uk-flex-middle`}>
            <span className={`ItemsContainer-actionIcon`} uk-icon={`icon: plus`} />
            <span className={`uk-margin-small-left uk-visible@s`}>Категория</span>
          </Link>
        </Actions>
        <table className={`uk-table uk-table-striped uk-margin-remove-top`}>
          <thead>
          <tr>
            <th>{keyToLabelText.get(`id`)}</th>
            <th>{keyToLabelText.get(`name`)}</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          {(categoriesList) ? categoriesList.map((category) => (
            <tr key={category.id}>
              <td className={`uk-table-shrink`}>{category.id}</td>
              <td>{category.name}</td>
              <td className={`uk-table-shrink uk-text-right`}>
                <button className={`uk-link`} onClick={() => dispatch(Operations.deleteCategory(category.id))}
                        uk-icon={`trash`} />
              </td>
            </tr>
          )) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};