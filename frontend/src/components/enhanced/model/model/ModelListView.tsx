import React from 'react';
import { PIKAModel, ModelComponentProps } from '../../../../types/ModelTypes';
import { IconButton, Tooltip, Typography } from '@mui/material';
import EnhancedListView from '../../common/enhanced_component/ListView';
import { Api } from '@mui/icons-material';
import { apiNameIcons, modelTypeIcons } from '../../../../utils/ApiUtils';
import { formatCamelCaseString } from '../../../../utils/StyleUtils';

const ModelListView: React.FC<ModelComponentProps> = ({
    items,
    item,
    onInteraction,
    onView,
}) => {
    const getPrimaryText = (model: PIKAModel) => model.short_name as string;
    const getSecondaryText = (model: PIKAModel) => (
        <Typography component="span" variant="body2" color="textSecondary">
            <Tooltip title={`API name: ${formatCamelCaseString(model.api_name)}`}>
                <IconButton size="small">
                    {apiNameIcons[model.api_name] || <Api />}
                </IconButton>
            </Tooltip>
            <Tooltip title={`Model type: ${formatCamelCaseString(model.model_type)}`}>
                <IconButton size="small">
                    {modelTypeIcons[model.model_type] || <Api />}
                </IconButton>
            </Tooltip>
        </Typography>
    );

    return (
        <>
            <EnhancedListView<PIKAModel>
                items={items}
                item={item}
                getPrimaryText={getPrimaryText}
                getSecondaryText={getSecondaryText}
                onView={onView}
                onInteraction={onInteraction}
                interactionTooltip="Add Model"
                viewTooltip="View Model"
                collectionElementString='Model'
            />
        </>
    );
};

export default ModelListView;