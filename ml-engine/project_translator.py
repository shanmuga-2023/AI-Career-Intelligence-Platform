def get_ai_translation(proj_name: str, proj_desc: str, tech_stack: str) -> dict:
    """
    Dummy logic to handle the LLM generation (to be replaced later).
    Translates a project description into different career views.
    """
    return {
        "recruiter_view": f"Key Skills: {tech_stack}. Successfully built '{proj_name}' demonstrating practical experience in software development and problem-solving.",
        "tech_lead_view": f"Developed '{proj_name}' utilizing {tech_stack}. Addressed technical challenges by building a robust architecture to support: {proj_desc}.",
        "elevator_pitch": f"Hi, I'm the developer behind {proj_name}. It's a project using {tech_stack} that does {proj_desc}. It showcases my ability to deliver end-to-end solutions from concept to deployment."
    }
