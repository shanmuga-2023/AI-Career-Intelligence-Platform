from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from skill_matching import calculate_skill_match
from employability_model import predict_employability
from career_simulation import simulate_career_path

app = FastAPI(title="ML Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SkillMatchRequest(BaseModel):
    user_skills: List[str]
    job_skills: List[str]

class EmployabilityRequest(BaseModel):
    num_skills: int
    experience_years: float
    certifications_count: int

class CareerSimRequest(BaseModel):
    user_skills: List[str]
    target_job: str

@app.get("/")
def read_root():
    return {"message": "AI Career Intelligence ML Engine Running"}

@app.post("/match-skills")
def match_skills(request: SkillMatchRequest):
    result = calculate_skill_match(request.user_skills, request.job_skills)
    return {"success": True, "data": result}

@app.post("/predict-employability")
def predict_score(req: EmployabilityRequest):
    score = predict_employability(req.num_skills, req.experience_years, req.certifications_count)
    return {"success": True, "score": score}

@app.post("/simulate-career")
def simulate(req: CareerSimRequest):
    result = simulate_career_path(req.user_skills, req.target_job)
    return {"success": True, "data": result}
