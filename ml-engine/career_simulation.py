import pandas as pd
import os
from difflib import get_close_matches
import base64
import io
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

current_dir = os.path.dirname(os.path.abspath(__file__))
# Loading the new enriched CSV data
csv_path = os.path.join(current_dir, 'career_enriched_fixed (3).csv')
interest_path = os.path.join(current_dir, 'interest.csv')
career_interest_path = os.path.join(current_dir, 'career_interest.csv')

INTEREST_MAP = {}
try:
    int_df = pd.read_csv(interest_path)
    for _, row in int_df.iterrows():
        INTEREST_MAP[int(row['interest_id'])] = str(row['interest']).strip()
except Exception:
    pass

CAREER_INTERESTS = {}
try:
    ci_df = pd.read_csv(career_interest_path)
    for _, row in ci_df.iterrows():
        c_id = int(row['career_id'])
        i_id = int(row['interest_id'])
        if c_id not in CAREER_INTERESTS:
            CAREER_INTERESTS[c_id] = []
        if i_id in INTEREST_MAP:
            CAREER_INTERESTS[c_id].append(INTEREST_MAP[i_id])
except Exception:
    pass

JOB_REQUIREMENTS = {}
try:
    df = pd.read_csv(csv_path, encoding='utf-8')
    historical_data = {}
    if 'year' in df.columns:
        for index, row in df.iterrows():
            title = str(row['career_name']).lower().strip()
            if title not in historical_data:
                historical_data[title] = []
            if pd.notna(row['year']) and pd.notna(row['openings']):
                try:
                    historical_data[title].append({'year': int(row['year']), 'openings': int(row['openings'])})
                except ValueError:
                    pass
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
                salary = f"INR {low:,} - {high:,}"
            except ValueError:
                salary = f"INR {row['lowest_salary']} - {row['highest_salary']}"
        elif 'avg_salary_inr' in row and pd.notna(row['avg_salary_inr']):
            salary_str = str(row['avg_salary_inr']).replace('₹', '').replace('â€“', '-').replace('–', '-').strip()
            salary = f"INR {salary_str}"
            
        c_id = int(row['career_id']) if 'career_id' in row and pd.notna(row['career_id']) else -1
        interests = CAREER_INTERESTS.get(c_id, [])
            
        JOB_REQUIREMENTS[title] = {
            "required_skills": skills,
            "required_interests": interests,
            "expected_salary": salary,
            "domain": str(row['domain']) if pd.notna(row['domain']) else "N/A",
            "difficulty_level": str(row['difficulty_level']) if pd.notna(row['difficulty_level']) else "N/A",
            "ai_automation_risk": str(row['ai_automation_risk']) + "%" if pd.notna(row['ai_automation_risk']) else "N/A",
            "pros": [p.strip() for p in str(row['pros']).split(',')] if pd.notna(row['pros']) else [],
            "cons": [c.strip() for c in str(row['cons']).split(',')] if pd.notna(row['cons']) else [],
            "top_tools": [t.strip() for t in str(row['top_tools_technologies']).split(',')] if pd.notna(row['top_tools_technologies']) else [],
            "job_description": str(row['job_description']).strip() if 'job_description' in row and pd.notna(row['job_description']) else "N/A",
            "historical_openings": historical_data.get(title, [])
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

from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

def generate_openings_plot(historical_data, target_job):
    if not historical_data or len(historical_data) < 2:
        return None
        
    historical_data.sort(key=lambda x: x['year'])
    years = [d['year'] for d in historical_data]
    openings = [d['openings'] for d in historical_data]
    
    X = np.array(years)
    y = np.array(openings)
    
    try:
        z = np.polyfit(X, y, 1)
        p = np.poly1d(z)
        
        last_year = years[-1]
        pred_years = [last_year + 1, last_year + 2, last_year + 3]
        pred_openings = p(pred_years)
        
        # Ensure no negative predictions
        pred_openings = np.maximum(pred_openings, 0)
        
        fig = Figure(figsize=(10, 5))
        canvas = FigureCanvas(fig)
        ax = fig.add_subplot(111)
        
        ax.plot(years, openings, marker='o', label='Historical', color='#0d6efd', linewidth=2)
        ax.plot(pred_years, pred_openings, marker='X', linestyle='--', label='Projected (3 Yrs)', color='#198754', linewidth=2)
        
        all_years = years + pred_years
        
        ax.set_title(f"Market Demand Trend: {target_job.title()}", fontsize=14, pad=15)
        ax.set_xlabel("Year", fontsize=11)
        ax.set_ylabel("Number of Openings", fontsize=11)
        ax.set_xticks(all_years)
        
        ax.get_yaxis().set_major_formatter(matplotlib.ticker.FuncFormatter(lambda x, pos: format(int(x), ',')))
        
        ax.grid(True, linestyle='--', alpha=0.7)
        ax.legend(loc='lower center', bbox_to_anchor=(0.5, -0.2), ncol=2)
        fig.tight_layout()
        
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        
        return f"data:image/png;base64,{img_base64}"
    except Exception as e:
        print(f"Error generating plot: {e}")
        return None

def get_matched_skills(user_skills_set, job_skills_set):
    skill_aliases = {
        "aws": ["cloud", "amazon web services", "infrastructure"],
        "azure": ["cloud", "microsoft azure", "infrastructure"],
        "gcp": ["cloud", "google cloud", "infrastructure"],
        "cybersecurity": ["security", "penetration testing", "firewall", "encryption"],
        "ui/ux design": ["ui", "ux", "user interface", "user experience"],
        "figma": ["wireframing", "prototyping", "design systems", "ui", "ux"],
        "adobe xd": ["wireframing", "prototyping", "design systems", "ui", "ux"],
        "vue.js": ["vue"],
        "angular": ["angular"],
        "react": ["react"],
        "node.js": ["node"],
        "agile/scrum": ["agile", "scrum"],
        "machine learning": ["ml", "algorithms"],
        "artificial intelligence": ["ai"],
        "deep learning": ["dl", "neural networks", "cnns", "transformers"],
        "c++": ["c/c++", "c#/c++", "embedded c++"],
        "c#": ["c#/c++", "c#"],
        "java": ["java programming", "python/java"]
    }
    
    matching_skills = set()
    for u_skill in user_skills_set:
        match_terms = skill_aliases.get(u_skill, []) + [u_skill]
        for j_skill in job_skills_set:
            for term in match_terms:
                if term in j_skill or j_skill in term:
                    matching_skills.add(j_skill)
                    break
    return matching_skills

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
    
    job_skills = job_info["required_skills"]
    plot_base64 = generate_openings_plot(job_info.get("historical_openings", []), target_job.title())
    
    user_skills_set = set([s.lower().strip() for s in user_skills])
    job_skills_set = set([s.lower().strip() for s in job_skills])
    
    matched_job_skills = get_matched_skills(user_skills_set, job_skills_set)
    present_skills = list(matched_job_skills)
    missing_skills = list(job_skills_set.difference(matched_job_skills))
    
    return {
        "target_job": target_job.title(),
        "job_description": job_info.get("job_description", "N/A"),
        "openings_plot_base64": plot_base64,
        "required_skills": job_info["required_skills"],
        "present_skills": present_skills,
        "missing_skills": missing_skills,
        "expected_salary": job_info["expected_salary"],
        "domain": job_info["domain"],
        "difficulty_level": job_info["difficulty_level"],
        "ai_automation_risk": job_info["ai_automation_risk"],
        "pros": job_info["pros"],
        "cons": job_info["cons"],
        "learning_path": [
            f"Master {m}" for m in missing_skills[:3]
        ] + ["Build a portfolio project", "Start applying for junior roles"]
    }

def recommend_jobs(user_skills: list[str], user_interests: list[str] = [], top_n: int = 3) -> list[dict]:
    user_skills_set = set([s.lower().strip() for s in user_skills])
    user_interests_set = set([i.lower().strip() for i in (user_interests or [])])
    recommendations = []
    
    for title, info in JOB_REQUIREMENTS.items():
        job_skills_set = set([s.lower().strip() for s in info.get("required_skills", [])])
        job_interests_set = set([i.lower().strip() for i in info.get("required_interests", [])])
        
        total_required_skills = len(job_skills_set)
        total_required_interests = len(job_interests_set)
        
        if total_required_skills == 0 and total_required_interests == 0:
            continue
            
        matched_job_skills = get_matched_skills(user_skills_set, job_skills_set)
        matching_interests = user_interests_set.intersection(job_interests_set)
        
        skill_score = (len(matched_job_skills) / total_required_skills) * 100 if total_required_skills > 0 else 0
        interest_score = (len(matching_interests) / total_required_interests) * 100 if total_required_interests > 0 else 0
        
        if len(user_skills_set) == 0 and len(user_interests_set) == 0:
            match_percentage = 0.0
        elif len(user_skills_set) == 0:
            match_percentage = interest_score
        elif len(user_interests_set) == 0:
            match_percentage = skill_score
        else:
            match_percentage = (skill_score * 0.7) + (interest_score * 0.3)
        
        if match_percentage > 0 or (len(user_skills_set) == 0 and len(user_interests_set) == 0): 
            recommendations.append({
                "target_job": title.title(),
                "match_percentage": float(f"{match_percentage:.1f}"),
                "expected_salary": info.get("expected_salary", "N/A"),
                "domain": info.get("domain", "N/A"),
                "missing_skills_count": total_required_skills - len(matched_job_skills)
            })
            
    # Sort by highest match percentage first, then by fewest missing skills
    recommendations.sort(key=lambda x: (x["match_percentage"], -x["missing_skills_count"]), reverse=True)
    
    if len(recommendations) == 0:
        return []
        
    return [recommendations[i] for i in range(min(top_n, len(recommendations)))]
