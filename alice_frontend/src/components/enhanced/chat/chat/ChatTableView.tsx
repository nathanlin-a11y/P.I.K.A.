import React from 'react';
import { ChatComponentProps, PIKAChat } from '../../../../types/ChatTypes';
import EnhancedTableView, { Column } from '../../common/enhanced_component/TableView';

const ChatTableView: React.FC<ChatComponentProps> = ({
  items,
  item,
  isInteractable = false,
  onInteraction,
  onView,
  showHeaders = true,
}) => {
  const columns: Column<PIKAChat>[] = [
    {
      header: 'Chat Name',
      render: (chat: PIKAChat) => chat.name,
      sortKey: 'name'
    },
    {
      header: 'Agent',
      render: (chat: PIKAChat) => chat.pika_agent?.name || 'N/A',
      // We can't directly sort by nested properties, so we'll omit sortKey here
    },
    {
      header: 'Created At',
      render: (chat: PIKAChat) => new Date(chat.createdAt || '').toLocaleString(),
      sortKey: 'createdAt'
    }
  ];

  return (
    <EnhancedTableView<PIKAChat>
      items={items}
      item={item}
      columns={columns}
      onView={onView}
      onInteraction={isInteractable ? onInteraction : undefined}
      showHeaders={showHeaders}
      interactionTooltip="Add Chat"
      viewTooltip="View Chat"
    />
  );
};

export default ChatTableView;