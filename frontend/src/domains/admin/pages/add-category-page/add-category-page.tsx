import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '#redux/store';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { CreateCategoryDto } from '#server/common/dto/create-category.dto';
import { useShowCategoriesRequestError } from '#src/js/hooks/use-show-categories-request-error';
import { categoriesRequestErrorSelector, isCategoriesRequestPendingSelector } from '#redux/selectors';
import { useSelector } from 'react-redux';
import { AppInput } from '#components/app-input/app-input';
import { Operations } from '#redux/operations/operations';

export const AddCategoryPage: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const isPending = useSelector(isCategoriesRequestPendingSelector);
  const categoriesRequestError = useSelector(categoriesRequestErrorSelector);

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<CreateCategoryDto>({
    resolver: classValidatorResolver(CreateCategoryDto),
  });

  const onSubmit = handleSubmit((data) => {
    dispatch(Operations.createCategory(data));
  });

  useShowCategoriesRequestError(isSubmitSuccessful);

  useEffect(() => {
    if (isSubmitSuccessful && !categoriesRequestError && !isPending) {
      history.push(`/admin/categories`);
    }
  }, [categoriesRequestError, isPending, isSubmitSuccessful, history]);

  return (
    <div className={`uk-flex uk-flex-column uk-margin-auto-vertical uk-flex-middle uk-width-1-1`}>
      <div className={`uk-card uk-card-default uk-card-body uk-width-5-6 uk-width-1-2@m`}>
        <h1 className={`uk-card-title`}>Создание категории</h1>

        <form className={``}
              onSubmit={onSubmit}>

          <AppInput
            name={`name`}
            inputProps={{
              placeholder: `Одежда`,
            }}
            options={{
              icon: `hashtag`,
            }}
            useForm={{ register, errors }}
          />

          <div className={`uk-margin-top`} uk-grid={``}>
            <div>
              <Link
                to={`/items`}
                className={`uk-button uk-button-default`}
              >
                Отмена
              </Link>
            </div>
            <div className={`uk-width-expand`}>
              <button disabled={isPending} className={`uk-button uk-button-primary uk-width-1-1`}>Создать</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};