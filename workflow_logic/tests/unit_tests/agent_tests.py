import unittest
from unittest.mock import patch
from pydantic import ValidationError
from autogen.agentchat import UserProxyAgent
from workflow_logic.core.prompt import Prompt
from workflow_logic.core.agent.agent import PIKAAgent


class TestPIKAAgent(unittest.TestCase):
    
    def setUp(self):
        self.prompt = Prompt(name="default", content="You are an AI assistant")
        self.pika_agent_data = {
            "_id": "60b8d29562c1f0c025ae4c89",
            "name": "PIKA",
            "system_message": self.prompt,
            "autogen_class": "ConversableAgent",
            "code_execution_config": False,
            "max_consecutive_auto_reply": 10,
            "human_input_mode": "NEVER",
            "speaker_selection": {},
            "default_auto_reply": "",
            "model_id": None
        }
    
    def test_initialization(self):
        agent = PIKAAgent(**self.pika_agent_data)
        self.assertEqual(agent.id, "60b8d29562c1f0c025ae4c89")
        self.assertEqual(agent.name, "PIKA")
        self.assertEqual(agent.system_message, self.prompt)
        self.assertEqual(agent.autogen_class, "ConversableAgent")
    
    def test_system_message_str(self):
        agent = PIKAAgent(**self.pika_agent_data)
        self.assertEqual(agent.system_message_str, "You are an AI assistant")
    
    def test_get_execution_agent(self):
        agent = PIKAAgent(**self.pika_agent_data)
        execution_agent = agent.get_execution_agent()
        self.assertIsInstance(execution_agent, UserProxyAgent)
        self.assertEqual(execution_agent.name, "PIKA")
    
    def test_get_code_execution_config_default(self):
        agent = PIKAAgent(**self.pika_agent_data)
        code_config = agent.get_code_execution_config()
        self.assertIsInstance(code_config, dict)
        self.assertTrue(code_config["use_docker"])
        self.assertEqual(code_config["timeout"], 50)
    
    def test_get_code_execution_config_custom(self):
        custom_config = {"use_docker": False, "timeout": 100}
        self.pika_agent_data["code_execution_config"] = custom_config
        agent = PIKAAgent(**self.pika_agent_data)
        self.assertEqual(agent.get_code_execution_config(), custom_config)
       
    def test_get_autogen_agent_user_proxy(self):
        self.pika_agent_data["autogen_class"] = "UserProxyAgent"
        agent = PIKAAgent(**self.pika_agent_data)
        auto_agent = agent.get_autogen_agent()
        self.assertIsInstance(auto_agent, UserProxyAgent)
    
    def test_invalid_agent_class(self):
        self.pika_agent_data["autogen_class"] = "InvalidAgent"
        with self.assertRaises(ValidationError):
            PIKAAgent(**self.pika_agent_data)

if __name__ == '__main__':
    unittest.main()
