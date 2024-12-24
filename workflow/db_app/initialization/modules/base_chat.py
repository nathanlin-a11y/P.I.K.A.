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
        "parameters": [
            {
                "key": "user_data_parameter",
                "type": "object",
                "description": "The user object."
            }
        ],
        "user_checkpoints": [
            {   
                "key": "default_tool_call_checkpoint",
                "user_prompt": "Please approve or reject the tool call created by the agent.",
                "task_next_obj": {0: "tool_call", 1: None},
                "options_obj": {0: "Approve", 1: "Reject"},
                "request_feedback": False
            },
            {   
                "key": "default_code_exec_checkpoint",
                "user_prompt": "Please approve or reject the code execution requested by the agent.",
                "task_next_obj": {0: "code_execution", 1: None},
                "options_obj": {0: "Approve", 1: "Reject"},
                "request_feedback": False
            },
        ],
        "prompts": [
            {
                "key": "default_system_message",
                "name": "Default System Message",
                "content": get_prompt_file("default_system_message.prompt"),
                "is_templated": True,
                "parameters": {
                    "type": "object",
                    "properties": {
                        "user_data": "user_data_parameter"
                    },
                    "required": []
                }
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
                "has_tools": 1,
                "has_code_execution": 0,
            },
            {
                "key": "claude_pika",
                "name": "PIKA (Claude)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "Claude3.5",
                },
                "max_consecutive_auto_reply": 1,
                "has_tools": 1,
                "has_code_execution": 0,
            },
            {
                "key": "gemini_pika",
                "name": "PIKA (Gemini)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "gemini_1.5_flash",
                },
                "max_consecutive_auto_reply": 1,
                "has_tools": 1,
                "has_code_execution": 0,
            },
            {
                "key": "mistral_pika",
                "name": "PIKA (Mistral)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "mistral_small",
                },
                "max_consecutive_auto_reply": 1,
                "has_tools": 1,
                "has_code_execution": 0,
            },
            {
                "key": "cohere_pika",
                "name": "PIKA (Cohere)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "command-r-plus",
                },
                "max_consecutive_auto_reply": 1,
                "has_tools": 1,
                "has_code_execution": 0,                
            },
            {
                "key": "llama_pika",
                "name": "PIKA (Meta)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "llama3.2_90b",
                },
                "max_consecutive_auto_reply": 1,
                "has_tools": 1,
                "has_code_execution": 0,
            },
            {
                "key": "groq_pika",
                "name": "PIKA (Groq)",
                "system_message": "default_system_message",
                "models": {
                    "chat": "llama-3.3-70b-versatile",
                },
                "max_consecutive_auto_reply": 1,
                "has_tools": 1,
                "has_code_execution": 0,
            }
        ],
        "chats": [
            {
                "key": "default_chat",
                "name": "GPT4 Chat",
                "pika_agent": "gpt_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            },
            {
                "key": "claude_chat",
                "name": "Claude Chat",
                "pika_agent": "claude_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            },
            {
                "key": "lm_studio_chat",
                "name": "LMStudio Chat",
                "pika_agent": "lm_studio_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            },
            {
                "key": "gemini_chat",
                "name": "Gemini Chat",
                "pika_agent": "gemini_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            },
            {
                "key": "mistral_chat",
                "name": "Mistral Chat",
                "pika_agent": "mistral_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            },
            {
                "key": "cohere_chat",
                "name": "Cohere Chat",
                "pika_agent": "cohere_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            },
            {
                "key": "llama_chat",
                "name": "Llama Chat",
                "pika_agent": "llama_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            },
            {
                "key": "groq_chat",
                "name": "Groq Chat",
                "pika_agent": "groq_pika",
                "default_user_checkpoints": {
                    "tool_call": "default_tool_call_checkpoint",
                    "code_execution": "default_code_exec_checkpoint"
                }
            }
        ]
    }
)