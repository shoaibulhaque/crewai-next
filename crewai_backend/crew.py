from job_manager import append_event
from agents import CompanyResearchAgents
from tasks import CompanyResearchTasks
from crewai import Crew


class CompanyResearchCrew:
    def __init__(self, job_id: str):
        self.job_id = job_id
        self.crew = None

    def setup_crew(self, companies: list[str], positions: list[str]):
        print(
            f"Setting up crew for {self.job_id} with companies {companies} and positions {positions}"
        )

        # SETUP AGENTS
        agents = CompanyResearchAgents()
        research_manager = agents.research_manager(companies, positions)
        company_research_agent = agents.company_research_agent()
        
        # SETUP TASKS
        tasks = CompanyResearchTasks(self.job_id)
        company_research_tasks = [
            tasks.company_research(company_research_agent, company, positions)
            for company in companies
        ]

        manage_research_task = tasks.manage_research(
            research_manager, companies, positions, company_research_tasks
        )

        # SETUP CREW
        self.crew = Crew(
            agents=[research_manager, company_research_agent],
            tasks=[*company_research_tasks, manage_research_task],
            verbose=True,
        )

    def kickoff(self):
        if not self.crew:
            print(f"No crew found for {self.job_id}")
            return

        append_event(self.job_id, "CREW_STARTED")
        try:
            print(f"Running crew for {self.job_id}")
            results = self.crew.kickoff()
            append_event(self.job_id, "CREW_COMPLETED")
            return results

        except Exception as e:
            append_event(self.job_id, f"CREW_ERROR: {str(e)}")
            return str(e)
