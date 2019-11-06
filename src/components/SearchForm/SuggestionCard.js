import React from 'react';
import PropTypes from 'prop-types';
import createMarkup from 'create-markup';

// Style
import styled from 'styled-components';

export const SuggestionCard = (props) => {
    const setQueryOccurrenceToBoldInTitle = (title, query) => {
        console.log('query',query);
        let textToFormat = title.toLowerCase();

        const regexp = new RegExp(query, 'ig');

        const replaceMask = "<mark>"+query+"</mark>";
        textToFormat = textToFormat.replace(regexp, replaceMask);
        console.log('title',textToFormat);
        const markup = createMarkup(textToFormat);
        return markup;

    };
    const text = setQueryOccurrenceToBoldInTitle(props.title, props.query);

    return (
        <Root onClick={props.onSuggestionClick} key={`suggestions-${props.index}`} isActive={ props.isActive } dangerouslySetInnerHTML={text}/>
    );
};

SuggestionCard.propTypes = {
    onSuggestionClick: PropTypes.func,
    className: PropTypes.string,
    text: PropTypes.string
};


const Root = styled.li`
    margin: 0.1rem 0;
    background: ${props => props.isActive ? props => props.theme.lightBlue :  'white'};
    padding: 0.5rem 1rem;
    margin:0;
    box-shadow: ${props => props.isActive ? 'rgba(0, 0, 0, 0.18) 0px 0px 10px 0px' : 'none'};
    mark {
     font-weight: bold;
     background:none;
    }
`;
