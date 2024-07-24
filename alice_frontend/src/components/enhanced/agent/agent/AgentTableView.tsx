import React from 'react';
import { AgentComponentProps, PIKAAgent } from '../../../../utils/AgentTypes';
import EnhancedTableView from '../../common/enhanced_component/TableView';

const AgentTableView: React.FC<AgentComponentProps> = ({
  items,
  item,
  onInteraction,
  onView,
  showHeaders = true,
}) => {
  const columns = [
    {
      header: 'Agent Name',
      render: (agent: PIKAAgent) => agent.name
    },
    {
      header: 'Model',
      render: (agent: PIKAAgent) => agent.model_id?.model_name || 'N/A'
    },
    {
      header: 'Created At',
      render: (agent: PIKAAgent) => new Date(agent.createdAt || '').toLocaleString()
    }
  ];

  return (
    <EnhancedTableView<PIKAAgent>
      items={items}
      item={item}
      columns={columns}
      onView={onView}
      onInteraction={onInteraction}
      showHeaders={showHeaders}
      interactionTooltip="Add Agent"
      viewTooltip="View Agent"
    />
  );
};

export default AgentTableView;