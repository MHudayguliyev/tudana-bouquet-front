import React from 'react';
import styles from './SearchForm.module.scss';
import {GoSearch} from 'react-icons/go'

const SearchForm = () => {
    return (
        <>
            <form className={styles.search_container}>
                <input type="text" placeholder="Search.." className={styles.search_form}/>
                <GoSearch className={styles.search_button}/>
            </form>
        </>
    )
}

export default SearchForm