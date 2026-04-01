# Rule-based Career Simulation Model
import pandas as pd
import os
from difflib import get_close_matches

current_dir = os.path.dirname(os.path.abspath(__file__))
# Loading the new enriched CSV data
csv_path = os.path.join(current_dir, 'career_enriched_fixed (3).csv')

JOB_REQUIREMENTS = {}
try:
    df = pd.read_csv(csv_path, encoding='cp1252')
    # The new CSV might have duplicate career_name if it has multiple years
    if 'year' in df.columns:
        df = df.sort_values(by='year', ascending=False)
        df = df.drop_duplicates(subset=['career_name'], keep='first')

    for index, row in df.iterrows():
        title = str(row['career_name']).lower().strip()
        skills = [s.strip() for s in str(row['required_skills']).split(',')] if pd.notna(row['required_skills']) else []
        
        # Format salary
        salary = "Not Available"
        if 'lowest_salary' in row and 'highest_salary' in row and pd.notna(row['lowest_salary']) and pd.notna(row['highest_salary']):
            try:
                low = int(float(row['lowest_salary']))
                high = int(float(row['highest_salary']))
                salary = f"₹{low:,} - ₹{high:,}"
            except ValueError:
                salary = f"{row['lowest_salary']} - {row['highest_salary']}"
        elif 'avg_salary_inr' in row and pd.notna(row['avg_salary_inr']):
            salary_str = str(row['avg_salary_inr'])
            salary = salary_str if salary_str.startswith('₹') else f"₹{salary_str}"
            
        JOB_REQUIREMENTS[title] = {
            "required_skills": skills,
            "expected_salary": salary,
            "domain": str(row['domain']) if pd.notna(row['domain']) else "N/A",
            "difficulty_level": str(row['difficulty_level']) if pd.notna(row['difficulty_level']) else "N/A",
            "ai_automation_risk": str(row['ai_automation_risk']) + "%" if pd.notna(row['ai_automation_risk']) else "N/A",
            "pros": [p.strip() for p in str(row['pros']).split(',')] if pd.notna(row['pros']) else [],
            "cons": [c.strip() for c in str(row['cons']).split(',')] if pd.notna(row['cons']) else [],
            "top_tools": [t.strip() for t in str(row['top_tools_technologies']).split(',')] if pd.notna(row['top_tools_technologies']) else []
        }
except Exception as e:
    print(f"Error loading CSV: {e}")
    # Fallback mocked job requirements
    JOB_REQUIREMENTS = {
        "data scientist": {
            "required_skills": ["python", "machine learning", "sql", "pandas", "statistics"],
            "expected_salary": "₹100,000 - ₹150,000",
            "domain": "Data Science",
            "difficulty_level": "Advanced",
            "ai_automation_risk": "Low",
            "pros": ["High Demand", "Great Salary"],
            "cons": ["Constant Learning", "Complex math"],
            "top_tools": ["Python", "Jupyter", "TensorFlow"]
        },
        "web developer": {
            "required_skills": ["html5", "css3", "javascript", "react", "node.js", "express"],
            "expected_salary": "₹70,000 - ₹120,000",
            "domain": "Software Engineering",
            "difficulty_level": "Intermediate",
            "ai_automation_risk": "Medium",
            "pros": ["Creative", "Remote Work"],
            "cons": ["Fast-changing tech", "Sitting long hours"],
            "top_tools": ["VS Code", "Git", "React"]
        },
        "ai engineer": {
            "required_skills": ["python", "deep learning", "nlp", "tensorflow", "pytorch"],
            "expected_salary": "₹120,000 - ₹180,000",
            "domain": "Artificial Intelligence",
            "difficulty_level": "Advanced",
            "ai_automation_risk": "Low",
            "pros": ["Future-proof", "High Salary"],
            "cons": ["Requires specialized degrees", "Highly theoretical"],
            "top_tools": ["PyTorch", "AWS", "CUDA"]
        }
    }

def simulate_career_path(user_skills: list[str], target_job: str) -> dict:
    target = target_job.lower().strip()
    
    if target not in JOB_REQUIREMENTS:
        close = get_close_matches(target, JOB_REQUIREMENTS.keys(), n=3, cutoff=0.5)
        error_obj = {"error": "Job role not found in knowledge base."}
        if close:
            error_obj["suggestions"] = [c.title() for c in close]
        return error_obj
        
    job_info = JOB_REQUIREMENTS[target]
    user_skills_set = set([s.lower().strip() for s in user_skills])
    
    present_skills = []
    missing_skills = []
    
    for req_skill in job_info.get("required_skills", []):
        if req_skill.lower().strip() in user_skills_set:
            present_skills.append(req_skill)
        else:
            missing_skills.append(req_skill)
    
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
        "learning_path": learning_path,
        "domain": job_info.get("domain", "N/A"),
        "difficulty_level": job_info.get("difficulty_level", "N/A"),
        "ai_automation_risk": job_info.get("ai_automation_risk", "N/A"),
        "pros": job_info.get("pros", []),
        "cons": job_info.get("cons", []),
        "top_tools": job_info.get("top_tools", [])
    }

def recommend_jobs(user_skills: list[str], top_n: int = 3) -> list[dict]:
    user_skills_set = set([s.lower().strip() for s in user_skills])
    recommendations = []
    
    for title, info in JOB_REQUIREMENTS.items():
        job_skills_set = set([s.lower().strip() for s in info.get("required_skills", [])])
        total_required = len(job_skills_set)
        
        if total_required == 0:
            continue
            
        matching_skills = user_skills_set.intersection(job_skills_set)
        match_percentage = (len(matching_skills) / total_required) * 100
        
        if match_percentage > 0 or len(user_skills_set) == 0: 
            recommendations.append({
                "target_job": title.title(),
                "match_percentage": float(f"{match_percentage:.1f}"),
                "expected_salary": info.get("expected_salary", "N/A"),
                "domain": info.get("domain", "N/A"),
                "missing_skills_count": total_required - len(matching_skills)
            })
            
    # Sort by highest match percentage first, then by fewest missing skills
    recommendations.sort(key=lambda x: (x["match_percentage"], -x["missing_skills_count"]), reverse=True)
    
    if not recommendations or recommendations[0]["match_percentage"] == 0:
        return [recommendations[i] for i in range(min(top_n, len(recommendations)))]
        
    return [recommendations[i] for i in range(min(top_n, len(recommendations)))]
