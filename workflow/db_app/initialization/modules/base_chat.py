from typing import List, Dict, Any
from pydantic import Field
from workflow.db_app.initialization.modules.init_module import InitializationModule, get_prompt_file

class BaseChatModule(InitializationModule):
    """This module defines the base chat agents and chats, as well as the default prompt for the chat agent."""
    name: str = "base_chat"
    dependencies: List[str] = ["base"]
    data: Dict[str, List[Dict[str, Any]]] = Field(default_factory=dict)

base_chat_module = BaseChatModule(
    data = {
        "prompts": [
            {
                "key": "default_system_message",
                "name": "Default System Message",
                "content": get_prompt_file("default_system_message.prompt"),
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
                "has_functions": True,
                "has_code_exec": False,
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
                "has_code_exec": False,
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
                "has_code_exec": False,
            },
            {
                "key": "gemini_pika",
                "name": "PIKA (Gemini)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "gemini_1.5_flash",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": True,
                "has_code_exec": False,
            },
            {
                "key": "mistral_pika",
                "name": "PIKA (Mistral)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "mistral_small",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": True,
                "has_code_exec": False,
            },
            {
                "key": "cohere_pika",
                "name": "PIKA (Cohere)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "command-r-plus",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": True,
                "has_code_exec": False,                
            },
            {
                "key": "llama_pika",
                "name": "PIKA (Meta)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "llama3.2_90b",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": True,
                "has_code_exec": False,
            },
            {
                "key": "groq_pika",
                "name": "PIKA (Groq)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "llama-3.1-70b-versatile",
                },
                "max_consecutive_auto_reply": 1,
                "has_functions": True,
                "has_code_exec": False,
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
            },
            {
                "key": "gemini_chat",
                "name": "Gemini Chat",
                "messages": [],
                "pika_agent": "gemini_pika",
                "functions": [],
            },
            {
                "key": "mistral_chat",
                "name": "Mistral Chat",
                "messages": [],
                "pika_agent": "mistral_pika",
                "functions": [],
            },
            {
                "key": "cohere_chat",
                "name": "Cohere Chat",
                "messages": [],
                "pika_agent": "cohere_pika",
                "functions": [],
            },
            {
                "key": "llama_chat",
                "name": "Llama Chat",
                "messages": [],
                "pika_agent": "llama_pika",
                "functions": [],
            },
            {
                "key": "groq_chat",
                "name": "Groq Chat",
                "messages": [],
                "pika_agent": "groq_pika",
                "functions": [],
            }
        ]
    }
)