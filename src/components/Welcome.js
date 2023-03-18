import { useNavigate } from "react-router-dom";
import classes from "./Welcome.module.css";

const Welcome = () => {
  const navigate = useNavigate();
  /**
   * It's a function that navigates to the survey page when the start button is clicked.
   */
  const handleStart = () => {
    navigate("/survey");
  };

  return (
    <div className={classes.welcome}>
      <h1>Welcome to our Customer Feedback Survey! We Value Your Opinion.</h1>
      <button className={classes["start-button"]} onClick={handleStart}>
        START
      </button>
    </div>
  );
};

export default Welcome;
