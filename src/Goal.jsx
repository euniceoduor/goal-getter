import React, { useState, useEffect } from 'react';
import './App.css'
import GoalForm from './GoalForm.jsx'

function Goal ({goal, removeGoal, updateGoal}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedGoal, setEditedGoal] = useState(goal);
    const [showDetails, setShowDetails] = useState(false);

    const totalSteps = goal.steps?.length || 0;
    const completedSteps = goal.steps?.filter((step) => step.done).length || 0;
    const stepProgress = totalSteps> 0? (completedSteps/ totalSteps)*100: 0;

    const list = goal.steps;

    return (
      <>
      {isEditing? (
        <GoalForm
          goal={editedGoal}
          
          isEditing={true}
          onSubmit= {(updatedGoal)=> {
            updateGoal(updatedGoal);
            setIsEditing(false);
          }}
          onClose= {() => setIsEditing(false)}  
        />
      ) : (
        <div className="goal-card"> 
          <h4
            className="goal-title"
            onClick={() => setShowDetails(prev => !prev)}
          >
            {goal.goalName}
          </h4>

          {goal.targetAmount && (
            <>
                
                <div className="progress-bar">
                  
                  <div 
                    className="progress-fill" 
                    style={{ width: `${goal.achieved}%` }}
                  >
                    {goal.currency} {goal.savedAmount} of {goal.targetAmount}
                  </div>
                </div>
              </>
          )}  

          {goal.steps?.length > 0 && (
            <>
              <div className="progress-bar">
                <div 
                  className="progress-fill steps" 
                  style={{ width: `${stepProgress}%` }}
                >
                  {completedSteps}/{totalSteps} steps completed
                </div>
              </div>
            </>


          )}

          {showDetails && (
            <>
            
          
              <div className="goal-details">
                  <div><strong>Start:</strong> {goal.startDate}</div>
                  <div><strong>Target:</strong> {goal.targetDate}</div>
                  
                  { goal.targetAmount > 0 && (
                    <>
                      <div><strong>Target Amount:</strong> {goal.currency} {goal.targetAmount}</div>
                      <div><strong>Saved:</strong> {goal.currency} {goal.savedAmount}</div>
                      <div><strong>Financed:</strong> {goal.achieved}%</div>

                      
                  
                    </>
                  )}

                  <div><strong>Days Left:</strong> {goal.timeLeft}</div>
              </div>

              <div>
                
                {goal.steps?.length > 0 && (
                  <>
                    <h6 className="goal-steps-title">Steps to complete goal</h6>
                    <ul className="goal-steps">
                      
                      {list.map((step) => (
                        <li key={step.id} className="goal-step-item">
                          <input
                            type="checkbox"
                            checked={step.done}
                            readOnly
                          />
                          <span className={step.done? "step-done": ""}>
                            {step.text}
                          </span>
                        </li>)
                      )}
                    </ul>
                  </>


                )}
              </div>

              { goal.regularSaving > 0 && (
                <>
                  <div className="goal-highlight">
                    Save {goal.currency} {goal.regularSaving} monthly to stay on track
                  </div>
                </>
              )}
                

              <button 
                type="button" 
                className="edit-goal-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>

              <button className="delete-goal-btn" onClick={() => removeGoal(goal.id)}>Delete</button>
            </>
          )}
        </div>
      )}
    </>
    )
};

export default Goal;