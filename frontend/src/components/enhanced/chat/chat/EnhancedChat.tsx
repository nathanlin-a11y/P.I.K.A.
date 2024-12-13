import React from 'react';
import { PIKAChat, ChatComponentProps, PopulatedPIKAChat } from '../../../../types/ChatTypes';
import ChatFlexibleView from './ChatFlexibleView';
import ChatListView from './ChatListView';
import ChatTableView from './ChatTableView';
import ChatCardView from './ChatCardView';
import ChatShortListView from './ChatShortListView';
import BaseDbElement, { BaseDbElementProps } from '../../common/enhanced_component/BaseDbElement';

type BaseChatMode = BaseDbElementProps<PopulatedPIKAChat>['mode'];
type ExtendedChatMode = 'list' | 'shortList' | 'card' | 'full' | 'table';
type EnhancedChatMode = BaseChatMode | ExtendedChatMode;

interface EnhancedChatProps extends Omit<ChatComponentProps, 'items' | 'item' | 'onChange' | 'handleSave' | 'mode' | 'handleDelete'> {
  mode: EnhancedChatMode;
  item?: Partial<PIKAChat | PopulatedPIKAChat> | null;
  itemId?: string;
  fetchAll: boolean;
  onSave?: (savedItem: PIKAChat | PopulatedPIKAChat) => Promise<void>;
  onDelete?: (deletedItem: PIKAChat | PopulatedPIKAChat) => Promise<void>;
}

const EnhancedChat: React.FC<EnhancedChatProps> = (props) => {
  const renderContent = (
    items: (PIKAChat | PopulatedPIKAChat)[] | null,
    item: PIKAChat | PopulatedPIKAChat | null,
    onChange: (newItem: Partial<PIKAChat | PopulatedPIKAChat>) => void,
    mode: BaseChatMode,
    handleSave: () => Promise<void>,
    onDelete: (deletedItem: PIKAChat | PopulatedPIKAChat) => Promise<void>,
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
    };

    switch (props.mode) {
      case 'create':
      case 'edit':
      case 'view':
        return <ChatFlexibleView {...commonProps} />;
      case 'shortList':
        return <ChatShortListView {...commonProps} />;
      case 'list':
        return <ChatListView {...commonProps} />;
      case 'table':
        return <ChatTableView {...commonProps} />;
      case 'card':
        return <ChatCardView {...commonProps} />;
      default:
        return null;
    }
  };

  const baseDbMode: BaseDbElementProps<PIKAChat>['mode'] =
    props.mode === 'create' ? 'create' :
      props.mode === 'edit' ? 'edit' : 'view';
  return (
    <BaseDbElement<PIKAChat | PopulatedPIKAChat>
      collectionName="chats"
      itemId={props.itemId}
      partialItem={props.item || undefined}
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