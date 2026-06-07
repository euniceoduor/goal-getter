import React, { useState, useEffect } from 'react';
import Steps from './Steps';
import './App.css';

function GoalForm (props) {

    const {goal, isEditing, onSubmit, onClose} = props;
    const [goalName, setGoalName] = useState('');
    const [startDate, setStartDate] = useState(
        new Date().toISOString().split("T")[0] //YYYY-MM-DD
    );
    const [todayDate, setTodayDate] = useState(
        new Date().toISOString().split("T")[0] //YYYY-MM-DD
    );

    const today= new Date().toISOString().split("T")[0]
    const [targetDate, setTargetDate] = useState('');

    const [showStepForm, setShowStepForm] = useState(false);
    const [step, setStep] = useState('');
    const [steps, setSteps] = useState([]);
    

    const [showAmountForm, setShowAmountForm] = useState(false);
    const [currency, setCurrency] = useState('GBP');
    const [targetAmount, setTargetAmount] = useState('');
    const [savedAmount, setSavedAmount] = useState('');

    const [showFinanceForm, setShowFinanceForm] = useState(false);
    const [achieved, setAchieved] = useState('');
    const [timeLeft, setTimeLeft] = useState('');
    const [regularSaving, setRegularSaving] = useState('');
    const [currencies, setCurrencies] = useState([]);

    const calcAchieved = ({targetAmount, savedAmount}) => {
        const achievement = savedAmount/targetAmount*100;
        return Number(achievement.toFixed(2));
    };

    const addStep = () => {
        if (step.trim().length === 0) return;

        setSteps((prev) => [...prev, {
            id: crypto.randomUUID(),
            text: step,
            done:false,
        }]);
        setStep('');
    };

    const totalSteps = steps.length;
    const completedSteps = steps.filter( step => step.done).length;

    const toggleStepDone = (id) => {
        setSteps((prev) => 
            prev.map((step) => step.id === id? {...step, done: !step.done} : step)
        )
    }

    const removeStep = (id) => {
        setSteps((steps) => (steps.filter((step) => step.id !== id )))
    };

    useEffect(() => {
        if (!targetAmount || !savedAmount) {
            setAchieved('');
            return;
        };

        const percentageAchieved = calcAchieved({
            targetAmount: Number(targetAmount),
            savedAmount: Number(savedAmount),
        });

        setAchieved(percentageAchieved);

    }, [savedAmount, targetAmount]);

    const calcTimeLeft = ({todayDate, targetDate}) => {
        const start = new Date(todayDate);
        const end = new Date(targetDate);

        const diffMs = end - start; // diff is presented in milliseconds
        const diffDays = Math.ceil(diffMs/(1000*60*60*24));
        return diffDays;
    };

    useEffect(() => {
        if(!targetDate) {
            setTimeLeft('');
            return;
        }

        const daysLeft = calcTimeLeft({
            todayDate,
            targetDate,
        })

        setTimeLeft(daysLeft);
    }, [todayDate, targetDate]);

    const calcRegularSaving = ({timeLeft, targetAmount, savedAmount}) => {
        const amountLeft = targetAmount - savedAmount;
        const months = timeLeft/30;
        const saving = Math.floor((amountLeft/months),2);
        return saving;
    };

    useEffect(() => {
        if(!targetAmount||!targetDate) {
            setRegularSaving('');
            return;
        }

        const monthlySaving = calcRegularSaving({
            timeLeft: Number(timeLeft),
            targetAmount: Number(targetAmount),
            savedAmount:Number(savedAmount),
        })

        setRegularSaving(monthlySaving);
    }, [timeLeft, targetAmount, savedAmount]);

    useEffect(() => {
        fetch("https://open.er-api.com/v6/latest/USD")
            .then(res => res.json())
            .then(data => {
                const currencyCodes = Object.keys(data.rates).sort();
                setCurrencies(currencyCodes);
            })
        .catch(err => console.error("Error fetching countries:", err));
    }, []);

    useEffect(() => {
        if (goal) {
            setGoalName(goal.goalName);
            setTargetAmount(goal.targetAmount);
            setStartDate(goal.startDate);
            setTargetDate(goal.targetDate);
            setCurrency(goal.currency);
            setSavedAmount(goal.savedAmount);
            setSteps(goal.steps || []);
            // any other fields...
        }
        }, [goal]);

    
    const handleSubmit= (e) => {
        e.preventDefault();
        if (goalName.trim().length === 0) return;
     
        const finalGoal= {
            ...(goal || {}),
            goalName,
            startDate,
            targetDate,
            currency,
            targetAmount,
            savedAmount,
            achieved,
            regularSaving,
            timeLeft,
            steps
        };

        if(!isEditing) {
            finalGoal.id = crypto.randomUUID();
        };

        onSubmit(finalGoal);
        
        if(!isEditing) {
            setGoalName('');
            setStartDate(todayDate);
            setTargetDate('');
            setSavedAmount('');
            setTargetAmount('');
            setCurrency('GBP');
            setSteps('')
        };  
        


       alert('Goal has been set!');


        props.onClose();
    };


    return (
        <div>
            <form onSubmit= {handleSubmit}>
                <label htmlFor="goal-name">
                    Goal:
                    <input
                    type="text"
                    name="goal-name"
                    id="goal-name"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}

                    />
                </label>

                <label htmlFor="start-date">
                    Start date:
                    <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    value={startDate}
                    
                    max={targetDate}
                    onChange={(e) => setStartDate(e.target.value)}

                    />
                </label>

                <label htmlFor="target-date">
                    Target date:
                    <input
                    type="date"
                    name="target-date"
                    id="target-date"
                    value={targetDate}
                    min={todayDate}
                    onChange={(e) => setTargetDate(e.target.value)}

                    />
                </label>

                <button
                    type="button"
                    onClick={() => setShowStepForm(prev => !prev)}
                    className="add-steps-btn"
                >
                    {showStepForm? "Hide steps": "Steps to achieve goal"}
                </button>
                
                { showStepForm && (
                    <Steps 
                        steps={steps}
                        setSteps={setSteps}
                    
                    />
                    
                )} 
                
                <button
                    type="button"
                    onClick={() => setShowFinanceForm(prev => !prev)}
                    className="add-steps-btn"
                >
                    {showFinanceForm? "Hide financing": "Financing your goal"}
                </button>

                { showFinanceForm && (
                    <div className="finance-section">
                        <div className= "finance-row">
                            <label>Currency</label>
                            <select 
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}>
                                <option value="">Select currency</option>

                                {currencies.map(code => (
                                    <option key={code} value={code}>
                                        {code}
                                    </option>
                            ))}
                            </select>
                        </div>

                        <div className= "finance-row">
                            <label htmlFor="target-amount">
                                Target:</label>
                            <input
                                type="number"
                                name="target-amount"
                                id="target-amount"
                                value={targetAmount}
                                min='0'
                                onChange={(e) => setTargetAmount(e.target.value)}

                            />
                            
                        </div>

                        <div className="finance-row">
                            <label htmlFor="saved-amount">
                                Saved</label>
                            <input
                                type="number"
                                name="saved-amount"
                                id="saved-amount"
                                value={savedAmount}
                                max={targetAmount}
                                min ='0'
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >Number(targetAmount)){
                                        setSavedAmount(targetAmount)
                                    } else{
                                        setSavedAmount(value);
                                    }
                                }}
                                    

                            />
                            
                        </div>
                    </div>
                )}

                <div className="goal-stats-wrapper">   
                    { steps.length > 0 && (
                        <div className="goal-stat-line">
                            {steps? `${completedSteps} of ${totalSteps} steps completed`: ''}
                        </div>
                    )}

                  
                    <div className="goal-stat-line">
                        {achieved? `${achieved}% financing achieved` : ''}
                    </div>

                    <div className="goal-stat-line">
                        {timeLeft? `${timeLeft} days left`: ""}
                    </div>

                    <div className="goal-stat-line">
                        {regularSaving? `You need to save ${currency}${regularSaving} monthly to achieve this goal`: ""} 
                    </div>

                </div>

                <button type="submit">Add Goal</button>

            </form> 
            
        </div>
    )
};

export default GoalForm;