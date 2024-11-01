import React from 'react';
import { AgentComponentProps, PIKAAgent } from '../../../../types/AgentTypes';
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
      render: (agent: PIKAAgent) => agent.name,
      sortKey: 'name'
    },
    {
      header: 'Chat Model',
      render: (agent: PIKAAgent) => agent.models?.chat?.model_name || 'N/A',
    },
    {
      header: 'Tool',
      render: (agent: PIKAAgent) => agent.has_tools ? 'Yes' : 'No', // Correct this to show the enum value
      sortKey: 'has_tools'
    },
    {
      header: 'Code',
      render: (agent: PIKAAgent) => agent.has_code_exec ? 'Yes' : 'No', // Correct this to show the enum value
      sortKey: 'has_code_exec'
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