import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from '#redux/store';
import { Operations } from '#redux/operations/operations';
import {
  catalogueCurrentMetaSelector,
  catalogueItemsSelector,
  isCatalogueRequestPendingSelector,
} from '#redux/selectors';
import { useSelector } from 'react-redux';
import { keyToLabelText } from '#src/js/util/key-to-label-text';
import { PhotosSlideshow } from '#domains/items/components/photos-slideshow/photos-slideshow';
import { useShowCatalogueRequestError } from '#src/js/hooks/use-show-catalogue-request-error';
import InfiniteScroll from 'react-infinite-scroll-component';
import SpinnerWrapper from '#components/spinner-wrapper/spinner-wrapper';
import { PaginationRequestDto } from '#server/common/dto/pagination-request.dto';
import { CatalogueActions } from '#redux/reducers/slices/catalogue-slice';

export const AdminPage: FC = () => {
  const [isDispatched, setIsDispatched] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const catalogueItems = useSelector(catalogueItemsSelector);
  const currentMeta = useSelector(catalogueCurrentMetaSelector);
  const isPending = useSelector(isCatalogueRequestPendingSelector);

  // Можем в любой момент поменять настройки загрузки
  // Отсортировать результаты, отфильтровать по фразе и т.д.
  const [loadOptions, setLoadOptions] = useState<Partial<PaginationRequestDto>>({
    order: `id`,
  });

  useEffect(() => {
    if (catalogueItems.length === 0) {
      dispatch(Operations.loadCatalogue({
        ...loadOptions,
        page: 1,
      }));
      setIsDispatched(true);
    }
  }, [catalogueItems, loadOptions, setIsDispatched, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(CatalogueActions.reset());
    };
  }, [dispatch]);

  useShowCatalogueRequestError(isDispatched);

  if (!catalogueItems)
    return null;

  if (!isPending && isDispatched && catalogueItems?.length === 0)
    return (
      <div
        className={`uk-width-1-1 uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-text-center uk-padding-small`}>
        <h2 className={`uk-text-muted`}>Здесь будет список вещей</h2>
      </div>
    );


  return (
    <div id={`scrollable-target`}
         className={`WithScrollbar uk-overflow-auto uk-flex uk-flex-wrap uk-padding-small uk-child-width-1-1`}>
      <InfiniteScroll
        next={() => {
          dispatch(Operations.loadCatalogue({
            page: currentMeta?.currentPage + 1,
          }));
        }}
        hasMore={currentMeta?.currentPage < currentMeta?.totalPages}
        loader={null}
        dataLength={catalogueItems.length}
        scrollableTarget={`scrollable-target`}
      >
        <table className={`uk-table uk-table-striped uk-table-responsive`}>
          <thead>
          <tr>
            <th>{keyToLabelText.get(`id`)}</th>
            <th>{keyToLabelText.get(`username`)}</th>
            <th>{keyToLabelText.get(`photosPaths`)}</th>
            <th>{keyToLabelText.get(`name`)}</th>
            <th>{keyToLabelText.get(`description`)}</th>
            <th>{keyToLabelText.get(`geo`)}</th>
            <th>{keyToLabelText.get(`item_category_id`)}</th>
            <th>{keyToLabelText.get(`trade_category_id`)}</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody className={``}>
          {(catalogueItems) ? catalogueItems.map((item) => (
            <tr key={item.id}>
              <td className={`uk-table-shrink`}>{item.id}</td>
              <td className={`uk-table-shrink`}>{item.user}</td>
              <td className={`uk-width-medium`}>
                <PhotosSlideshow item={item} width={`1-1`} padding={false} />
              </td>
              <td>{item.name}</td>
              <td className={`uk-width-medium`}>{item.description}</td>
              <td>{item.geo}</td>
              <td>{item.item_category.name}</td>
              <td>{item.trade_category.name}</td>
              <td className={`uk-table-shrink uk-text-right`}>
                <button className={`uk-link`} onClick={() => dispatch(Operations.deleteCatalogueItem(item.id))}
                        uk-icon={`trash`} />
              </td>
            </tr>
          )) : null}
          <tr className={(!isPending) ? `uk-hidden` : ``}>
            <td className={`uk-position-relative uk-height-small`} colSpan={100}>
              <SpinnerWrapper loading={true} />
            </td>
          </tr>
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
};