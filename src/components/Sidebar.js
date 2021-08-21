import React, {useState} from 'react';
import { useLocation } from "react-router-dom";
import { Link } from "./UI";

export const Sidebar = ({createCategory, categories}) => {
  let [isAddingCategory, setIsAddingCategory] = useState();
  let [isSavingCategory, setIsSavingCategory] = useState();
  let [newCategoryName, setNewCategoryName] = useState();
  let location = useLocation();

  function addCategory (e) {
    e.preventDefault();

    createCategory(newCategoryName);
  }

  return (
    <div className="flex flex-col flex-1 w-48 pt-12 pb-4 bg-cool-gray-800">
                <div className="flex-1">
                  <div>
                    <Link
                      className="flex items-center justify-between px-6 py-2 text-sm font-medium"
                      activeClassName="bg-cool-gray-700 text-white"
                      inactiveClassName="text-cool-gray-400 hover:text-white"
                      to={`/${location.search}`}
                      exact
                    >
                      <span>All</span>
                    </Link>

                    {categories?.map((category) => (
                      <Link
                        key={category.id}
                        className="flex items-center justify-between px-6 py-2 text-sm font-medium"
                        activeClassName="bg-cool-gray-700 text-white"
                        inactiveClassName="text-cool-gray-400 hover:text-white"
                        to={`/${category.id}${location.search}`}
                      >
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>

                  {isAddingCategory && (
                    <form
                      onSubmit={addCategory()}
                      className={`${
                        isSavingCategory ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <div className="relative">
                        <input
                          autoFocus
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="block w-full py-2 pl-6 text-sm font-medium text-white border-transparent rounded-none pr-9 focus:shadow-none form-input bg-cool-gray-700"
                          type="text"
                          placeholder="New category..."
                          data-testid="new-category-text"
                        />
                        <button
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-cool-gray-400 hover:text-cool-gray-200"
                          data-testid="save-new-category"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
                <div className="mt-10">
                  <button
                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                    className="flex items-center mx-6 text-xs text-cool-gray-400 hover:text-white"
                    data-testid="add-category"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                    Add Category
                  </button>
                </div>
              </div>
  )
}