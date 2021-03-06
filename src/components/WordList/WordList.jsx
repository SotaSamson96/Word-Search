import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { 
    selectWords, 
    selectFoundWords, 
    selectStartTime,
    resetFoundWords,
} from '../../reducers/gridSlice';
import styles from './WordList.module.scss';
import PropTypes from 'prop-types';

export default function WordList(props) {
    const { savedWords } = props;
    const isInitialMount = useRef(true);
    const foundWords = useSelector(selectFoundWords);
    const words = useSelector(selectWords);
    const displayWords = savedWords || words;
    const startTime = useSelector(selectStartTime);
    const dispatch = useDispatch();
    
    useEffect(() => {
        // used to only run useEffect code on update
        if(isInitialMount.current) {
            isInitialMount.current = false;
        }
        else {
            if(foundWords === Object.keys(words).length) {
                let finishTime = new Date().getTime();
                let difference = Math.trunc( (finishTime - startTime) / 1000 );
                let startNewSearch = window.confirm(`Congratulations, you've solved the grid in ${difference} seconds! Would you like to start another?`);
                if(startNewSearch) {
                    window.location.reload();
                }
            }
        }
    }, [words])

    // for cleanup of wordList only
    useEffect(() => {
        return () => {
            dispatch(resetFoundWords())
        }
    }, [dispatch])

    let wordList = Object.keys(displayWords).map(word => (
        <a
            id={word}
            key={word}
            href={`https://www.wordnik.com/words/${word.toLowerCase()}`}
            found={displayWords[word].found}>
            {word}
        </a>
    ))
    
    return (
        <div className={styles.wordList}>
            {wordList}
        </div>
    )
}

WordList.propTypes = {
    savedWords: PropTypes.object
}