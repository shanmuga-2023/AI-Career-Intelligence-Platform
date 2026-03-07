def calculate_skill_match(user_skills: list[str], job_skills: list[str]) -> dict:
    # Convert lists to sets for set intersection
    user_set = set([skill.lower().strip() for skill in user_skills])
    job_set = set([skill.lower().strip() for skill in job_skills])
    
    # Matching Skills = Intersection(user_skills, job_skills)
    matching_skills = user_set.intersection(job_set)
    missing_skills = job_set.difference(user_set)
    
    # Score = |UserSkills ∩ JobSkills|
    score = len(matching_skills)
    total_required = len(job_set)
    
    if total_required > 0:
        val = (score / total_required) * 100
        match_percentage = float(f"{val:.2f}")
    else:
        match_percentage = 0.0

    return {
        "matching_skills": list(matching_skills),
        "missing_skills": list(missing_skills),
        "match_score": score,
        "total_required": total_required,
        "match_percentage": match_percentage
    }
