import praw
from praw.models import Submission
from typing import List, Dict, Any
from pydantic import Field
from workflow_logic.core.communication import SearchResult, SearchOutput
from workflow_logic.core.tasks.api_tasks.api_task import APITask
from workflow_logic.core.parameters import ParameterDefinition, FunctionParameters

reddit_search_parameters = FunctionParameters(
    type="object",
    properties={
        "prompt": ParameterDefinition(
            type="string",
            description="The search query.",
            default=None
        ),
        "sort": ParameterDefinition(
            type="string",
            description="Sort method, one of: 'relevance', 'hot', 'top', 'new', or 'comments'.",
            default="hot"
        ),
        "time_filter": ParameterDefinition(
            type="string",
            description="Time period to filter by, one of: 'all', 'day', 'hour', 'month', 'week', or 'year'.",
            default="week"
        ),
        "subreddit": ParameterDefinition(
            type="string",
            description="Name of the subreddit, like 'all' for r/all.",
            default="all"
        ),
        "limit": ParameterDefinition(
            type="integer",
            description="Maximum number of results to return.",
            default=10
        )
    },
    required=["prompt"]
)

class RedditSearchTask(APITask):
    task_name: str = "reddit_search"
    task_description: str = "Performs a Reddit search and retrieves results"
    input_variables: FunctionParameters = Field(reddit_search_parameters, description="This task requires a prompt input, and optional inputs such as sort, time_filter, subreddit, and limit. Default is 'hot', 'week', 'all', and 10.")
    required_apis: List[str] = ["reddit_search"]

    def generate_api_response(self, api_data: Dict[str, Any], prompt: str, sort: str = "hot", time_filter: str = "week", subreddit: str = "all", limit: int = 10, **kwargs) -> SearchOutput:
        if not api_data.get('client_id') or not api_data.get('client_secret'):
            raise ValueError("Reddit client ID or client secret not found in API data")

        user_agent = "PIKA_Assistant"
        reddit = praw.Reddit(
            client_id=api_data['client_id'],
            client_secret=api_data['client_secret'],
            user_agent=user_agent,
        )
        subredditObject = reddit.subreddit(subreddit)
        search_results = subredditObject.search(query=prompt, sort=sort, time_filter=time_filter, limit=limit)
        submissions: List[Submission] = [submission for submission in search_results]
        search_result_list = [
            SearchResult(
                title=submission.title,
                url=submission.url,
                content=submission.selftext,
                metadata={key: getattr(submission, key) for key in vars(submission) if key not in {"title", "url", "selftext"}}
            ) for submission in submissions
        ]
        return SearchOutput(content=search_result_list)