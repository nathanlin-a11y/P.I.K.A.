import React from 'react';
import { PIKAModel, ModelComponentProps } from '../../../../utils/ModelTypes';
import EnhancedTableView from '../../common/enhanced_component/TableView';

const ModelTableView: React.FC<ModelComponentProps> = ({
  items,
  item,
  onInteraction,
  onView,
  showHeaders = true,
}) => {
  const columns = [
    {
      header: 'Model Name',
      render: (model: PIKAModel) => model.model_name
    },
    {
      header: 'API',
      render: (model: PIKAModel) => model.api_name || 'N/A'
    },
    {
      header: 'Created At',
      render: (model: PIKAModel) => new Date(model.createdAt || '').toLocaleString()
    }
  ];

  return (
    <EnhancedTableView<PIKAModel>
      items={items}
      item={item}
      columns={columns}
      onView={onView}
      onInteraction={onInteraction}
      showHeaders={showHeaders}
      interactionTooltip="Add Model"
      viewTooltip="View Model"
    />
  );
};

export default ModelTableView;