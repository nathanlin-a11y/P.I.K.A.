import React from 'react';
import ChatFlexibleView from './ChatFlexibleView';
import ChatListView from './ChatListView';
import ChatTableView from './ChatTableView';
import ChatCardView from './ChatCardView';
import ChatShortListView from './ChatShortListView';
import { PIKAChat } from '../../../../types/ChatTypes';
import BaseDbElement, { BaseDbElementProps } from '../../common/enhanced_component/BaseDbElement';
import { ChatComponentProps } from '../../../../types/ChatTypes';
import ChatMessagesFullView from './ChatMessagesFullView';

type BaseChatMode = BaseDbElementProps<PIKAChat>['mode'];
type ExtendedChatMode = 'list' | 'shortList' | 'card' | 'full' | 'table';
type EnhancedChatMode = BaseChatMode | ExtendedChatMode;

interface EnhancedChatProps extends Omit<ChatComponentProps, 'items' | 'item' | 'onChange' | 'handleSave' | 'mode' | 'handleDelete'> {
  mode: EnhancedChatMode;
  itemId?: string;
  fetchAll: boolean;
  onSave?: (savedItem: PIKAChat) => Promise<void>;
  onDelete?: (deletedItem: PIKAChat) => Promise<void>;
}

const EnhancedChat: React.FC<EnhancedChatProps> = (props) => {
  const renderContent = (
    items: PIKAChat[] | null,
    item: PIKAChat | null,
    onChange: (newItem: Partial<PIKAChat>) => void,
    mode: BaseChatMode,
    handleSave: () => Promise<void>,
    onDelete: (deletedItem: PIKAChat) => Promise<void>,
  ) => {
    const commonProps: ChatComponentProps = {
      items,
      item,
      onChange,
      mode,
      handleSave,
      handleDelete: onDelete,
      isInteractable: props.isInteractable,
      onInteraction: props.onInteraction,
      onView: props.onView,
      showHeaders: props.showHeaders,
      showRegenerate: props.showRegenerate,
    };

    switch (props.mode) {
      case 'create':
      case 'edit':
      case 'view':
        return <ChatFlexibleView {...commonProps} />;
      case 'shortList':
        return <ChatShortListView {...commonProps} />;
      case 'list':
        return <ChatListView {...commonProps}/>;
      case 'table':
        return <ChatTableView {...commonProps} />;
      case 'card':
        return <ChatCardView {...commonProps} />;
      case 'full':
        return <ChatMessagesFullView {...commonProps} />;
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
      onDelete={props.onDelete}
      fetchAll={props.fetchAll}
      render={renderContent}
    />
  );
};

export default EnhancedChat;