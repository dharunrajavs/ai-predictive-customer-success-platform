import random

def generate_outreach_message(segment, risk_level):
    """
    Simulate generating a personalized outreach message based on segments and risk.
    In a real app, this would use LLM APIs like OpenAI or Claude.
    """
    templates = {
        "High": {
            "email": [
                "Hi there! We noticed you haven't been as active lately. Here's a 20% discount if you upgrade today!",
                "We miss you! Is there anything our support team can help you with?"
            ],
            "in_app": [
                "Having trouble finding what you need? Talk to support right now!"
            ]
        },
        "Medium": {
            "email": [
                "Did you know about our latest feature? Check out this quick tutorial.",
                "How are you liking the platform so far? We'd love your feedback!"
            ],
            "in_app": [
                "You're on your way to becoming a pro! Check out these advanced tips."
            ]
        },
        "Low": {
            "email": [
                "Thanks for being a loyal customer! Here is a sneak peek at what's coming next.",
                "Refer a friend and get $50 in credits!"
            ],
            "in_app": [
                "Awesome job this week! You're in the top 10% of active users."
            ]
        }
    }
    
    # Default to generic message if risk is unknown
    if risk_level not in templates:
        risk_level = "Medium"
        
    channels = list(templates[risk_level].keys())
    selected_channel = random.choice(channels)
    
    messages = templates[risk_level][selected_channel]
    selected_message = random.choice(messages)
    
    return {
        "segment": segment,
        "risk_level": risk_level,
        "channel": selected_channel,
        "message": selected_message
    }
