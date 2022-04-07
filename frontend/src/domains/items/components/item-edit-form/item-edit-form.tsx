import React, { FC, useEffect } from 'react';
import { AppInput } from '#components/app-input/app-input';
import { AppTextarea } from '#components/app-textarea/app-textarea';
import { MainCategorySelect } from '#domains/main/components/main-category-select/main-category-select';
import { FieldPath, useForm } from 'react-hook-form';
import { EditItemDto } from '#server/common/dto/edit-item.dto';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ItemDto } from '#server/common/dto/item.dto';
import { Operations } from '#redux/operations/operations';
import { useSelector } from 'react-redux';
import { currentItemErrorSelector, isCurrentItemRequestPendingSelector } from '#redux/selectors';
import { useAppDispatch } from '#redux/store';
import { useHistory } from 'react-router-dom';
import { useShowItemsRequestError } from '#src/js/hooks/use-show-items-request-error';

interface Props {
  item: ItemDto;
}

export const ItemEditForm: FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isPending = useSelector(isCurrentItemRequestPendingSelector);
  const itemRequestError = useSelector(currentItemErrorSelector);

  const { register, handleSubmit, formState: { errors, isSubmitSuccessful }, setValue } = useForm<EditItemDto>({
    resolver: classValidatorResolver(EditItemDto),
    defaultValues: {
      id: item?.id,
    },
  });

  useEffect(() => {
    if (item) {
      setValue(`id`, item.id);
      setValue(`name`, item.name);
      setValue(`description`, item.description);
      setValue(`geo`, item.geo);
      setValue(`item_category_id`, item.item_category.id);
      setValue(`trade_category_id`, item.trade_category.id);
    }
  }, [item, setValue]);

  useEffect(() => {
    if (isSubmitSuccessful && !isPending && !itemRequestError) {
      history.goBack();
    }
  }, [isSubmitSuccessful, isPending, itemRequestError, history, item]);

  const onSubmit = handleSubmit((data) => {
    dispatch(Operations.editItem(data));
  });

  useShowItemsRequestError(isSubmitSuccessful);

  if (!item)
    return null;

  return (
    <form onSubmit={onSubmit}>
      <input className={`uk-hidden`} {...register(`id`)} />

      <AppInput
        name={`name`}
        inputProps={{
          placeholder: `Куртка`,
        }}
        options={{
          icon: `tag`,
        }}
        useForm={{ register, errors }}
      />

      <AppTextarea
        name={`description`}
        textareaProps={{
          placeholder: `Не стирана, не крашена. 100%.`,
        }}
        useForm={{ register, errors }}
      />

      <AppInput
        name={`geo`}
        inputProps={{
          placeholder: `Воронеж`,
        }}
        options={{
          icon: `location`,
        }}
        useForm={{ register, errors }}
      />

      <div className={`uk-child-width-1-1 uk-child-width-expand@s`} uk-grid={`margin: uk-margin-small`}>
        <div>
          <MainCategorySelect name={`item_category_id`} useForm={{ register, errors }} />
        </div>
        <div>
          <MainCategorySelect name={`trade_category_id`} useForm={{ register, errors }} />
        </div>
      </div>

      <div className={`uk-margin-top`}>
        <div className={`uk-flex uk-flex-right`}>
          <button type={`button`} className={`uk-button uk-button-default`}
                  onClick={() => {
                    if (history.length > 1) {
                      history.goBack();
                    } else {
                      history.push(`/items/${item?.id}`);
                    }
                  }}>
            Назад
          </button>
          <div className={`uk-width-expand`}>
            <button className={`uk-button uk-button-primary uk-margin-left uk-width-1-1`}
                    disabled={isPending}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};