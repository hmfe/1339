import React, { useEffect, useState, useRef } from 'react';

// Style
import styled from 'styled-components';

// Api
import { getSearchDataByQuery } from "../../api/api";

// Components
import { SearchHistoryCard } from "./SearchHistoryCard";
import { Button } from "../Button";

export const SearchForm = () => {
    //timeout ref for clearing of timeout when component "unmounts" and runs useEffects return function.
    let searchInputTimer = useRef();

    useEffect(() => {
        //return runs when component unmounts. We clear timeout at this point.
        return () => {
            clearTimeout(searchInputTimer);
        }
    }, []);

    // STATES
    // state-hook for auto-complete suggestions.
    const [ suggestions, setSuggestions] = useState([]);
    // state-hook for search-query
    const [ query, setQuery ] = useState('');
    // state-hook for search-query
    const [ history, setHistory ] = useState([]);

    const [ isSearching, setIsSearching ] = useState(false);

    const [activeSuggestion, setActiveSuggestion] = useState(null);

    const preventDefault = (e) => {
        e.preventDefault();
    };

    const submitForm = () => {
        pushNewHistoryItemToState();
        setIsSearching(false);
        console.log('submitting');
    };

    const pushNewHistoryItemToState = () => {
        const date = new Date();
        const timeStamp = `${date.getFullYear()}-${(date.getMonth()+1)}-${date.getDate()}, ${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
        const newHistoryObj = {
            name:query,
            timeStamp: timeStamp
        };

        const newHistoryList = [...history];
        newHistoryList.push(newHistoryObj);
        setHistory(newHistoryList);
    };

    async function fetchSearchData() {
        const search = await getSearchDataByQuery(query);
        console.log('initial search', search);
        if(search.Search && search.Search.length > 0){
            console.log('search.SEARCH', search);
            setSuggestions(search.Search);
            setActiveSuggestion(null);
        }else {
            console.log('search ERROR',search);
            setSuggestions([]);
            setIsSearching(false);
        }
    };

    const handleOnChange = (e) => {
        const { value } = e.currentTarget;
        clearTimeout(searchInputTimer.current);
        setQuery(value);
        setIsSearching(true);
        searchInputTimer.current = setTimeout(()=> {
            fetchSearchData()
        }, 400);
    };

    const handleClearHistoryOnClick = () => {
        setHistory([]);
    };

    // TODO: REFACTOR?
    const deleteItem = (index) => {
        // Copy not to mutate state directly
        const historyWithItemFilteredOut = [...history];
        historyWithItemFilteredOut.splice(index, 1);
        // setState
        setHistory(historyWithItemFilteredOut);
    };

    const onSuggestionClick = e => {
        setActiveSuggestion(null);
        console.log('e',e.currentTarget.innerText);
        setQuery(e.currentTarget.innerText);
        setIsSearching(false);
        submitForm()
    };

    const onBlur = () => {
        setIsSearching(false);
        setActiveSuggestion(null);
        setSuggestions([]);
    };

    // Event fired when the user presses a key down
    const onKeyDown = (e) => {
        if(e.keyCode === 13){
            if(activeSuggestion !== null){
                setQuery(filteredSuggestions[activeSuggestion].Title);
                setActiveSuggestion(null);
                submitForm();
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

            if(activeSuggestion === null){
                setActiveSuggestion(0);
                console.log('if');
            }
            else if(activeSuggestion + 1 === filteredSuggestions.length) {
                console.log('else');
                setActiveSuggestion(0)
            }else {
                setActiveSuggestion(activeSuggestion + 1);
            }
        }
    };


    const filteredSuggestions = suggestions.sort((a, b) => {
        const movieA =  a.Title;
        const movieB = b.Title;

        return movieA.localeCompare(movieB, 'sv');
    });

    const suggestionItems = filteredSuggestions.map((item, index) => {
        return <SuggestionCard onClick={onSuggestionClick} key={`suggestions-${index}`} isActive={index === activeSuggestion}>{item.Title}</SuggestionCard>
    });

    const searchHistoryItems = history.map((item, index)=>{
        return <SearchHistoryCard key={`search-history-${index}`} index={index} timeStamp={item.timeStamp} name={item.name} deleteItem={deleteItem}/>
    });

    return (
        <Root onSubmit={preventDefault} action=".">
            <InputContainer>
                <Label htmlFor="search">Search for a movie!</Label>
                <Input name="search" placeholder="ex: Avengers" type="text" autoComplete="off" onChange={handleOnChange} value={query} onKeyDown={onKeyDown} onBlur={onBlur}/>
                    <SuggestionsList isOpen={isSearching}>
                        {suggestionItems}
                    </SuggestionsList>
            </InputContainer>
            <SubmitButton type="submit" onClick={submitForm} text="Search"/>
                <SearchHistory>
                    <SearchHistoryListContainer>
                        <h3>Search History</h3>
                        <ClearHistoryButton onClick={handleClearHistoryOnClick} text="Clear history"/>
                    </SearchHistoryListContainer>
                    {
                        history.length > 0 &&
                        <SearchHistoryList>
                            {searchHistoryItems}
                        </SearchHistoryList>
                    }
                </SearchHistory>
        </Root>
    );
};

const Root = styled.form`
    margin:0 auto;
    max-width: 30rem;
    background:${props => props.theme.grey};
    padding:1rem 0;
`;

const Label = styled.label`
    margin-bottom: 0.25rem;
    display:inline-block;
    font-size: 0.875rem;
`;

const Input = styled.input`
    width:100%;
    border:none;
    box-sizing: border-box;
    font-size:1.25rem;
    padding:0.5rem 1rem;
    border-radius: 1.375rem;
    border:1px solid ${props=> props.theme.darkGrey};
`;

const InputContainer = styled.div`
  position:relative;
`;

const UnorderdList = styled.ul`
    list-style: none;
    padding: 0;
    margin:0;
`;

const SuggestionsList = styled(UnorderdList)`
    margin:2px 0 0 0;
    z-index: 10;
    max-height: 14rem;
    overflow-y:auto;
    position:absolute;
    display:${props => props.isOpen ? 'block':'none'};
    width:100%;
    width:100%;
`;


const SuggestionCard = styled.li`
    margin: 0.1rem 0;
    background: ${props => props.isActive ? 'blue' :  'white'};
    padding: 0.5rem 1rem;
    margin:0;
`;

const SearchHistory = styled.section`
  
  h3 {
  
  }
`;

const SearchHistoryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media ${props=>props.theme.breakpointXSmall}{
      align-items: center;
      flex-direction: row;
      justify-content:space-between;
  }
  
`;

const SubmitButton = styled(Button)`
    padding:0.5rem 3rem;
    display:block;
    border-radius: 1.375rem;
    font-size: 1rem;
    margin:1rem auto;
    width:100%;
      @media ${props=>props.theme.breakpointXSmall}{
        width:auto;
      }
`;

const ClearHistoryButton = styled(Button)`
  padding:0.5rem 1rem;
  background: none;
  border: 1px solid black;
  color: black;
`;

const SearchHistoryList = styled(UnorderdList)`
  margin-top: 1rem;
`;


