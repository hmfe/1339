import React, { useEffect, useState, useRef } from "react";
import { get, size } from "lodash/fp";

// Style
import styled, {css} from "styled-components";

// Api
import { getSearchDataByQuery } from "../../api/api";

// Components
import { SearchHistoryCard } from "./SearchHistoryCard";
import { SuggestionCard } from "./SuggestionCard";
import { Button } from "../Button";
import { Conditional } from "../Conditional";

// Functional component is using react-hooks for state management.
export const SearchForm = () => {
  //timeout ref for clearing of timeout when component "unmounts" and runs useEffects return function.
  let searchInputTimer = useRef();

  // STATES
  // state-hook for auto-complete suggestions.
  const [suggestions, setSuggestions] = useState([]);
  // state-hook for search query
  const [query, setQuery] = useState("");
  // state-hook for search history
  const [history, setHistory] = useState([]);
  // state-hook for suggestions for search
  const [activeSuggestion, setActiveSuggestion] = useState(null);
  // state-hook for message to display after submit.
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    //return runs when component unmounts. We clear timeout at this point.
    return () => {
      clearTimeout(searchInputTimer);
    };
  }, []);

  // handle preventDefault here instead of in declared in returned jsx not to create new instances.
  const handleSubmit = e => {
    e.preventDefault();
    if (query) {
      submitForm(query);
    }
  };

  const submitForm = value => {
    clearTimeout(searchInputTimer.current);
    pushNewHistoryItemToState(value);
    setSuggestions([]);
  };

  const pushNewHistoryItemToState = value => {
    // Date and time for search history.
    const date = new Date();

    const timeStamp = `${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}, ${date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })}`;

    const newHistoryObj = {
      name: value,
      timeStamp: timeStamp
    };

    const newHistoryList = [...history];
    newHistoryList.push(newHistoryObj);

    // Set new list with added history obj.
    setHistory(newHistoryList);
  };

  async function fetchSearchData(value) {
    const search = await getSearchDataByQuery(value);

    if (search.status === 200) {
      // If status is ok from api and search result has data, set the data as suggestions for autocomplete state.
      if (get("Search", search) && size(get("Search", search)) > 0) {
        setSuggestions(search.Search);
        setActiveSuggestion(null);
        setResultMessage("");
      } else {
        setSuggestions([]);
        setResultMessage(search.Error);
      }
    } else {
      setSuggestions([]);
      setResultMessage(search.error.message);
    }
  }

  const handleOnChange = e => {
    clearTimeout(searchInputTimer.current);
    const { value } = e.currentTarget;
    setQuery(value);
    setSuggestions([]);
    // If input gets a value that is not empty. We set a timeout for the api-call to not stress to api to much.
    if (value) {
      searchInputTimer.current = setTimeout(() => {
        fetchSearchData(value);
      }, 400);
    } else {
      // Empty resultMessage when input is emptied.
      setResultMessage("");
    }
  };

  const handleClearHistoryOnClick = () => {
    setHistory([]);
  };

  const deleteItem = index => {
    // Copy not to mutate state directly
    const historyWithItemFilteredOut = [...history];
    historyWithItemFilteredOut.splice(index, 1);

    setHistory(historyWithItemFilteredOut);
  };

  const onSuggestionClick = index => {
    const suggestionTitleToLowerCase = get(
      "Title",
      sortedSuggestions[index]
    ).toLowerCase();
    setQuery(suggestionTitleToLowerCase);
    setActiveSuggestion(null);
    setSuggestions([]);
    submitForm(suggestionTitleToLowerCase);
  };

  const handleClearSearchInput = () => {
      setQuery('');
      setSuggestions([]);
  };

  // Event fired when the user presses a key down
  const onKeyDown = e => {
    if (e.keyCode === 13) {
      if (activeSuggestion !== null) {
        const suggestionTitleToLowerCase = get(
          "Title",
          sortedSuggestions[activeSuggestion]
        ).toLowerCase();
        setQuery(suggestionTitleToLowerCase);
        setActiveSuggestion(null);
        submitForm(suggestionTitleToLowerCase);
        setSuggestions([]);
        clearTimeout(searchInputTimer.current);
      } else if (query) {
        submitForm(query);
      }
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0 || activeSuggestion === null) {
        return;
      }

      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion === null) {
        setActiveSuggestion(0);
      } else if (activeSuggestion + 1 === sortedSuggestions.length) {
        setActiveSuggestion(0);
      } else {
        setActiveSuggestion(activeSuggestion + 1);
      }
    }
  };

  const sortSuggestionsArray = () => {
    const sortSuggestionsByIndexOfQuery = [...suggestions].sort((a, b) => {
      return get("Title", a)
        .toLowerCase()
        .indexOf(query.toLowerCase()) <
        get("Title", b)
          .toLowerCase()
          .indexOf(query.toLowerCase())
        ? -1
        : 1;
    });
    // Sort result of above by title that is equal to query.
    return [...sortSuggestionsByIndexOfQuery].sort(a => {
      return a["Title"].toLowerCase() === query.toLowerCase() ? -1 : 1;
    });
  };

  const sortedSuggestions = sortSuggestionsArray();

  const suggestionItems = sortedSuggestions.map((item, index) => {
    return (
      <SuggestionCard
        onSuggestionClick={onSuggestionClick}
        key={`suggestions-${index}`}
        isActive={index === activeSuggestion}
        title={item.Title}
        query={query}
        index={index}
      />
    );
  });

  const searchHistoryItems = history.map((item, index) => {
    return (
      <SearchHistoryCard
        key={`search-history-${index}`}
        index={index}
        timeStamp={item.timeStamp}
        name={item.name}
        deleteItem={deleteItem}
      />
    );
  });

  return (
    <Root onSubmit={e => e.preventDefault()}>
      <InputContainer>
        <Label htmlFor="search">Search</Label>
          <InnerInputContainer>
            <Input
              name="search"
              id="search"
              placeholder="ex: Avengers"
              type="text"
              autoComplete="off"
              onChange={handleOnChange}
              value={query}
              onKeyDown={onKeyDown}
            />
            <ClearSearchInputButton onClick={handleClearSearchInput} isActive={query} />
          </InnerInputContainer>
        <Conditional show={size(suggestions) > 0}>
          <SuggestionsList>{suggestionItems}</SuggestionsList>
        </Conditional>
        <ResultMessage isVisible={resultMessage && size(suggestions) > 0}>
          {resultMessage}
        </ResultMessage>
      </InputContainer>
      <SubmitButton type="button" onClick={handleSubmit} text="Search" />
      <SearchHistory>
        <SearchHistoryListContainer>
          <h3>Search History</h3>
          <ClearHistoryButton
            onClick={handleClearHistoryOnClick}
            text="Clear history"
            type="button"
          />
        </SearchHistoryListContainer>
        <Conditional show={history.length > 0}>
          <SearchHistoryList>{searchHistoryItems}</SearchHistoryList>
        </Conditional>
      </SearchHistory>
    </Root>
  );
};

