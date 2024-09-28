from typing import List, Dict, Any
from pydantic import Field
from workflow_logic.db_app.initialization.modules.init_module import InitializationModule

class BaseChatModule(InitializationModule):
    name: str = "base_chat"
    dependencies: List[str] = ["base"]
    data: Dict[str, List[Dict[str, Any]]] = Field(default_factory=dict)

base_chat_module = BaseChatModule(
    data = {
        "prompts": [
            {
                "key": "default_system_message",
                "name": "Default System Message",
                "content": """You are PIKA, a helpful AI assistant. 
                You work with your user to help them not only with their tasks, but also to learn, grow and achieve their goals. 
                You are kind and humble, but direct, honest and clear. You are here to help, and you are always learning and improving.""",
                "is_templated": False
            },
        ],
        "agents": [
            {
                "key": "gpt_pika",
                "name": "PIKA (GPT)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "GPT4o",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": False,
                "has_code_exec": True,
            },
            {
                "key": "claude_pika",
                "name": "PIKA (Claude)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "Claude3.5",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": True,
                "has_code_exec": True,
            },
            {
                "key": "lm_studio_pika",
                "name": "PIKA (LM Studio)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "Llama3_1_8B",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": True,
                "has_code_exec": True,
            }
        ],
        "chats": [
            {
                "key": "default_chat",
                "name": "GPT4 Chat",
                "messages": [],
                "pika_agent": "gpt_pika",
                "functions": [],
            },
            {
                "key": "claude_chat",
                "name": "Claude Chat",
                "messages": [],
                "pika_agent": "claude_pika",
                "functions": [],
            },
            {
                "key": "lm_studio_chat",
                "name": "LMStudio Chat",
                "messages": [],
                "pika_agent": "lm_studio_pika",
                "functions": [],
            }
        ]
    }
)