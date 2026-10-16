import { Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft} from "lucide-react";
function HRInterviewQuestions() {
    const navigate = useNavigate();

    const isStudent =
        localStorage.getItem("isLoggedIn") === "true" &&
        localStorage.getItem("userRole") === "student";

    if (!isStudent) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="resource-detail-page">
            <div className="resource-detail-container">
                <div className="hr-questions-wrapper">
                <h1>HR INTERVIEW QUESTIONS</h1>

                <p className="resource-detail-intro">
                    Practice commonly asked HR and behavioral interview
                    questions and prepare clear and professional responses.
                </p>

                {/* 1. Tell Me About Yourself */}
                <div className="resource-section">
                    <div className="resource-example">
                    <h2>1. Tell Me About Yourself</h2>
                    <p>
                        Prepare a short introduction covering your education,
                        technical skills, projects and career interests.
                    </p>

                    
                        <strong>Sample Answer 1 – Student:</strong>
                        <p>
                            I am a Computer Science and Engineering student
                            with a foundation in programming and full-stack
                            development. I enjoy solving real-world problems
                            through technology and have worked on academic
                            projects that helped me improve my technical and
                            problem-solving skills. I am now looking for an
                            opportunity to apply my knowledge, learn from
                            experienced professionals and contribute to a team.
                        </p>

                        <strong>Sample Answer 2 – Recent Graduate:</strong>
                        <p>
                            I recently graduated with a degree in Computer
                            Science and Engineering. During my studies, I
                            participated in academic activities and worked on
                            projects that gave me practical exposure to
                            programming and project work. These experiences
                            helped me develop teamwork, communication and
                            technical skills. I am eager to begin my career,
                            continue learning and contribute to meaningful
                            software projects.
                        </p>

                        <strong>Suggested Structure:</strong>
                        <ul>
                            <li>Greeting and brief introduction</li>
                            <li>Educational background</li>
                            <li>Technical skills</li>
                            <li>Projects or practical experience</li>
                            <li>Career interest</li>
                        </ul>
                    </div>
     

                {/* 2. Strengths */}
          
                    <div className="resource-example">
                    <h2>2. What Are Your Strengths?</h2>
                    <p>
                        Mention strengths relevant to the workplace, such as
                        communication, teamwork, problem-solving, willingness
                        to learn or time management.
                    </p>

                
                        <strong>Sample Answer 1:</strong>
                        <p>
                            I am analytical and detail-oriented, which helps
                            me approach problems carefully. I am also a strong
                            communicator, which makes collaboration easier
                            when working with others on a project.
                        </p>

                        <strong>Sample Answer 2:</strong>
                        <p>
                            One of my strengths is communication. I can share
                            ideas clearly and work with others to solve
                            problems. I am also willing to learn from feedback
                            and improve my skills. I try to use these strengths
                            during academic projects and team activities.
                        </p>

                        <p>
                            <strong>Tip:</strong> Support your strengths with
                            a genuine example whenever possible.
                        </p>
                        </div>
        
             

                {/* 3. Weaknesses */}
          
                    <div className="resource-example">
                    <h2>3. What Are Your Weaknesses?</h2>
                    <p>
                        Mention a genuine area you are working to improve and
                        explain the steps you are taking.
                    </p>

                 
                        <strong>Sample Answer 1:</strong>
                        <p>
                            I sometimes focus too much on small details because
                            I want my work to be accurate. I am learning to
                            balance quality with time by setting priorities
                            and deadlines for each task.
                        </p>

                        <strong>Sample Answer 2:</strong>
                        <p>
                            Earlier, I was hesitant to express my ideas in
                            group discussions. I have been working on this by
                            participating more actively in classroom
                            discussions and presentations. These experiences
                            are helping me become more confident.
                        </p>
                    </div>
 

                {/* 4. Why Should We Hire You */}
             
                    <div className="resource-example">
                    <h2>4. Why Should We Hire You?</h2>
                    <p>
                        Explain how your technical skills, adaptability,
                        projects and willingness to learn match the role.
                    </p>

                
                        <strong>Sample Answer 1:</strong>
                        <p>
                            I bring a strong foundation in software development,
                            a collaborative mindset and a passion for
                            continuous learning. I am ready to apply the skills
                            I have developed through my studies and projects
                            while continuing to grow with your team.
                        </p>

                        <strong>Sample Answer 2:</strong>
                        <p>
                            I bring a fresh perspective and enthusiasm to this
                            role. I am a fast learner, adaptable and willing
                            to take responsibility. I am excited to apply my
                            technical knowledge, learn from the team and
                            contribute to the work.
                        </p>
                    </div>


                {/* 5. Why This Company */}

                    <div className="resource-example">
                    <h2>5. Why Do You Want to Join Our Company?</h2>
                    <p>
                        Research the company before the interview. Explain
                        your interest using information about its work and
                        the position.
                    </p>

                  
                        <strong>Sample Answer:</strong>
                        <p>
                            Your company has a strong reputation for innovation
                            and delivering quality solutions in the industry.
                            I am particularly interested in the way your teams
                            focus on problem-solving and continuous improvement.
                            My academic background and project experience have
                            helped me develop analytical thinking and teamwork
                            skills. I see this opportunity as a place where I
                            can learn from experienced professionals, contribute
                            my efforts and grow while adding value to the
                            organization.
                        </p>

                        <p>
                            <strong>Avoid generic answers such as:</strong>{" "}
                            "I need a job" or "Your company has a good
                            reputation." Personalize your response after
                            researching the company.
                        </p>
                    </div>
  
                {/* 6. Five-Year Goal */}
          
                    <div className="resource-example">
                    <h2>6. Where Do You See Yourself in Five Years?</h2>
                    <p>
                        Discuss your professional development goals and
                        interest in gaining expertise and taking on greater
                        responsibilities.
                    </p>

                 
                        <strong>Sample Answer:</strong>
                        <p>
                            In the next five years, I plan to strengthen my
                            technical expertise, collaborate on more complex
                            projects and learn from experienced professionals.
                            I also hope to take on greater responsibilities as
                            I gain experience and continue improving my skills.
                        </p>
                    </div>
                {/* 7. Motivation */}
         
                    <div className="resource-example">
                    <h2>7. What Motivates You?</h2>
                    <p>
                        Explain what encourages you to work consistently and
                        achieve your goals.
                    </p>

               
                        <strong>Sample Answer 1:</strong>
                        <p>
                            What motivates me is the desire to be better than
                            yesterday. I want to keep improving myself so that
                            I can become the best possible version of myself.
                        </p>

                        <strong>Sample Answer 2:</strong>
                        <p>
                            I feel most motivated when I set a goal and work
                            consistently until I achieve it. Planning a task,
                            staying disciplined and completing it successfully
                            gives me a strong sense of satisfaction. Working
                            toward clear milestones in a project also motivates
                            me.
                        </p>

   
</div>
                {/* 8. Career Choice */}
           
                    <div className="resource-example">
                    <h2>8. Why Did You Choose This Career?</h2>
                    <p>
                        Explain your interest in software development and how
                        your education and learning experiences influenced
                        your career choice.
                    </p>

                
                        <strong>Sample Answer:</strong>
                        <p>
                            I have always been interested in technology and
                            its potential to solve real-world problems.
                            Software development allows me to combine
                            creativity with logical thinking. I enjoy learning
                            how applications are designed and built, and I
                            want to use these skills to develop useful solutions.
                        </p>
                    </div>


                {/* 9. Good Fit */}
           
                    <div className="resource-example">
                    <h2>9. Why Are You a Good Fit for This Job?</h2>
                    <p>
                        Connect your technical skills, adaptability, project
                        experience and attitude with the requirements of
                        the position.
                    </p>

            
                        <strong>Sample Answer:</strong>
                        <p>
                            My technical skills, adaptability and proactive
                            attitude make me a good match for this role. I am
                            willing to learn, apply feedback and work
                            collaboratively. I am eager to apply what I have
                            learned and contribute meaningfully to the team.
                        </p>
                    </div>
               
   

                {/* 10. Teamwork */}
            
                    <div className="resource-example">
                    <h2>10. Tell Me About a Time You Worked in a Team</h2>
                    <p>
                        Interviewers use this question to understand your
                        teamwork, communication, collaboration and ability
                        to take responsibility. Academic projects, college
                        events, sports teams, volunteer activities and group
                        presentations can be used as examples.
                    </p>

            
                        <strong>Use the STAR Method:</strong>
                        <ul>
                            <li>
                                <strong>Situation:</strong> Describe the
                                situation.
                            </li>
                            <li>
                                <strong>Task:</strong> Explain your
                                responsibility.
                            </li>
                            <li>
                                <strong>Action:</strong> Explain what you did.
                            </li>
                            <li>
                                <strong>Result:</strong> Explain the outcome.
                            </li>
                        </ul>

                        <strong>Sample Answer:</strong>
                        <p>
                            During my final year in college, I worked as part
                            of a team on an academic project. Our objective
                            was to develop a system that could simplify a
                            practical problem.
                        </p>

                        <p>
                            <strong>Task:</strong> We divided the work based
                            on each member's strengths. I was responsible for
                            coordinating team discussions and helping with
                            research and documentation.
                        </p>

                        <p>
                            <strong>Action:</strong> When we had different
                            opinions about the approach, we discussed our
                            ideas openly and agreed on solutions that
                            supported the project's goals. We communicated
                            regularly and supported one another.
                        </p>

                        <p>
                            <strong>Result:</strong> We completed the project
                            and presented it to the faculty on time. The
                            experience taught me the importance of
                            communication, cooperation and respecting
                            different perspectives.
                        </p>

                        <p>
                            <strong>Note:</strong> Replace this example with
                            a real project or team experience of your own.
                        </p>
      </div>
               

                {/* 11. Deadlines */}
       
                    <div className="resource-example">
                    <h2>11. How Do You Manage Deadlines?</h2>
                    <p>
                        Explain how you prioritize tasks and manage your time
                        when several activities have deadlines.
                    </p>

                    
                        <strong>Sample Answer:</strong>
                        <p>
                            I manage deadlines by creating a detailed schedule
                            and prioritizing tasks based on urgency. During a
                            group project, we had a short deadline to submit
                            our research findings. I helped divide the work,
                            made sure everyone understood their responsibilities
                            and worked with the team to complete the work on
                            time.
                        </p>
                    </div>
       
                {/* 12. Challenge */}
           
                    <div className="resource-example">
                    <h2>12. Tell Me About a Challenge You Faced</h2>
                    <p>
                        Choose a real challenge from a project, academic
                        activity or learning experience and explain how
                        you solved it.
                    </p>

               
                        <strong>Sample Answer:</strong>
                        <p>
                            During an academic project, our application was
                            not retrieving data from the database correctly.
                            I reviewed the code and database queries,
                            researched possible solutions and worked with my
                            team to identify the issue. We corrected the error
                            and tested the system again. This experience
                            helped me improve my problem-solving and debugging
                            skills.
                        </p>

                        <p>
                            <strong>Other examples of challenges:</strong>
                        </p>
                        <ul>
                            <li>Debugging a coding error</li>
                            <li>Completing a project within a short deadline</li>
                            <li>Learning a new programming tool quickly</li>
                            <li>Resolving a team disagreement</li>
                        </ul>
                    </div>


                {/* 13. Industry Trends */}
           
                    <div className="resource-example">
                    <h2>13. How Do You Stay Updated With Industry Trends?</h2>
                    <p>
                        Explain how you continue learning after completing
                        your academic studies.
                    </p>

                
                        <strong>Sample Answer:</strong>
                        <p>
                            I try to stay updated with industry trends by
                            regularly following reliable technology blogs,
                            professional forums and educational platforms.
                            I also watch webinars and online tutorials related
                            to my field to understand how new tools and
                            technologies are used in the industry.
                        </p>

                        <p>
                            In addition, I practise what I learn by exploring
                            small projects and assignments so that my
                            knowledge becomes more practical. I believe
                            staying aware of industry developments helps me
                            continuously improve my skills and adapt to new
                            technologies.
                        </p>

                        <strong>Ways to keep learning:</strong>
                        <ul>
                            <li>Technology blogs</li>
                            <li>Professional forums</li>
                            <li>Educational platforms</li>
                            <li>Webinars</li>
                            <li>Online tutorials</li>
                            <li>Small projects and assignments</li>
                        </ul>
                    </div>
      

                {/* 14. Mistake */}
            
                    <div className="resource-example">
                    <h2>14. Tell Me About a Mistake You Made</h2>
                    <p>
                        Choose a genuine mistake and focus on what you learned
                        and how you changed your approach afterwards.
                    </p>

                        <strong>Sample Answer – STAR Method:</strong>

                        <p>
                            <strong>Situation:</strong> I once accepted several
                            tasks at the same time because I wanted to complete
                            as much work as possible.
                        </p>

                        <p>
                            <strong>Task:</strong> I needed to finish each task
                            within its deadline, but I had not estimated the
                            time required carefully enough.
                        </p>

                        <p>
                            <strong>Action:</strong> I reviewed my priorities
                            and started keeping a task list with realistic
                            time estimates. I also learned to communicate
                            early when priorities need clarification.
                        </p>

                        <p>
                            <strong>Result:</strong> This helped me plan my
                            work more carefully and balance quality with
                            deadlines. I learned to assess my workload before
                            committing to tasks.
                        </p>

                        <p>
                            <strong>Note:</strong> Use a real mistake from
                            your own experience and explain what you learned.
                        </p>
                    </div>
           

                {/* 15. Toughest Decision */}
       
                    <div className="resource-example">
                    <h2>15. What Was the Toughest Decision You Made?</h2>
                    <p>
                        Explain the situation, the options you considered and
                        the factors you used to make your decision.
                    </p>

                 
                        <strong>Sample Answer:</strong>
                        <p>
                            One of the toughest decisions I faced was choosing
                            between competing academic priorities. I considered
                            the deadlines, the importance of each task and how
                            each choice aligned with my goals before deciding
                            how to allocate my time.
                        </p>

                        <p>
                            <strong>Tip:</strong> If you have a relevant real
                            example, such as choosing between opportunities,
                            explain the options and why you selected one.
                        </p>
                    </div>
 

                {/* 16. Hobbies */}
        
                    <div className="resource-example">
                    <h2>16. Tell Us About Your Hobbies and Interests</h2>
                    <p>
                        Mention genuine hobbies and explain them naturally.
                        Choose interests that you can comfortably discuss
                        during the interview.
                    </p>

              
                        <strong>Sample Answer:</strong>
                        <p>
                            I enjoy creative activities and learning new
                            things. In my free time, I like working on hobbies
                            that help me stay curious and focused. I also try
                            to keep learning about technology and improving
                            my skills.
                        </p>

                        <p>
                            <strong>Tip:</strong> Replace this with your real
                            hobbies and interests.
                        </p>
                    </div>


                {/* 17. Relocation */}
           
                    <div className="resource-example">
                    <h2>17. Are You Willing to Relocate?</h2>
                    <p>
                        Answer honestly based on your personal circumstances
                        and the requirements of the position.
                    </p>

                   
                        <strong>Example if you are willing to relocate:</strong>
                        <p>
                            Yes, I am open to relocating for the right
                            opportunity. I would be happy to discuss the
                            location and requirements of the role.
                        </p>

                        <strong>Example if you have limitations:</strong>
                        <p>
                            I am interested in the role. I do have some
                            location considerations, and I would appreciate
                            discussing the available options.
                        </p>
                   
     </div>

                {/* 18. Questions for Interviewer */}
            
                    <div className="resource-example">
                    <h2>18. Do You Have Any Questions for Us?</h2>
                    <p>
                        Prepare professional questions about the role, team,
                        technologies, learning opportunities or recruitment
                        process.
                    </p>

                
                        <strong>Questions you can ask:</strong>
                        <ul>
                            <li>
                                What would the main responsibilities be for
                                someone starting in this role?
                            </li>
                            <li>What technologies or tools does the team use?</li>
                            <li>
                                What learning and development opportunities
                                are available?
                            </li>
                            <li>
                                What are the next steps in the recruitment
                                process?
                            </li>
                        </ul>
                </div>
              </div>
</div>
                {/* Behavioral Interview Preparation */}
                <div className="resource-section">
                    <h2>Behavioral Interview Preparation</h2>
                    <p>
                        Prepare examples for the following situations:
                    </p>

                    <ul>
                        <li>Leadership</li>
                        <li>Teamwork</li>
                        <li>Decision making</li>
                        <li>Handling pressure</li>
                        <li>Overcoming challenges</li>
                        <li>Learning from failures</li>
                    </ul>

                    <div className="resource-example">
                        <strong>Use the STAR Method:</strong>
                        <ul>
                            <li>
                                <strong>Situation:</strong> Describe the
                                context.
                            </li>
                            <li>
                                <strong>Task:</strong> Explain your
                                responsibility.
                            </li>
                            <li>
                                <strong>Action:</strong> Describe what you did.
                            </li>
                            <li>
                                <strong>Result:</strong> Explain the outcome
                                and what you learned.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Emotional Intelligence */}
