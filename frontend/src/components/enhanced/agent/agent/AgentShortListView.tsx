import React from 'react';
import { AgentComponentProps, PIKAAgent } from '../../../../types/AgentTypes';
import EnhancedShortListView from '../../../common/enhanced_component/ShortListView';

const AgentShortListView: React.FC<AgentComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (agent: PIKAAgent) => agent.name;
    const getSecondaryText = (agent: PIKAAgent) => agent.system_message?.name || 'No system message';

    return (
        <EnhancedShortListView<PIKAAgent>
            items={items}
            item={item}
            getPrimaryText={getPrimaryText}
            getSecondaryText={getSecondaryText}
            onView={onView}
            onInteraction={onInteraction}
        />
    );
};

export default AgentShortListView;