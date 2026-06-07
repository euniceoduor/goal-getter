import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Goal from './Goal.jsx'
import GoalForm from './GoalForm.jsx'
import { DemoGoal } from './DemoGoal.jsx'
import { Quotes} from './Quotes.jsx'

function App() {
  const [goalList, setGoalList] = useState([]);

  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ⭐ Load saved goals on first render
  useEffect(() => {
    const saved = localStorage.getItem("goalList");
    if(!saved) {
      setGoalList([DemoGoal]);
    }
    if (saved) {
      setGoalList(JSON.parse(saved));
    }
    setLoaded(true);
  }, []);

// ⭐ Save goals whenever they change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("goalList", JSON.stringify(goalList));
    }
    
  }, [goalList, loaded]);

  const addGoal = (goal) => {
      setGoalList((prev) => {
        const list = [goal,...prev];
        const sortedList = [...list].sort((a, b) =>
          new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
        );
        return sortedList;
      });
  };

  const removeGoal = (id) => {
      setGoalList((goalList) => goalList.filter((goal) => goal.id !== id))
  };

  const updateGoal = (updatedGoal) => {
      setGoalList((prev) => 
        prev.map((goal) => 
          goal.id === updatedGoal.id? updatedGoal: goal
        )
      );
      
  };
  const hasFinancialGoals = goalList.some(
    (goal) => goal.currency && goal.targetAmount

  );

  const calcFinanceTotals = (goalList) => {
    return goalList.reduce((acc, goal) => {
      if (!goal.currency || !goal.targetAmount) return acc;

      const code = goal.currency; // e.g. "GBP"

      if (!acc[code]) {
        acc[code] = { target: 0, saved: 0, monthlySaving:0 };
      }

      if (goal.targetAmount) {
        acc[code].target += Number(goal.targetAmount);
      }

      if (goal.savedAmount) {
        acc[code].saved += Number(goal.savedAmount);
      }

      if (goal.regularSaving) {
        acc[code].monthlySaving += Number(goal.regularSaving);
      }

      return acc;
    }, {});
  };

  const totals = calcFinanceTotals(goalList);

  const randomQuote = Quotes[Math.floor(Math.random() * Quotes.length)];
  

  return (
    <div className="goals-container">
      <h1>Goal-Getter</h1>
      <h4>Track your financial and non-financial goals.</h4>
      <div className="quote-box">
        <p className="quote-text">“{randomQuote.quote}”</p>
        <p className="quote-author">— {randomQuote.author}</p>
      </div>
      <button
        className="add-goal-btn"
        onClick={() => setShowForm(!showForm)}
      >
        +Add a Goal
      </button>

      {hasFinancialGoals && (
        <div className='finance-summary'>
          

          {Object.entries(totals).map(([code, data]) => (
            <div className='summary-row' key={code}>
              <div className='currency-label'>{code}</div>
              <div className='currency-values'>
              
                <span>Target: {code} {data.target} </span>
                <span>Saved: {code} {data.saved}</span>
                <span>Monthly Saving: <strong>{code} {data.monthlySaving}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}  

      <div className= "form-container">
        {showForm && (
          <GoalForm 
            goal ={null}
            isEditing = {false}
            onSubmit={addGoal}
            onClose={() => setShowForm(false)}
          
          />)}

        {goalList.map((goal)=>(
          <Goal
            key={goal.id}
            goal={goal}
            removeGoal={removeGoal}
            updateGoal = {updateGoal}
          />
        ))}
      </div>
      
    </div>
  )
}

export default App
