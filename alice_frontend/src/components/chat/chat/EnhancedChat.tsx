import React from 'react';
import ChatFlexibleView from './ChatFlexibleView';
import ChatListView from './ChatListView';
import ChatTableView from './ChatTableView';
import ChatCardView from './ChatCardView';
import ChatFullView from './ChatFullView';
import { PIKAChat } from '../../../utils/ChatTypes';
import BaseDbElement, { BaseDbElementProps } from '../../BaseDbElement';
import { ChatComponentProps } from '../../../utils/ChatTypes';

type BaseChatMode = BaseDbElementProps<PIKAChat>['mode'];
type ExtendedChatMode = 'list' | 'shortList' | 'card' | 'full' | 'table';
type EnhancedChatMode = BaseChatMode | ExtendedChatMode;

interface EnhancedChatProps extends Omit<ChatComponentProps, 'items' | 'item' | 'onChange' | 'handleSave' | 'mode'> {
  mode: EnhancedChatMode;
  itemId?: string;
  fetchAll: boolean;
  onSave?: (savedItem: PIKAChat) => void;
}

const EnhancedChat: React.FC<EnhancedChatProps> = (props) => {
  const renderContent = (
    items: PIKAChat[] | null,
    item: PIKAChat | null,
    onChange: (newItem: Partial<PIKAChat>) => void,
    mode: BaseChatMode,
    handleSave: () => Promise<void>
  ) => {
    const commonProps: ChatComponentProps = {
      items,
      item,
      onChange,
      mode,
      handleSave,
      isInteractable: props.isInteractable,
      onInteraction: props.onInteraction,
      onView: props.onView,
      showRegenerate: props.showRegenerate,
      handleTaskClick: props.handleTaskClick,
      handleTaskResultClick: props.handleTaskResultClick,
      handleAgentClick: props.handleAgentClick,
      showHeaders: props.showHeaders,
    };

    switch (props.mode) {
      case 'create':
      case 'edit':
      case 'view':
        return <ChatFlexibleView {...commonProps} />;
      case 'list':
      case 'shortList':
        return <ChatListView {...commonProps}/>;
      case 'table':
        return <ChatTableView {...commonProps} />;
      case 'card':
        return <ChatCardView {...commonProps} />;
      case 'full':
        return (
          <ChatFullView
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  const baseDbMode: BaseDbElementProps<PIKAChat>['mode'] =
    props.mode === 'create' ? 'create' :
    props.mode === 'edit' ? 'edit' : 'view';

  return (
    <BaseDbElement<PIKAChat>
      collectionName="chats"
      itemId={props.itemId}
      mode={baseDbMode}
      isInteractable={props.isInteractable}
      onInteraction={props.onInteraction}
      onSave={props.onSave}
      fetchAll={props.fetchAll}
      render={renderContent}
    />
  );
};

export default EnhancedChat;