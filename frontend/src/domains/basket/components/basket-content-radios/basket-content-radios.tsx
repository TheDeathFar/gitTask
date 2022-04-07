import React, { FC } from 'react';
import { BasketContent } from '#redux/reducers/slices/basket-slice';
import { UseFormFunctions } from '#components/app-input/interfaces/use-form-functions';
import { keyToLabelText } from '#src/js/util/key-to-label-text';
import { FieldPath } from 'react-hook-form';
import { CreateTradeofferDto } from '#server/common/dto/create-tradeoffer.dto';
import { ItemCard } from '#domains/items/components/item-card/item-card';

interface Props {
  name: FieldPath<CreateTradeofferDto>;
  basketContent: BasketContent;
  useForm: UseFormFunctions;
}

export const BasketContentRadios: FC<Props> = (props) => {
  const { basketContent, name, useForm: { register, errors } } = props;
  const basketValues = Object.values(basketContent);

  return (
    <div className={`uk-flex uk-flex-column uk-width-1-1 uk-width-2-3@s uk-height-1-1`}>
      <h3 className={`uk-text-muted uk-text-center uk-margin-top`}>{keyToLabelText.get(name)}</h3>
      <div className={`WithScrollbar uk-overflow-auto`}>
        {basketValues.map((item) => (
          // label, потому что так чекбокс будет кликабельным
          <label key={item.id} className={`uk-flex uk-flex-middle`}>
            <input {...register(name)} defaultChecked={basketValues.length === 1} value={item.id} type={`radio`} className={`uk-radio`} />
            <div className={`uk-padding-small uk-width-expand`}>
              <ItemCard item={item} isUserItem={name === `offered_item_id`} withItemActions={false} />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};