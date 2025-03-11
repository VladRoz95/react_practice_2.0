/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [selectUser, setSelectUser] = useState(null);
  const [searchProduct, setSearchProduct] = useState('');
  const [selectCategory, setSelectCategory] = useState([]);
  const [sortCategory, setSortCategory] = useState({
    key: null,
    direction: 'abc',
  });

  const products = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      categories => categories.id === product.categoryId,
    );
    const user = usersFromServer.find(users => users.id === category.ownerId);

    return {
      ...product,
      category,
      user,
    };
  });

  const filteredProducts = products.filter(product => {
    const setUser = selectUser ? product.user.name === selectUser : true;
    const setSearch = product.name
      .toLowerCase()
      .includes(searchProduct.toLowerCase());
    const setCategory = selectCategory.length
      ? selectCategory.includes(product.category.title)
      : true;

    return setUser && setSearch && setCategory;
  });

  const sortedProduct = [...filteredProducts].sort((a, b) => {
    if (!sortCategory.key) {
      return 0;
    }

    const aValue = a[sortCategory.key].toLowerCase();
    const bValue = b[sortCategory.key].toLowerCase();

    if (sortCategory.direction === 'asc') {
      if (aValue < bValue) {
        return -1;
      }

      if (aValue > bValue) {
        return 1;
      }

      return 0;
    }

    if (aValue < bValue) {
      return 1;
    }

    if (aValue > bValue) {
      return -1;
    }

    return 0;
  });

  const selectUserFilter = user => {
    setSelectUser(user === selectUser ? null : user);
  };

  const setCategoryFilter = category => {
    setSelectCategory(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      }

      return [...prev, category];
    });
  };

  const handleSort = column => {
    let direction = 'abc';

    if (sortCategory.key === column && sortCategory.direction === 'abc') {
      direction = 'desc';
    }

    setSortCategory({ key: column, direction });
  };

  const resetFilter = () => {
    setSelectUser(null);
    setSearchProduct('');
    setSearchProduct([]);
    setSortCategory({ key: null, direction: 'abc' });
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => selectUserFilter(null)}
                className={selectUser === null ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => selectUserFilter(user.name)}
                  className={selectUser === user.name ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchProduct}
                  onChange={e => setSearchProduct(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchProduct && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchProduct('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={
                  selectCategory.length === 0
                    ? 'button is-success mr-6'
                    : 'button is-success mr-6 is-outlined is-active'
                }
                onClick={() => setSelectCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={
                    selectCategory.includes(category.title)
                      ? 'button mr-2 my-1 is-info is-outlined is-active'
                      : 'button mr-2 my-1'
                  }
                  href="#/"
                  onClick={() => setCategoryFilter(category.title)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilter}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/" onClick={() => handleSort('id')}>
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={`fas fa-sort${sortCategory.direction === 'abc' ? '-up' : '-down'}`}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/" onClick={() => handleSort('name')}>
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={`fas fa-sort${sortCategory.direction === 'abc' ? '-up' : '-down'}`}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/" onClick={() => handleSort('category')}>
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={`fas fa-sort${sortCategory.direction === 'abc' ? '-up' : '-down'}`}
                        />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/" onClick={() => handleSort('user')}>
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={`fas fa-sort${sortCategory.direction === 'abc' ? '-up' : '-down'}`}
                        />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {sortedProduct.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.category.icon} - {product.category.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={
                      product.user.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
