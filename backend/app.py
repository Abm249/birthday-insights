from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

class StoryRequest(BaseModel):
    birthday: str

# Load the pre-trained model
story_generator = pipeline("text-generation", model="gpt2")

@app.post("/generate-story")
async def generate_story(request: StoryRequest):
    birthday = request.birthday

    # Customized and realistic prompt
    prompt = (
        f"A heartwarming and vivid story of a person born on {birthday}. "
        "Describe the setting, their family, and the events surrounding their birth. "
        "Make it feel real, personal, and full of life. Highlight their uniqueness and potential."
    )

    # Generate the story
    try:
        story_output = story_generator(prompt, max_length=200, num_return_sequences=1)
        story = story_output[0]["generated_text"]
        return {"story": story}
    except Exception as e:
        return {"error": "Failed to generate story.", "details": str(e)}

# Run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
