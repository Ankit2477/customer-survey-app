import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import classes from "./Survey.module.css";
import ThankCustomer from "./ThankCustomer";

const Survey = () => {
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const url =
    "https://customer-survey-61eb2-default-rtdb.firebaseio.com/questions.json";

  useEffect(() => {
    // Check if the session ID is already stored in local storage
    const storedSessionId = localStorage.getItem("survey_session_id");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      // If the session ID is not stored, generate a new one
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem("survey_session_id", newSessionId);
    }
  }, []);

  /* This is a useEffect hook that is fetching the questions from the firebase database. */
  useEffect(() => {
    const getQuestions = async () => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const questionsArray = [];

          for (const key in data) {
            questionsArray.push({
              id: key,
              ...data[key],
            });
          }
          setQuestions(questionsArray);
        })
        .catch((error) =>
          console.error("Error fetching questions from Firebase:", error)
        );
    };

    getQuestions();
  }, []);

  /**
   * It takes a questionId and a rating, and then it sets the ratings state to a new object that has the
   * same properties as the previous ratings state, but with the property that matches the questionId set
   * to the rating that was passed in.
   * @param questionId - The id of the question that was clicked
   * @param rating - the rating that was clicked
   */
  const handleRatingClick = (questionId, rating) => {
    setRatings((prevRatings) => ({ ...prevRatings, [questionId]: rating }));
  };

  /**
   * If the user is not on the last question, then the current question index is incremented by 1.
   */
  const handleNextClick = () => {
    if (currentQuestionIndex === questions.length - 1) {
      const confirmed = window.confirm("Are you sure you want to submit?");
      if (confirmed) {
        localStorage.setItem("COMPLETED", ratings);
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/");
        }, 5000);
        console.log(ratings);
      }
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  /**
   * When the user clicks the previous button, the current question index is set to the previous index.
   */
  const handlePrevClick = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const openFrom = () => {
    navigate("/add")
  }

  const currentQuestion =
    questions[currentQuestionIndex] === undefined
      ? []
      : questions[currentQuestionIndex];

  return (
    <>
      {!isSubmitted && (
        <div className={classes.survey}>
          <button className={classes["add-button"]} onClick={openFrom}>
            ADD QUESTIONS
          </button>
          <div className={classes.card}>
            <h2>Customer Feedback Survey</h2>
            <h4>Please take a moment to share your thoughts with us.</h4>

            <div className={classes["question-count"]}>{`${
              currentQuestionIndex + 1
            }/${questions.length}`}</div>

            <div
              className={classes["question-container"]}
              key={currentQuestion.id}
            >
              <div>{currentQuestion.question}</div>
              {currentQuestion.type === "rating" && (
                <div className={classes["rating-container"]}>
                  {[...Array(currentQuestion.maxRating)].map((_, index) => (
                    <span
                      key={index}
                      className={`${classes["rating-icon"]} ${
                        index + 1 <= ratings[currentQuestion.question]
                          ? classes["selected"]
                          : ""
                      }`}
                      onClick={() =>
                        handleRatingClick(currentQuestion.question, index + 1)
                        //console.log(currentQuestion)
                      }
                    />
                  ))}
                </div>
              )}
              {currentQuestion.type === "text" && (
                <textarea
                  onChange={(e) =>
                    setRatings((prevRatings) => ({
                      ...prevRatings,
                      [currentQuestion.question]: e.target.value,
                    }))
                  }
                  className={classes["text-area"]}
                />
              )}
            </div>
            <div className={classes["button-group"]}>
              <button
                onClick={handlePrevClick}
                disabled={currentQuestionIndex === 0}
                className={classes["prev-button"]}
              >
                Previous
              </button>
              <button
                onClick={handleNextClick}
                className={classes["skip-button"]}
              >
                Skip
              </button>
              <button
                onClick={handleNextClick}
                className={classes["next-button"]}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {isSubmitted && <ThankCustomer />}
    </>
  );
};

export default Survey;
