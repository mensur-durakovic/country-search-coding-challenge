import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./Autocomplete.module.css";
import { fetchCountries } from "../../api/api";

const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default class Autocomplete extends Component {
  static propTypes = {
    labelText: PropTypes.string,
    noSuggestionsText: PropTypes.string,
  };

  static defaultProps = {
    labelText: "Type something",
    noSuggestionsText: "No suggestions",
  };

  state = {
    loadingSuggestions: false,
    errorSuggestions: false,
    filteredSuggestions: [],
    currentSuggestionIndex: 0,
    displaySuggestions: false,
    enteredText: "",
    suggestionClicked: false
  };

  constructor(props) {
    super(props);
    this.suggestionsListRef = React.createRef();
    this.searchInputRef = React.createRef();
    this.timer = null;
  }

  componentDidMount() {
    //this.fetchSuggestionsData();
    document.addEventListener("mousedown", this.clickOutsideHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.clickOutsideHandler);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.enteredText !== this.state.enteredText && !this.state.suggestionClicked) {
      this.fetchSuggestionsData();
    }
  }

  clickOutsideHandler = (e) => {
    if (
      this.suggestionsListRef &&
      this.suggestionsListRef.current &&
      !this.suggestionsListRef.current.contains(e.target)
    ) {
      this.setState({
        currentSuggestionIndex: 0,
        displaySuggestions: false,
      });
    }
  };

  setInputValue = (e) => {
    this.setState({
      enteredText: e.target.value,
      suggestionClicked: false,
    });
  };

  fetchSuggestionsData = async (e) => {
    try {
      clearTimeout(this.timer);
      const enteredFilter = this.state.enteredText.toLowerCase();

      //fetch data from backend after 0.5 sec after user stops typing, so we don't make unecessarry calls
      this.timer = setTimeout(async () => {
        this.setState({ loadingSuggestions: true });

        const response = await fetchCountries(enteredFilter);

        this.setState({
          loadingSuggestions: false,
          errorSuggestions: false,
          currentSuggestionIndex: 0,
          filteredSuggestions: response.data.countries.map((c) => c.name),
          displaySuggestions: true,
        });

        //focus search input after side effect is finished
        this.searchInputRef.current.focus();

      }, 500);
    } catch (error) {
      console.error("Error on fetching countries", error);
      this.setState({
        errorSuggestions: true,
        loadingSuggestions: false,
      });
    }
  };

  focusSuggestion = () => {
    const { currentSuggestionIndex, filteredSuggestions } = this.state;
    const suggestionId = `suggestionId-${
      filteredSuggestions[currentSuggestionIndex - 1]
    }`;
    const suggestionTarget = document.getElementById(suggestionId);
    if (suggestionTarget) {
      suggestionTarget.scrollIntoView();
    }
  };

  highlightMatchedSubstring = (suggestion) => {
    const { enteredText } = this.state;
    const parts = suggestion.split(new RegExp(`(${enteredText})`, "gi"));
    const result = parts.map((p, i) => (
      <span
        key={i}
        className={
          p.toLowerCase() === enteredText.toLowerCase() ? styles.markedText : ""
        }
      >
        {p}
      </span>
    ));

    return result;
  };

  clickHandler = (e) => {
    this.setState({
      currentSuggestionIndex: 0,
      filteredSuggestions: [],
      displaySuggestions: false,
      enteredText: e.currentTarget.innerText,
      suggestionClicked: true,
    });
  };

  /**
   * keydown handler for better UX
   */
  keyDownHandler = (e) => {
    const { currentSuggestionIndex, filteredSuggestions } = this.state;

    switch (e.keyCode) {
      case ENTER_KEY: {
        this.setState({
          currentSuggestionIndex: 0,
          displaySuggestions: false,
          enteredText: filteredSuggestions[currentSuggestionIndex],
        });
        break;
      }
      case UP_ARROW_KEY: {
        if (currentSuggestionIndex === 0) {
          return;
        }

        this.setState(
          { currentSuggestionIndex: currentSuggestionIndex - 1 },
          this.focusSuggestion
        );

        break;
      }
      case DOWN_ARROW_KEY: {
        if (currentSuggestionIndex + 1 === filteredSuggestions.length) {
          return;
        }
        this.setState(
          { currentSuggestionIndex: currentSuggestionIndex + 1 },
          this.focusSuggestion
        );

        break;
      }
      case ESCAPE_KEY: {
        this.setState({
          currentSuggestionIndex: 0,
          displaySuggestions: false,
        });
        break;
      }
      default:
        break;
    }
  };

  render() {
    const {
      currentSuggestionIndex,
      filteredSuggestions,
      displaySuggestions,
      enteredText,
      loadingSuggestions,
      errorSuggestions,
    } = this.state;

    const { labelText, noSuggestionsText } = this.props;
    const isError = !loadingSuggestions && errorSuggestions;
    const isLoading = loadingSuggestions && !errorSuggestions;

    let suggestionsList;
    if (isError) {
      suggestionsList = (
        <div className={styles.errorFetchingData}>
          <span>{"An error occurred while fetching data!"}</span>
        </div>
      );
    } else if (displaySuggestions && enteredText) {
      if (filteredSuggestions.length) {
        suggestionsList = (
          <ul className={styles.suggestions} ref={this.suggestionsListRef}>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                className={
                  index === currentSuggestionIndex
                    ? styles.activeSuggestion
                    : ""
                }
                id={`suggestionId-${suggestion}`}
                key={suggestion}
                onClick={this.clickHandler}
              >
                {this.highlightMatchedSubstring(suggestion)}
              </li>
            ))}
          </ul>
        );
      } else {
        suggestionsList = (
          <div className={styles.noSuggestions}>
            <span>{noSuggestionsText}</span>
          </div>
        );
      }
    }

    const autoCompleteInput = (
      <>
        <label htmlFor="countriesAutocompleteInput">{labelText}</label>
        <input
          id="countriesAutocompleteInput"
          autoComplete="new-password"
          ref={this.searchInputRef}
          className={styles.input}
          type="text"
          placeholder="type something"
          onChange={this.setInputValue}
          onKeyDown={this.keyDownHandler}
          value={enteredText}
          disabled={isError}
        />
        {suggestionsList}
      </>
    );

    return (
      <>
        {isLoading ? (
          <span className={styles.loadingText}>{"Loading..."}</span>
        ) : (
          autoCompleteInput
        )}
      </>
    );
  }
}
