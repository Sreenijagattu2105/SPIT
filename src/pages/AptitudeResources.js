
import { Navigate, useNavigate } from "react-router-dom";
import { ChevronLeft} from "lucide-react";
function AptitudeResources() {
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

                <h1>APTITUDE RESOURCES</h1>

                <p className="resource-detail-intro">
                    Prepare for placement aptitude tests with important topics,
                    formulas, problem-solving techniques, practice strategies,
                    and mock test guidance commonly used in recruitment assessments.
                </p>

                {/* Quantitative Aptitude */}

                <div className="resource-section">
                    <h2>Quantitative Aptitude</h2>

                    <p>
                        Quantitative aptitude tests your numerical ability,
                        mathematical understanding, calculation speed, and
                        problem-solving skills.
                    </p>
<div className="resource-topic-box">
                    <h3>1. Number Systems</h3>
                    <ul>
                        <li>Natural numbers, whole numbers, integers, rational and irrational numbers.</li>
                        <li>Prime numbers and composite numbers.</li>
                        <li>Factors and multiples.</li>
                        <li>Divisibility rules.</li>
                        <li>HCF and LCM.</li>
                        <li>Remainders and unit digits.</li>
                        <li>Even and odd numbers.</li>
                        <li>Squares, cubes, square roots, and cube roots.</li>
                        <li>Number patterns and cyclicity.</li>
                    </ul>
</div>
<div className="resource-topic-box">
                    <h3>2. Percentages</h3>
                    <ul>
                        <li>Conversion between fractions, decimals, and percentages.</li>
                        <li>Percentage increase and decrease.</li>
                        <li>Successive percentage changes.</li>
                        <li>Percentage of a quantity.</li>
                        <li>Population growth and depreciation problems.</li>
                        <li>Percentage-based comparison questions.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>3. Profit, Loss and Discount</h3>
                    <ul>
                        <li>Cost price and selling price.</li>
                        <li>Profit and loss percentages.</li>
                        <li>Marked price and discount.</li>
                        <li>Successive discounts.</li>
                        <li>Finding selling price when profit or loss is given.</li>
                        <li>Problems involving dishonest weights.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>4. Ratio, Proportion and Partnership</h3>
                    <ul>
                        <li>Basic ratios and equivalent ratios.</li>
                        <li>Direct and inverse proportion.</li>
                        <li>Division of amounts in a given ratio.</li>
                        <li>Partnership investment and profit sharing.</li>
                        <li>Mixtures and alligation.</li>
                        <li>Age-related ratio problems.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>5. Averages and Mixtures</h3>
                    <ul>
                        <li>Simple averages.</li>
                        <li>Weighted averages.</li>
                        <li>Average age problems.</li>
                        <li>Average speed.</li>
                        <li>Finding a missing value using the average.</li>
                        <li>Replacement and mixture problems.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>6. Time and Work</h3>
                    <ul>
                        <li>Work completed per day.</li>
                        <li>Combined work of two or more people.</li>
                        <li>Efficiency and work ratios.</li>
                        <li>Work and wages.</li>
                        <li>Pipes and cisterns.</li>
                        <li>Problems involving alternate working days.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>7. Time, Speed and Distance</h3>
                    <ul>
                        <li>Distance, speed, and time calculations.</li>
                        <li>Conversion between km/h and m/s.</li>
                        <li>Average speed.</li>
                        <li>Relative speed.</li>
                        <li>Train problems.</li>
                        <li>Boats and streams.</li>
                        <li>Race and circular track problems.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>8. Simple and Compound Interest</h3>
                    <ul>
                        <li>Principal, rate, time, and interest.</li>
                        <li>Simple interest calculations.</li>
                        <li>Compound interest calculations.</li>
                        <li>Difference between simple and compound interest.</li>
                        <li>Annual, half-yearly, and quarterly compounding.</li>
                        <li>Growth and depreciation calculations.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>9. Algebra and Equations</h3>
                    <ul>
                        <li>Linear equations in one and two variables.</li>
                        <li>Quadratic equations.</li>
                        <li>Algebraic identities.</li>
                        <li>Polynomials and factorization.</li>
                        <li>Inequalities.</li>
                        <li>Problems based on algebraic expressions.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>10. Probability and Combinatorics</h3>
                    <ul>
                        <li>Basic probability.</li>
                        <li>Favourable outcomes and total outcomes.</li>
                        <li>Independent and dependent events.</li>
                        <li>Permutations and arrangements.</li>
                        <li>Combinations and selections.</li>
                        <li>Problems involving coins, dice, and cards.</li>
                    </ul>
                </div>
<div className="resource-topic-box">
                    <h3>11. Other Important Topics</h3>
                    <ul>
                        <li>Problems on ages.</li>
                        <li>Problems on clocks and calendars.</li>
                        <li>Mensuration: area, perimeter, volume, and surface area.</li>
                        <li>Geometry and basic trigonometry.</li>
                        <li>Data interpretation using tables, charts, and graphs.</li>
                        <li>Data sufficiency.</li>
                    </ul>
                </div>
</div>
                {/* Important Quantitative Formulas */}

                <div className="resource-section">
                    <h2>Important Quantitative Aptitude Formulas</h2>

<div className="resource-topic-box">
                    <h3>1. Percentage</h3>
                    <ul>
                        <li>Percentage = (Part / Whole) × 100</li>
                        <li>Percentage change = (Change / Original Value) × 100</li>
                        <li>New value after an increase of r% = Original Value × (1 + r/100)</li>
                        <li>New value after a decrease of r% = Original Value × (1 - r/100)</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>2. Profit and Loss</h3>
                    <ul>
                        <li>Profit = Selling Price - Cost Price</li>
                        <li>Loss = Cost Price - Selling Price</li>
                        <li>Profit % = (Profit / Cost Price) × 100</li>
                        <li>Loss % = (Loss / Cost Price) × 100</li>
                        <li>Discount = Marked Price - Selling Price</li>
                        <li>Discount % = (Discount / Marked Price) × 100</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>3. Average, Speed and Work</h3>
                    <ul>
                        <li>Average = Sum of Observations / Number of Observations</li>
                        <li>Speed = Distance / Time</li>
                        <li>Distance = Speed × Time</li>
                        <li>Time = Distance / Speed</li>
                        <li>Work completed = Work Rate × Time</li>
                        <li>If a person completes a job in x days, their one-day work is 1/x.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>4. Interest and Probability</h3>
                    <ul>
                        <li>Simple Interest = (Principal × Rate × Time) / 100</li>
                        <li>Compound Amount = Principal × (1 + Rate/100)<sup>Time</sup>, for annual compounding.</li>
                        <li>Compound Interest = Compound Amount - Principal</li>
                        <li>Probability = Favourable Outcomes / Total Equally Likely Outcomes</li>
                        <li>Permutation: nPr = n! / (n-r)!</li>
                        <li>Combination: nCr = n! / (r!(n-r)!)</li>
                    </ul>
                    </div>
                </div>

                {/* Logical Reasoning */}

                <div className="resource-section">
                    <h2>Logical Reasoning</h2>

                    <p>
                        Logical reasoning assesses your ability to identify
                        patterns, interpret information, analyze relationships,
                        and draw conclusions.
                    </p>
<div className="resource-topic-box">
                    <h3>1. Series and Patterns</h3>
                    <ul>
                        <li>Number series.</li>
                        <li>Alphabet series.</li>
                        <li>Alphanumeric series.</li>
                        <li>Missing numbers.</li>
                        <li>Find the incorrect term.</li>
                        <li>Number and letter patterns.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>2. Coding and Decoding</h3>
                    <ul>
                        <li>Letter shifting patterns.</li>
                        <li>Number-based coding.</li>
                        <li>Word coding.</li>
                        <li>Substitution coding.</li>
                        <li>Pattern-based coding and decoding.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>3. Relationships and Directions</h3>
                    <ul>
                        <li>Blood relations.</li>
                        <li>Family tree problems.</li>
                        <li>Direction sense.</li>
                        <li>Distance and displacement.</li>
                        <li>Position and orientation.</li>
                        <li>Ranking and order.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>4. Arrangements and Puzzles</h3>
                    <ul>
                        <li>Linear seating arrangements.</li>
                        <li>Circular seating arrangements.</li>
                        <li>Floor-based puzzles.</li>
                        <li>Scheduling and ordering puzzles.</li>
                        <li>Grouping and selection problems.</li>
                        <li>Constraint-based logic puzzles.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>5. Analytical Reasoning</h3>
                    <ul>
                        <li>Analogies and classification.</li>
                        <li>Syllogisms.</li>
                        <li>Statement and conclusion.</li>
                        <li>Statement and assumption.</li>
                        <li>Cause and effect.</li>
                        <li>Logical deductions.</li>
                        <li>Data sufficiency.</li>
                        <li>Venn diagrams.</li>
                        <li>Calendars and clocks.</li>
                        <li>Non-verbal reasoning and figure patterns.</li>
                    </ul>
                    </div>
                </div>

                {/* Verbal Ability */}

                <div className="resource-section">
                    <h2>Verbal Ability</h2>

                    <p>
                        Verbal ability measures your English comprehension,
                        grammar, vocabulary, and ability to communicate clearly.
                    </p>
<div className="resource-topic-box">
                    <h3>1. Vocabulary</h3>
                    <ul>
                        <li>Synonyms and antonyms.</li>
                        <li>One-word substitutions.</li>
                        <li>Idioms and phrases.</li>
                        <li>Commonly confused words.</li>
                        <li>Word usage in sentences.</li>
                        <li>Contextual vocabulary.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>2. Grammar</h3>
                    <ul>
                        <li>Parts of speech.</li>
                        <li>Nouns, pronouns, and adjectives.</li>
                        <li>Verbs and adverbs.</li>
                        <li>Tenses.</li>
                        <li>Subject-verb agreement.</li>
                        <li>Articles and prepositions.</li>
                        <li>Conjunctions.</li>
                        <li>Active and passive voice.</li>
                        <li>Direct and indirect speech.</li>
                        <li>Sentence correction and error spotting.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>3. Reading and Sentence Skills</h3>
                    <ul>
                        <li>Reading comprehension.</li>
                        <li>Sentence completion.</li>
                        <li>Para jumbles.</li>
                        <li>Sentence rearrangement.</li>
                        <li>Fill in the blanks.</li>
                        <li>Sentence improvement.</li>
                        <li>Paragraph completion.</li>
                        <li>Identifying the main idea of a passage.</li>
                        <li>Drawing inferences from a passage.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>4. Written Communication</h3>
                    <ul>
                        <li>Professional email writing.</li>
                        <li>Sentence clarity and conciseness.</li>
                        <li>Formal and informal communication.</li>
                        <li>Common grammar mistakes.</li>
                        <li>Writing grammatically correct sentences.</li>
                    </ul>
                    </div>
                </div>

                {/* Data Interpretation */}

                <div className="resource-section">
                    <h2>Data Interpretation</h2>
                    <div className="resource-topic-box">
<h3>1. Data Interpretation</h3>
                    <p>
                        Data interpretation involves analyzing numerical
                        information presented in different formats and answering
                        questions using calculations and comparisons.
                    </p>

                    <ul>
                        <li>Tables and tabular data.</li>
                        <li>Bar graphs.</li>
                        <li>Line graphs.</li>
                        <li>Pie charts.</li>
                        <li>Histograms.</li>
                        <li>Mixed graphs.</li>
                        <li>Percentage-based comparisons.</li>
                        <li>Ratio and average calculations from data.</li>
                        <li>Missing data problems.</li>
                        <li>Caselet-based data interpretation.</li>
                    </ul>
                    </div>
<div className="resource-topic-box">
                    <h3>2. Data Interpretation Tips</h3>
                    <ul>
                        <li>Read the chart title, labels, units, and legend carefully.</li>
                        <li>Identify the exact values required before calculating.</li>
                        <li>Use estimation when answer choices allow it.</li>
                        <li>Check whether the question asks for a percentage, difference, ratio, or average.</li>
                        <li>Avoid rounding too early in a calculation.</li>
                    </ul>
                    </div>
                </div>

                {/* Common Placement Assessment Topics */}

                <div className="resource-section">
                    <h2>Common Placement Assessment Topics</h2>

                    <p>
                        The exact syllabus varies by company and recruitment
                        assessment. These are additional areas worth preparing
                        for alongside quantitative, logical, and verbal aptitude.
                    </p>
 <div className="resource-topic-box">
                    <h3>1. Analytical and Critical Thinking</h3>
                    <ul>
                        <li>Evaluating arguments.</li>
                        <li>Identifying assumptions.</li>
                        <li>Drawing valid conclusions.</li>
                        <li>Analyzing patterns and relationships.</li>
                        <li>Solving multi-step reasoning problems.</li>
                    </ul>
                    </div>
 <div className="resource-topic-box">
                    <h3>2. Basic Computer Awareness</h3>
                    <ul>
                        <li>Computer hardware and software fundamentals.</li>
                        <li>Operating system basics.</li>
                        <li>Internet and networking basics.</li>
                        <li>Database fundamentals.</li>
                        <li>Basic programming logic and output questions.</li>
                    </ul>
                    </div>
 <div className="resource-topic-box">
                    <h3>3. Programming Logic</h3>
                    <ul>
                        <li>Tracing loops and conditional statements.</li>
                        <li>Predicting program output.</li>
                        <li>Understanding arrays and strings.</li>
                        <li>Basic number and pattern programs.</li>
                        <li>Identifying logical errors in code.</li>
                    </ul>
                    </div>
                </div>

                {/* Preparation Tips */}

                <div className="resource-section">
                    <h2>Aptitude Preparation Tips</h2>
<br></br>
                    <ul>
                        <li>Practice aptitude questions regularly rather than studying only before a test.</li>
                        <li>Learn important formulas and understand when to use them.</li>
                        <li>Understand the concept before memorizing shortcuts.</li>
                        <li>Practice mental calculations and approximation.</li>
                        <li>Start with easier questions and gradually increase difficulty.</li>
                        <li>Maintain a notebook of formulas and common mistakes.</li>
                        <li>Review incorrect answers and solve them again without looking at the solution.</li>
                        <li>Practice questions with a time limit.</li>
                        <li>Use reliable practice questions and previous placement-style assessments.</li>
                        <li>Focus on accuracy before trying to maximize speed.</li>
                        <li>Revise difficult topics regularly.</li>
                        <li>Practice all three major areas: quantitative, logical, and verbal aptitude.</li>
                    </ul>
                </div>

                {/* Simple Daily Practice Plan */}

                <div className="resource-section">
                    <h2>Simple Daily Practice Plan</h2>
<br></br>
                    <p>
                        Use this sample 80-minute plan as a starting point.
                        Adjust the duration based on your schedule and the
                        topics you find difficult.
                    </p>

                    <ul>
                        <li>20 minutes – Quantitative Aptitude.</li>
                        <li>20 minutes – Logical Reasoning.</li>
                        <li>20 minutes – Verbal Ability.</li>
                        <li>10 minutes – Formula revision.</li>
                        <li>10 minutes – Review mistakes and difficult questions.</li>
                    </ul>

                    <h3>Weekly Revision Plan</h3>
                    <ul>
                        <li>Practice new quantitative topics on the first two study days.</li>
                        <li>Focus on logical reasoning and puzzles on the next two days.</li>
                        <li>Practice verbal ability and reading comprehension on another day.</li>
                        <li>Take a mixed aptitude test and review your mistakes on the final study day.</li>
                        <li>Revisit weak topics during revision sessions.</li>
                    </ul>
                </div>

                {/* Time Management */}

                <div className="resource-section">
                    <h2>Time Management During Aptitude Tests</h2>
<br></br>
                    <ul>
                        <li>Read each question carefully before solving it.</li>
                        <li>Check the number of questions and total test duration.</li>
                        <li>Estimate the time available per question.</li>
                        <li>Attempt familiar and easier questions first when the test rules permit.</li>
                        <li>Do not spend too much time on one difficult question.</li>
                        <li>Skip difficult questions and return to them later if time permits.</li>
                        <li>Use shortcuts and formulas where appropriate.</li>
                        <li>Keep track of the remaining time.</li>
                        <li>Check calculations before submitting when time permits.</li>
                        <li>Read the test instructions carefully, especially rules about negative marking and unanswered questions.</li>
                    </ul>
                </div>

                {/* Mock Test Preparation */}

                <div className="resource-section">
                    <h2>Mock Test Preparation</h2>
<br></br>
                    <p>
                        Mock tests help you become familiar with assessment
                        formats, manage time, and identify topics that require
                        more practice.
                    </p>

                    <ul>
                        <li>Take mock tests under a fixed time limit.</li>
                        <li>Practice quantitative, logical, and verbal sections.</li>
                        <li>Review incorrect answers after every test.</li>
                        <li>Identify topics where you make frequent mistakes.</li>
                        <li>Practice weak topics separately.</li>
                        <li>Record your score, accuracy, and completion time.</li>
                        <li>Compare your performance across tests to track improvement.</li>
                        <li>Repeat questions you answered incorrectly after revising the relevant concept.</li>
                        <li>Practice a full-length assessment before the actual recruitment test.</li>
                    </ul>

                    <h3>How to Review a Mock Test</h3>
                    <ul>
                        <li>Identify questions answered incorrectly.</li>
                        <li>Separate conceptual mistakes from calculation errors.</li>
                        <li>Identify questions that took too long to solve.</li>
                        <li>Learn a suitable method for each difficult question.</li>
                        <li>Retry the questions without referring to the answers.</li>
                    </ul>
                </div>

                {/* Common Mistakes */}

                <div className="resource-section">
                    <h2>Common Aptitude Test Mistakes</h2>
<br></br>
                    <ul>
                        <li>Memorizing formulas without understanding their use.</li>
                        <li>Ignoring units during calculations.</li>
                        <li>Reading a question too quickly and missing key information.</li>
                        <li>Spending too much time on one question.</li>
                        <li>Making avoidable calculation errors.</li>
                        <li>Guessing without considering the test's negative-marking rules.</li>
                        <li>Ignoring verbal ability while focusing only on mathematics.</li>
                        <li>Taking mock tests without reviewing the results.</li>
                        <li>Practicing only familiar topics instead of improving weak areas.</li>
                        <li>Failing to read assessment instructions before starting.</li>
                    </ul>
                </div>
                
                
                {/* Useful Online Resources */}

                <div className="resource-section">
                    <h2>Useful Online Practice Resources</h2>
<br></br>
                    <ul>
                        <li>
                            <a
                                href="https://www.indiabix.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                IndiaBIX – Aptitude, reasoning, and verbal practice
                            </a>
                        </li>

                        <li>
                            <a
                                href="https://www.geeksforgeeks.org/aptitude/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                GeeksforGeeks – Aptitude practice
                            </a>
                        </li>

                        <li>
                            <a
                                href="https://www.placementpreparation.io/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Placement Preparation – Placement practice materials
                            </a>
                        </li>
                    </ul>

                    <p>
                        Check the relevant company's official recruitment
                        instructions for the latest assessment pattern, time
                        limit, and syllabus.
                    </p>
                </div>

                {/* Back Button */}

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

export default AptitudeResources;
