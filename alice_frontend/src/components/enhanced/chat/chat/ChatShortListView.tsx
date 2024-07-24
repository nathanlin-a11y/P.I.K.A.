import React from 'react';
import { PIKAChat, ChatComponentProps } from '../../../../utils/ChatTypes';
import EnhancedShortListView from '../../common/enhanced_component/ShortListView';

const ChatShortListView: React.FC<ChatComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (chat: PIKAChat) => chat.name;
    const getSecondaryText = (chat: PIKAChat) => chat.pika_agent?.name || 'N/A';

    return (
        <EnhancedShortListView<PIKAChat>
            items={items}
            item={item}
            getPrimaryText={getPrimaryText}
            getSecondaryText={getSecondaryText}
            onView={onView}
            onInteraction={onInteraction}
        />
    );
};

export default ChatShortListView;