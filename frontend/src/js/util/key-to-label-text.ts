import { CreateUserDto } from '#server/common/dto/create-user.dto';
import { FieldPath } from 'react-hook-form';
import { EditProfileDto } from '#server/common/dto/edit-profile.dto';
import { CreateItemDto } from '#server/common/dto/create-item.dto';
import { ChangePasswordDto } from '#server/common/dto/change-password.dto';
import { UserDto } from '#server/common/dto/user.dto';
import { CreateTradeofferDto } from '#server/common/dto/create-tradeoffer.dto';

export type AvailableTranslations =
  FieldPath<CreateUserDto> |
  FieldPath<EditProfileDto> |
  FieldPath<ChangePasswordDto> |
  FieldPath<CreateItemDto> |
  FieldPath<UserDto> |
  FieldPath<CreateTradeofferDto> |
  `passwordConfirmation`;

export const keyToLabelText = new Map<AvailableTranslations, string>();

keyToLabelText.set(`id`, `Id`);
keyToLabelText.set(`role`, `Роль`);

keyToLabelText.set(`username`, `Имя пользователя`);
keyToLabelText.set(`email`, `Почта`);
keyToLabelText.set(`password`, `Пароль`);
keyToLabelText.set(`passwordConfirmation`, `Подтверждение пароля`);
keyToLabelText.set(`firstName`, `Ваше имя`);
keyToLabelText.set(`phone`, `Телефон`);
keyToLabelText.set(`birthday`, `Дата рождения`);
keyToLabelText.set(`photoPath`, `Фотография`);

keyToLabelText.set(`oldPassword`, `Старый пароль`);
keyToLabelText.set(`newPassword`, `Новый пароль`);
keyToLabelText.set(`newPasswordConfirmation`, `Подтверждение пароля`);

keyToLabelText.set(`name`, `Название`);
keyToLabelText.set(`description`, `Описание`);
keyToLabelText.set(`geo`, `Местоположение`);
keyToLabelText.set(`item_category_id`, `Категория вещи`);
keyToLabelText.set(`trade_category_id`, `Хочу поменять на`);
keyToLabelText.set(`photosPaths`, `Фотографии`);

keyToLabelText.set(`offered_item_id`, `Предлагаемая вещь`);
keyToLabelText.set(`desired_item_id`, `Желаемая вещь`);