const Root = styled.form`
  margin: 0 auto 4rem;
  max-width: 36rem;
  background: ${props => props.theme.grey};
  border-radius: 22px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.darkGrey};
  padding: 2rem 1rem;
  
  @media ${props => props.theme.breakpointXSmall} {
    padding: 3rem;
  }
`;

const Label = styled.label`
  margin-bottom: 0.25rem;
  display: inline-block;
  font-size: 0.875rem;
`;

const Input = styled.input`
  position: relative;
  width: 100%;
  border: none;
  box-sizing: border-box;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 1.375rem;
  border: 1px solid ${props => props.theme.darkGrey};
  transition: all 150ms ease;
  
  @media ${props => props.theme.breakpointXSmall} {
    font-size: 1.25rem;
  }

  &:focus {
    box-shadow: rgba(0, 0, 0, 0.18) 0px 0px 10px 0px;
  }
`;



const InputContainer = styled.div`
  position: relative;
`;

const activeClearInputButtonBeforeStyle = css`
    transform: translateY(-50%) rotate(45deg);
    opacity: 1;
    right:1rem;
`;

const activeClearInputButtonAfterStyle = css`
    transform: translateY(-50%) rotate(-45deg);
    opacity: 1;
    right:1rem;
`;

const ClearSearchInputButton = styled.button`
  position:absolute;
  top:50%;
  right:0;
  transform: translateY(-50%);
  width: 3rem;
  height: 100%;
  background: transparent;
  border:none;
  cursor:pointer;
  pointer-events: ${props=>props.isActive ? 'all' : 'none'};
  
  &::before, &::after {
    content:'';
    display:block;
    width: 20px;
    height:2px;
    background:${props => props.theme.darkGrey};
    position:absolute;
    transition: all 150ms ease;
    opacity: 0;
    right:0;
  }

  &::before {
    top:50%;
    transform: translateY(-50%) rotate(-45deg);
    ${props=>props.isActive && activeClearInputButtonBeforeStyle};
  }

  &::after {
    top:50%;
    ${props=>props.isActive && activeClearInputButtonAfterStyle};
  }
`;

const InnerInputContainer = styled(InputContainer)`

`;

const UnorderdList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SuggestionsList = styled(UnorderdList)`
  margin: 2px 0 0 0;
  z-index: 10;
  max-height: 14rem;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  border: 1px solid ${props => props.theme.darkGrey};
  box-shadow: rgba(0, 0, 0, 0.18) 0px 0px 10px 0px;
`;

const SearchHistory = styled.section``;

const SearchHistoryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media ${props => props.theme.breakpointXSmall} {
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const SubmitButton = styled(Button)`
  padding: 0.5rem 3rem;
  display: block;
  border-radius: 1.375rem;
  font-size: 1rem;
  margin: 1rem auto;
  width: 100%;
  
  @media ${props => props.theme.breakpointXSmall} {
    width: auto;

    &:hover {
      background-color: ${props => props.theme.crimson};
      box-shadow: rgba(0, 0, 0, 0.18) 0px 0px 10px 0px;
    }
  }
`;

const ClearHistoryButton = styled(Button)`
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid black;
  color: black;

  &:hover {
    background: ${props => props.theme.white};
  }
`;

const SearchHistoryList = styled(UnorderdList)`
  margin-top: 1rem;
`;

const ResultMessage = styled.p`
  opacity: ${props => (props.isVisible ? "1" : "0")};
  transition: opacity 250ms ease;
  min-height: 1.375rem;
  font-size: 1rem;
  margin-top: 0.5rem;
`;
