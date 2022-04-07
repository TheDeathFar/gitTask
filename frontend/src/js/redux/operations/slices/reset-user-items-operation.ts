import { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';

/*
* Обычным Action-ом эту функцию сделать не получилось. Из-за того, что
* Operations используется в редьюсере, а UserItemsActions использовались
* в Operations, то вебпак сходил с ума. Пришлось сделать этот экшен операцией.
* Теперь все работает, импорты корректны
* */

export const resetUserItemsOperation: AsyncThunkPayloadCreator<unknown> = async () => {};