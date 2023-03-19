import { useState } from "react";
import classes from "./QuestionForm.module.css";

function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [maxRating, setMaxRating] = useState(5);
  const [type, setType] = useState("rating");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url =
      "https://customer-survey-61eb2-default-rtdb.firebaseio.com/questions.json";

    const newQuestion = {
      question,
      maxRating,
      type,
    };

    await fetch(url, {
      method: "POST",
      body: JSON.stringify(newQuestion),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Question saved to Firebase:", data);
        alert("Question has been added Successfully");
      })
      .catch((error) =>
        console.error("Error saving question to Firebase:", error)
      );

    // Reset form fields
    setQuestion("");
    setMaxRating(5);
    setType("rating");
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <h2 className={classes.title}>Add New Question</h2>
          <label className={classes.label}>
            Question:
            <input
              className={classes.input}
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              required
            />
          </label>
          <label className={classes.label}>
            Maximum Rating:
            <input
              className={classes.input}
              type="number"
              min="1"
              max="10"
              value={maxRating}
              onChange={(event) => setMaxRating(parseInt(event.target.value))}
              required
            />
          </label>
          <label className={classes.label}>
            Type:
            <select
              className={classes.select}
              value={type}
              onChange={(event) => setType(event.target.value)}
              required
            >
              <option value="rating">Rating</option>
              <option value="text">Text</option>
            </select>
          </label>
          <button className={classes.button} type="submit">
            Save Question
          </button>
        </form>
      </div>
    </div>
  );
}

export default QuestionForm;
