import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  setSize, solvePuzzle, setShowResults } from '../../reducers/solverSlice';
import Grid from '../../components/SolverInput';
import { preventEnter } from '../../utility';
import styles from './Solver.module.scss';

function checkNum(e, dispatch) {
    let { value } = e.target;
    let num = parseInt(value);
    if( isNaN(num) && value !== "") {
        alert("Please enter a number!");
        e.target.value = "";
        return;
    }
    else if (num < 10 || num > 15) {
        alert("Your grid is either too small or too large!");
        e.target.value = '10';
    }
    else if (value !== "") {
        dispatch(setSize(value));
    }
}

function checkInput(e, dispatch) {
    let wordList = hasValidWords();
    if( hasFilledCells() && wordList ) {
        dispatch(setShowResults(true));
        dispatch( solvePuzzle(wordList) );
    }
    else {
        e.preventDefault();
    }
}

function hasFilledCells() {
    let gridInput = [...document.getElementsByClassName('gridInput')];
    for(let i = 0; i < gridInput.length; i++) {
        let input = gridInput[i];
        if(input.value === "") {
            alert('Please fill in the grid entirely to solve the puzzle!');
            return false;
        }
    }
    return true;
}

function hasValidWords() {
    const regex = /[^A-Za-z]/g;
    let wordList = hasWords();
    if( wordList ) {
        for(let i = 0; i < wordList.length; i++) {
            let word = wordList[i];
            if( word.match(regex) ) {
                alert(`Please remove symbols or letters from: ${word}`)
                return;
            }
        }
        return wordList;
    }
    else {
        alert('Please enter some words to get started!');
        return false;
    }
}

function hasWords() {
    const whiteSpace = /\s/g;
    let uncheckedWords = document.getElementById('wordList').value.replace(whiteSpace, "").split(',');
    let wordList = [];
    uncheckedWords.forEach(word => {
        if( word.length !== 0 && !wordList.includes(word) ) {
            wordList.push(word);
        }
    })
    return wordList.length === 0 ? false : wordList;
}

export default function Solver() {
    const dispatch = useDispatch();
    return (
        <div className={styles.solver}>
            <div className={styles.directions}>
                <h1>Puzzle Solver:</h1>
                <ol>
                    <li>
                        Enter in the size of the grid below.
                        <ul>
                            <li>Default size: 10 x 10</li>
                            <li>Max size: 15 x 15</li>
                        </ul> 
                    </li>
                    <li>
                        After the grid is generated, enter in the 
                        letters in each cell in the grid
                    </li>
                    <li>
                        Enter in the words you would like to find
                    </li>
                    <li>
                        Press the 'Solve' button and give it some time
                    </li>
                </ol>
            </div>

            <div className={styles.input}>
                <textarea 
                    cols="1" 
                    rows="1"
                    placeholder="size"
                    maxLength="2"
                    onBlur={(e) => checkNum(e, dispatch)}
                    onKeyPress={(e) => preventEnter(e)}>
                </textarea>
            </div>

            <Grid />

            <div className={styles.wordList}>
                <p>
                    Please separate your words by a comma or else they will not be 
                    read properly! And do remember to remove any symbols or numbers as well. 
                </p>
                <textarea
                    id="wordList"
                    rows="5"
                    placeholder="Separate, your, words, like, this">
                </textarea>
            </div>

            <div className={styles.btnWrapper}>
                <Link
                    to="/results"
                    onClick={(e) => checkInput(e, dispatch)}>
                    Solve
                </Link>
            </div>

        </div>
    )
}