<div className="resource-section">
    <h2>Emotional Intelligence</h2>

    <p>
        Emotional intelligence is the ability to understand and manage
        your emotions, respond constructively to others, handle conflicts,
        accept feedback and maintain professional relationships.
    </p>

    {/* 1. Negative Feedback */}
    <div className="resource-example">
        <h3>
            1. Tell Me About a Time You Received Negative Feedback.
            How Did You Handle It?
        </h3>

        <strong>Sample Answer – STAR Method</strong>

        <p>
            <strong>Situation:</strong> During my mini-project
            presentation, my mentor said that my explanation was too
            technical and confusing.
        </p>

        <p>
            <strong>Task:</strong> I needed to improve my communication
            before the final review.
        </p>

        <p>
            <strong>Action:</strong> I simplified the explanation,
            added visuals and practised explaining the project to
            people without a technical background.
        </p>

        <p>
            <strong>Result:</strong> In the final presentation, the
            panel appreciated my clarity. I realized that communication
            is just as important as technical skills.
        </p>
    </div>

    {/* 2. Weakness */}
    <div className="resource-example">
        <h3>
            2. What Is One of Your Weaknesses, and How Are You
            Working on It?
        </h3>

        <strong>Sample Answer</strong>

        <p>
            Earlier, I hesitated to speak up in group discussions.
            I wanted to become more confident in expressing my ideas.
            I started participating in classroom presentations and
            speaking activities. Over time, I became more comfortable
            sharing my opinions confidently.
        </p>
    </div>

    {/* 3. Admitting a Mistake */}
    <div className="resource-example">
        <h3>
            3. Describe a Situation Where You Realized You Were Wrong.
            What Did You Do?
        </h3>

        <strong>Sample Answer</strong>

        <p>
            During a group project, I initially believed that my
            approach was the best way to solve a problem. After
            discussing it with my teammates, I realized that another
            approach was more suitable. I listened to their reasoning,
            accepted my mistake and helped implement the improved
            solution. This taught me to remain open-minded and consider
            different perspectives before making decisions.
        </p>
    </div>

    {/* 4. Frustration with a Colleague */}
    <div className="resource-example">
        <h3>
            4. Have You Ever Felt Frustrated with a Colleague?
            How Did You Handle It?
        </h3>

        <strong>Sample Answer</strong>

        <p>
            During event planning, a team member frequently missed
            deadlines. I needed to maintain team coordination, so I
            spoke calmly with the person privately instead of
            criticizing them publicly. I listened to their concerns
            and discussed how we could manage the work more effectively.
            The person responded positively, and our teamwork became
            smoother.
        </p>
    </div>

    {/* 5. Unexpected Problems */}
    <div className="resource-example">
        <h3>5. Describe a Time When Things Didn't Go as Planned.</h3>

        <strong>Sample Answer</strong>

        <p>
            During an academic project, we faced an unexpected
            technical issue shortly before our demonstration.
            Instead of becoming discouraged, I worked with my teammates
            to identify the problem and look for a solution. We
            prioritized the most important tasks, tested the changes
            and prepared an alternative explanation in case the issue
            continued. The experience taught me to stay flexible and
            focus on solutions when plans change.
        </p>
    </div>

    {/* 6. Emotional Response */}
    <div className="resource-example">
        <h3>6. How Did You Respond Emotionally?</h3>

        <strong>Sample Answer</strong>

        <p>
            Our demonstration application crashed just before the
            presentation, and we had very little time to recover.
            Instead of panicking, I focused on identifying the issue
            while my teammate explained the concept to the panel.
            We managed the situation professionally and learned the
            importance of staying calm under pressure.
        </p>
    </div>

    {/* 7. Building Trust */}
    <div className="resource-example">
        <h3>7. How Do You Build Trust with New Team Members?</h3>

        <strong>Sample Answer</strong>

        <p>
            During a group activity, I worked with teammates who
            were unfamiliar with one another. We needed to collaborate
            quickly, so I communicated openly, shared progress
            regularly and supported teammates when they needed help.
            By respecting everyone's ideas and completing my
            responsibilities, I helped build trust within the team.
            We became more comfortable working together and completed
            the task effectively.
        </p>
    </div>

    {/* 8. Influence Without Authority */}
    <div className="resource-example">
        <h3>
            8. Describe a Time When You Had to Influence Someone
            Without Authority.
        </h3>

        <strong>Sample Answer</strong>

        <p>
            During a group project, I noticed that our original
            approach might take longer than expected. Although I
            was not the team leader, I explained my concerns and
            suggested an alternative approach. I shared the reasons
            for my suggestion and listened to my teammates' opinions.
            After discussing the options, we agreed on a more
            practical plan. This taught me that influencing others
            requires clear communication, evidence and respect
            for different viewpoints.
        </p>
    </div>

    {/* 9. Handling Pressure */}
    <div className="resource-example">
        <h3>
            9. How Do You Handle Pressure When Multiple Deadlines
            Are Approaching?
        </h3>

        <strong>Sample Answer</strong>

        <p>
            During the end of a semester, I had project submissions
            and examinations in the same week. I needed to manage
            both effectively. I prioritized tasks, created a schedule
            and focused on one task at a time instead of panicking.
            I reviewed my progress regularly and adjusted my schedule
            when necessary. This helped me manage my responsibilities
            and improve my time-management skills.
        </p>
    </div>

    {/* 10. Sensitive Underperforming Teammate */}
    <div className="resource-example">
        <h3>
            10. If Your Teammate Is Not Performing but Is Very
            Sensitive, How Would You Handle It?
        </h3>

        <strong>Sample Answer</strong>

        <p>
            I would approach the teammate privately and respectfully
            rather than criticizing them in front of others. I would
            first try to understand whether they were facing any
            difficulties with their tasks. Then, I would explain
            how the delay affects the team's progress and discuss
            possible solutions. I would offer support where possible
            and agree on clear, achievable deadlines. My aim would
            be to improve performance while maintaining a positive
            working relationship.
        </p>
    </div>

    {/* 11. Handling Conflict */}
    <div className="resource-example">
        <h3>11. How Do You Handle Disagreements in a Team?</h3>

        <strong>Sample Answer</strong>

        <p>
            When disagreements arise, I try to remain calm and listen
            to each person's point of view. I focus on the problem
            rather than making it personal. I explain my reasoning,
            consider other suggestions and work with the team to
            find a solution that supports our common goal. I believe
            respectful communication helps prevent small disagreements
            from becoming bigger problems.
        </p>
    </div>

    {/* 12. Managing Emotions */}
    <div className="resource-example">
        <h3>12. How Do You Manage Your Emotions in Difficult Situations?</h3>

        <strong>Sample Answer</strong>

        <p>
            When I face a difficult situation, I try to pause before
            reacting. I assess the problem, identify what I can
            control and consider the possible solutions. If necessary,
            I take a short break to organize my thoughts before
            discussing the issue. This helps me respond thoughtfully
            rather than allowing frustration or stress to affect
            my decisions.
        </p>
    </div>

    {/* Key Preparation Tips */}
    <div className="resource-example">
        <h3>Tips for Answering Emotional Intelligence Questions</h3>

        <ul>
            <li>Stay calm and professional when describing challenges.</li>
            <li>Accept responsibility instead of blaming others.</li>
            <li>Show that you can accept feedback and learn from mistakes.</li>
            <li>Explain how you communicate during disagreements.</li>
            <li>Describe the actions you took, not just your feelings.</li>
            <li>End with the result or lesson you learned.</li>
            <li>Use genuine examples from academic projects, presentations,
                college activities or teamwork.</li>
        </ul>
    </div>
</div>

                <button
                    className="back-resource-button"
                    onClick={() => navigate("/career-resources")}
                >
                 <ChevronLeft size={18} />    Back to Career Resources
                </button>
            </div>
            
        </div>
    );
}


export default HRInterviewQuestions;