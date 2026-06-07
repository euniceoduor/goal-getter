import React, { useState, useEffect } from 'react';

function Steps({ steps, setSteps, onClose}) {
    const [step, setStep] = useState('');

    const addStep = () => {
        if (step.trim().length === 0) return;
        setSteps((prev)=> [
            ...prev, 
            {
                id: crypto.randomUUID(),
                text: step,
                done: false,

            }
        ]);
        setStep("");
    };

    const removeStep=(id) => {
        setSteps((steps) => steps.filter((step) => step.id !== id))
    };

    const toggleStepDone = (id) => {
        setSteps((steps) => 
            steps.map((step) => 
                step.id === id? {...step, done: !step.done}: step))
    }

    return(
        <>
            <div className="steps-section">
                <div className="step-input-row">
                    <input
                    type="text"
                    name="step"
                    id="step"
                    value={step}
                    onChange={(e)=> setStep(e.target.value)}
                    placeholder="Enter a step"
                    />

                    <button
                    type="button"
                    className="tick-btn"
                    onClick={addStep}
                    >
                        ✓
                    </button>
                </div>

                

                <ol className="steps-list">
                    {steps.map((step) => (
                        <li key={step.id} className="step-item">
                            <input
                            type="checkbox"
                            checked = {step.done}
                            onChange= {() => toggleStepDone(step.id)}
                            />

                            <span className={step.done ? "step-done" : ""}>
                                {step.text}
                            </span>

                            <button
                            type="button"
                            className="delete-step-btn"
                            onClick={() => removeStep(step.id)}
                            >
                                X
                            </button>
                        </li>
                    ))}
                </ol>


            </div>
        </>
    )
};

export default Steps;