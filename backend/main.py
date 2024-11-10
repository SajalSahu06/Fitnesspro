from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx

app = FastAPI()

class FitnessPlanRequest(BaseModel):
    age: int
    weight: int
    height: int
    goals: str
    activityLevel: str

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY_HERE"

@app.post("/generate-fitness-plan/")
async def generate_fitness_plan(request: FitnessPlanRequest):
    content = {
        "contents": [{
            "parts": [{
                "text": f"Generate a personalized fitness plan for the following details: {request.json()}"
            }]
        }]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(GEMINI_API_URL, json=content)

        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.json())

        data = response.json()
        return {"plan": data.get("generated_content", "No plan generated.")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
