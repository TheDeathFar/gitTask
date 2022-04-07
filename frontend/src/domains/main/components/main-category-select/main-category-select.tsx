import React, { FC } from 'react';
import { categoriesRequestErrorSelector, categoriesListSelector, isCategoriesRequestPendingSelector } from '#redux/selectors';
import { useSelector } from 'react-redux';
import { keyToLabelText } from '#src/js/util/key-to-label-text';
import InputHint from '#components/input-hint/input-hint';
import { UseFormFunctions } from '#components/app-input/interfaces/use-form-functions';
import { useLoadCategoriesList } from '#src/js/hooks/use-load-categories-list';

export const MainCategorySelect: FC<{
  name: `item_category_id` | `trade_category_id`,
  useForm: UseFormFunctions
}> = ({ name, useForm: { register, errors } }) => {
  const isPending = useSelector(isCategoriesRequestPendingSelector);
  const categories = useSelector(categoriesListSelector);
  const error = useSelector(categoriesRequestErrorSelector);

  useLoadCategoriesList();

  return (
    <div className={`uk-inline uk-width-expand uk-margin-small uk-margin-remove-top`}>
      <div className='uk-flex uk-form-label'>
        <span>{keyToLabelText.get(name) ?? `unknown`}</span>
      </div>
      <div className={`uk-position-relative`}>
        <span className={`uk-form-icon`} uk-icon={`icon: hashtag`} />
        {
          (isPending)
            ? (
              <input className={`uk-input`} disabled={true} value={`Загрузка...`} />
            )
            : (!categories)
              ? (
                <input className={`uk-input`} disabled={true} value={`Ошибка`} />
              )
              : (
                <select
                  className={`uk-input uk-select${(errors[name]) ? ` uk-form-danger` : ``}`}
                  {...register(name)}
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              )
        }

        <InputHint
          text={errors[name]?.message}
          className={`uk-position-center-right-out`}
          isActive={!!errors[name]}
        />
      </div>
    </div>
  );
};