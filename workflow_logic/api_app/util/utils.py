from typing import Union, Dict, Any
from workflow_logic.core import PIKAChat, PIKATask, APIManager

# Utility function for deep API availability check
async def deep_api_check(item: Union[PIKATask, PIKAChat], api_manager: APIManager) -> Dict[str, Any]:
    if isinstance(item, PIKATask) or isinstance(item, PIKAChat):
        return item.deep_validate_required_apis(api_manager)
    else:
        raise ValueError(f"Unsupported item type for API check: {type(item)}")