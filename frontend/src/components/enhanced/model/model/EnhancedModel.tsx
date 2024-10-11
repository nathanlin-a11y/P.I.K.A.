import React from 'react';
import ModelFlexibleView from './ModelFlexibleView';
import ModelListView from './ModelListView';
import ModelTableView from './ModelTableView';
import ModelShortListView from './ModelShortListView';
import ModelCardView from './ModelCardView';
import { PIKAModel } from '../../../../types/ModelTypes';
import BaseDbElement, { BaseDbElementProps } from '../../common/enhanced_component/BaseDbElement';
import { ModelComponentProps } from '../../../../types/ModelTypes';

type BaseModelMode = BaseDbElementProps<PIKAModel>['mode'];
type ExtendedModelMode = 'list' | 'shortList' | 'card' | 'table';
type EnhancedModelMode = BaseModelMode | ExtendedModelMode;

interface EnhancedModelProps extends Omit<ModelComponentProps, 'items' | 'item' | 'onChange' | 'handleSave' | 'mode'> {
  mode: EnhancedModelMode;
  itemId?: string;
  fetchAll: boolean;
  onSave?: (savedItem: PIKAModel) => void;
  onDelete?: (deletedItem: PIKAModel) => Promise<void>;
}

const EnhancedModel: React.FC<EnhancedModelProps> = (props: EnhancedModelProps) => {
  const renderContent = (
    items: PIKAModel[] | null,
    item: PIKAModel | null,
    onChange: (newItem: Partial<PIKAModel>) => void,
    mode: BaseModelMode,
    handleSave: () => Promise<void>,
    onDelete: (deletedItem: PIKAModel) => Promise<void>,
  ) => {
    const commonProps: ModelComponentProps = {
      items,
      item,
      onChange,
      mode,
      handleSave,
      handleDelete: onDelete,
      onView: props.onView,
      isInteractable: props.isInteractable,
      onInteraction: props.onInteraction,
      showHeaders: props.showHeaders,
    };

    switch (props.mode) {
      case 'create':
      case 'edit':
      case 'view':
        return <ModelFlexibleView {...commonProps} />;
      case 'shortList':
        return <ModelShortListView {...commonProps} />;
      case 'list':
        return <ModelListView {...commonProps}/>;
      case 'table':
        return <ModelTableView {...commonProps} />;
      case 'card':
        return <ModelCardView {...commonProps} />;
      default:
        return null;
    }
  };

  const baseDbMode: BaseDbElementProps<PIKAModel>['mode'] =
    props.mode === 'create' ? 'create' :
    props.mode === 'edit' ? 'edit' : 'view';

  return (
    <BaseDbElement<PIKAModel>
      collectionName="models"
      itemId={props.itemId}
      mode={baseDbMode}
      isInteractable={props.isInteractable}
      onInteraction={props.onInteraction}
      onSave={props.onSave}
      onDelete={props.onDelete}
      fetchAll={props.fetchAll}
      render={renderContent}
    />
  );
};

export default EnhancedModel;