import React from 'react';
import { PIKAModel, ModelComponentProps } from '../../../../types/ModelTypes';
import EnhancedShortListView from '../../common/enhanced_component/ShortListView';

const ModelShortListView: React.FC<ModelComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (model: PIKAModel) => model.short_name;
    const getSecondaryText = (model: PIKAModel) => `${model.api_name} - ${model.model_type}` || 'N/A';

    return (
        <EnhancedShortListView<PIKAModel>
            items={items}
            item={item}
            getPrimaryText={getPrimaryText}
            getSecondaryText={getSecondaryText}
            onView={onView}
            onInteraction={onInteraction}
        />
    );
};

export default ModelShortListView;