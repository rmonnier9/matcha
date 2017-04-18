import React from 'react'

import UsersList from './UsersList.js'
import SearchParams from './SearchParams.js'

const Search = () => (
  <div className="search">
    <h2>Search my soulmate</h2>
    <SearchParams />
    <UsersList />
  </div>
)

export default Search
