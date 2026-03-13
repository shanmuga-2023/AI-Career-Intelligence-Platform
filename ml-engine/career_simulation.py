# Rule-based Career Simulation Model
import pandas as pd
import os
from difflib import get_close_matches

current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, 'jobs.csv')

JOB_REQUIREMENTS = {}
try:
    df = pd.read_csv(csv_path)
    for index, row in df.iterrows():
        title = str(row['job_title']).lower().strip()
        skills = [s.strip() for s in str(row['skills']).split(',')]
        # allow CSV to optionally contain an expected_salary column
        salary = None
        if 'expected_salary' in row and pd.notna(row['expected_salary']):
            salary = str(row['expected_salary'])
        JOB_REQUIREMENTS[title] = {
            "required_skills": skills,
            "expected_salary": salary or "$80,000 - $120,000"
        }
except Exception as e:
    # Fallback mocked job requirements
    JOB_REQUIREMENTS = {
        "data scientist": {
            "required_skills": ["python", "machine learning", "sql", "pandas", "statistics"],
            "expected_salary": "$100,000 - $150,000"
        },
        "web developer": {
            "required_skills": ["html5", "css3", "javascript", "react", "node.js", "express"],
            "expected_salary": "$70,000 - $120,000"
        },
        "ai engineer": {
            "required_skills": ["python", "deep learning", "nlp", "tensorflow", "pytorch"],
            "expected_salary": "$120,000 - $180,000"
        }
    }

def simulate_career_path(user_skills: list[str], target_job: str) -> dict:
    target = target_job.lower().strip()
    
    if target not in JOB_REQUIREMENTS:
        # return suggestions for close matches to improve UX
        close = get_close_matches(target, JOB_REQUIREMENTS.keys(), n=3, cutoff=0.6)
        error_obj = {"error": "Job role not found in knowledge base."}
        if close:
            error_obj["suggestions"] = close
        return error_obj
        
    job_info = JOB_REQUIREMENTS[target]
    required_skills = set(job_info["required_skills"])
    user_skills_set = set([s.lower() for s in user_skills])
    
    missing_skills = list(required_skills - user_skills_set)
    present_skills = list(required_skills.intersection(user_skills_set))
    
    learning_path = []
    if missing_skills:
        learning_path.append(f"1. Start with core principles of {missing_skills[0].title()}")
        if len(missing_skills) > 1:
            learning_path.append(f"2. Take an online course on {missing_skills[1].title()}")
        learning_path.append(f"{len(missing_skills)+1}. Build a project combining the new skills you've learned.")
    else:
        learning_path = ["You already have the required skills! Start applying or build a portfolio project."]
        
    return {
        "target_job": target_job.title(),
        "required_skills": job_info["required_skills"],
        "present_skills": present_skills,
        "missing_skills": missing_skills,
        "expected_salary": job_info["expected_salary"],
        "learning_path": learning_path
    }
