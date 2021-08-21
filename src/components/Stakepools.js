import React, { useEffect, useRef, useState } from "react";
import { Link } from "./UI";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQueryParam, NumberParam } from "use-query-params";
import { BooleanParam  } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {BsArrowBarRight, BsArrowBarLeft} from "react-icons/bs";
import styled from 'styled-components';

const LoadingContainer = styled.p`
  .loader {
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function () {
  let history = useHistory();
  let location = useLocation();
  let { categoryName } = useParams();

  let [stakepools, setStakepools] = useState(null);
  let [categories, setCategories] = useState();
  let [error, setError] = useState();
  let [isAddingStakepool, setIsAddingStakepool] = useState();
  let [isSavingStakepool, setIsSavingStakepool] = useState();
  let [isAddingCategory, setIsAddingCategory] = useState();
  let [isSavingCategory, setIsSavingCategory] = useState();
  let [newStakepoolText, setNewStakepoolText] = useState("");
  let [newCategoryName, setNewCategoryName] = useState("");
  let [sidebarIsOpen, setSidebarIsOpen] = useQueryParam("open", BooleanParam);
  let [stakepoolDetails, setStakepoolDetails] = useQueryParam("details", NumberParam);

  let activeCategory = categoryName && categories?.find((cat) => cat.name === categoryName);
  let activeStakepool = stakepools && stakepools.filter(stakepool => parseInt(stakepool.id) === stakepoolDetails).shift();

  useEffect(() => {
    let isCurrent = true;
    setStakepools(null);
    setStakepoolDetails();

    let url = categoryName ? `/api/categories/${categoryName}/stakepools` : `/api/stakepools`;
    
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (isCurrent) {
          setStakepools(json.stakepools);
        }
      })
      .catch((e) => {
        if (isCurrent) {
          setError("We couldn't load your stakepools. Try again soon.");
          console.error(e);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [categoryName, setStakepoolDetails]);

  useEffect(() => {
    let isCurrent = true;

    if (sidebarIsOpen) {
      fetch(`/api/categories`)
        .then((res) => res.json())
        .then((json) => {
          if (isCurrent) {
            setCategories(json.categories);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }

    return () => {
      isCurrent = false;
    };
  }, [sidebarIsOpen]);

  function createStakepool(e) {
    e.preventDefault();

    if (!newStakepoolText) {
      return;
    }

    setIsSavingStakepool(true);

    fetch("/api/stakepools", {
      method: "POST",
      body: JSON.stringify({
        text: newStakepoolText,
        ...(categoryName && { categoryName }),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setNewStakepoolText("");
        setStakepools((stakepools) => [...stakepools, json.stakepool]);
        setIsAddingStakepool(false);
      })
      .catch((e) => {
        setError("Your Stakepool wasn't saved. Try again.");
        console.error(e);
      })
      .finally(() => {
        setIsSavingStakepool(false);
      });
  }

  function createCategory(e) {
    e.preventDefault();

    if (!newCategoryName) {
      return;
    }

    setIsSavingCategory(true);

    fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({
        name: newCategoryName,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setNewCategoryName("");
        setCategories((categories) => [...categories, json.category]);
        setIsAddingCategory(false);
        history.push(`/${json.category.id}${location.search}`);
      })
      .catch(() => {
        setError("Your Category wasn't saved. Try again.");
      })
      .finally(() => {
        setIsSavingCategory(false);
      });
  }

  //function deleteStakepool(id) {
  //  fetch(`/api/stakepools/${id}`, { method: "DELETE" });
  //  setStakepools((stakepools) =>
  //    stakepools.filter((stakepool) => stakepool.id !== id)
  //  );
  //}

  //function deleteCategory() {
  //  fetch(`/api/categories/${categoryName}`, { method: "DELETE" });
  //  setCategories((categories) => categories?.filter((category) => category.id !== categoryName));
  //  history.push(`/${location.search}`);
  //}

  let hasRenderedstakepoolsRef = useRef(false);
  let hasRenderedstakepoolRef = useRef(false);
  useEffect(() => {
    hasRenderedstakepoolRef.current = false;
    
    if (stakepools) {
      hasRenderedstakepoolsRef.current = true;
    } else {
      hasRenderedstakepoolsRef.current = false;
    }
  }, [stakepools]);

  useEffect(() => {
    if (activeStakepool) {
      hasRenderedstakepoolRef.current = true;
    } else {
      hasRenderedstakepoolRef.current = false;
    }
  }, [activeStakepool]);

  return (
    <div className="flex justify-left">
      <div className="flex ml-10 overflow-hidden rounded-md shadow-lg">
        <AnimatePresence initial={false}>
          {sidebarIsOpen && (
            <motion.div
              animate={{ width: 192 }}
              initial={{ width: 0 }}
              exit={{ width: 0 }}
              className="flex flex-col bg-cool-gray-800"
            >
              <div className="flex flex-col flex-1 w-48 pt-12 pb-4 bg-cool-gray-800">
                <div className="flex-1">
                  <div>
                    <Link
                      className="flex items-center justify-between px-6 py-2 text-sm font-medium"
                      activeClassName="bg-cool-gray-700 text-white"
                      inactiveClassName="text-cool-gray-400 hover:text-white"
                      to={`/stakepools/${location.search}`}
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
                        to={`/stakepools/${category.name}${location.search}`}
                      >
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>

                  {isAddingCategory && (
                    <form
                      onSubmit={createCategory}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-1 bg-white w-md">
          <div className="flex items-start justify-center w-10 group">
            <BsArrowBarLeft
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="w-4 h-4 mt-5 ml-2 cursor-pointer focus:outline-none opacity-80 hover:opacity-100"
              data-testid="toggle-sidebar"
            ></BsArrowBarLeft>
          </div>

          <div className="flex-1 pt-12 pb-12 pr-12">
            <div className="flex items-center justify-between mb-10">
              <h1
                className="flex items-center justify-between text-3xl font-bold leading-none"
                data-testid="active-category-title"
              >
                {activeCategory?.name || "Stake pools"}
              </h1>
            </div>

            <div>
              {error && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8 bg-white border-b-4 border-red-500 rounded-md shadow-xl">
                  <div className="flex p-4 pr-5 rounded-md">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 mr-1 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium leading-5 text-red-600 text">
                        Network error
                      </h3>
                      <div className="mt-2 text-sm leading-5">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {stakepools?.length > 0 ? (
                <div>
                  <ul className="divide-y divide-cool-gray-100">
                    <AnimatePresence>
                      {stakepools.map((stakepool, i) => (
                        <motion.li
                          variants={{
                            hidden: (i) => ({
                              opacity: 0,
                              y: -50 * i,
                            }),
                            visible: (i) => ({
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: i * 0.025,
                              },
                            }),
                            removed: {
                              opacity: 0,
                            },
                          }}
                          initial={
                            hasRenderedstakepoolsRef.current
                              ? "visible"
                              : "hidden"
                          }
                          animate="visible"
                          exit="removed"
                          custom={i}
                          key={stakepool.id}
                          data-testid="stakepool"
                        >
                          <div className="flex py-1 items-center justify-between cursor-pointer group" onClick={() => setStakepoolDetails(stakepool.id)}>
                            <div>{stakepool.text}
                            {!categoryName && stakepool.category && (
                              stakepool.category.map((cat, id) => (
                                Array.isArray(cat.name) ? cat.name.map((c, cid) => (
                                <span
                                key={cid}
                                className="px-3 py-2 ml-2 text-xs font-medium rounded bg-cool-gray-100 text-cool-gray-600"
                                data-testid="category-tag"
                              >
                                {c}
                              </span>
                                )): (
                                  <span
                                  key={id}
                                  className="px-3 py-2 ml-2 text-xs font-medium rounded bg-cool-gray-100 text-cool-gray-600"
                                  data-testid="category-tag"
                                >
                                  {cat.name}
                                </span>
                                  )
                              )) 
                            )}
                            </div>
                            <button
                            className="flex invisible items-center px-2 py-1 opacity-50 group-hover:opacity-100 group-hover:visible"
                            data-testid="details-stakepool"
                          >
                            <BsArrowBarRight className="" />
                            ️
                          </button>
                          </div>
                          
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              ) : stakepools ? (
                <p className="pt-3 pb-3 font-medium text-cool-gray-400">
                  No stakepools found
                </p>
              ) : !error || stakepools === null ? (
                <LoadingContainer className="flex pt-3 pb-3 font-medium text-cool-gray-400 justify-center">
                  <AiOutlineLoading3Quarters className="loader" />
                </LoadingContainer>
              ) : null}

              {isAddingStakepool && (
                <form
                  onSubmit={createStakepool}
                  className={`-mx-3 ${
                    isSavingStakepool ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div>
                    <div className="relative py-1">
                      <input
                        id="email"
                        autoFocus
                        className="block w-full py-2 transition duration-150 ease-in-out border-2 border-transparent focus form-input focus:shadow-none focus:border-blue-300 sm:leading-5"
                        placeholder="New stakepool..."
                        data-testid="new-stakepool-text"
                        value={newStakepoolText}
                        onChange={(e) => setNewStakepoolText(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 flex py-1">
                        <button
                          type="submit"
                          data-testid="save-new-stakepool"
                          className="items-center px-4 text-sm text-cool-gray-700 hover:text-cool-gray-400"
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
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="flex mx-auto overflow-hidden rounded-md shadow-lg">
        <AnimatePresence initial={false}>
          {stakepoolDetails && (
            stakepools?.length > 0 && (
            <motion.div
              animate={{ width: 340 }}
              initial={{ width: 0 }}
              exit={{ width: 0 }}
              className="flex flex-col bg-cool-gray-800"
            >
              <div className="flex flex-col flex-1 w-60 min-w-full pt-12 pb-4 bg-cool-gray-800">
                <div className="flex-1">
                  <div>
                  <motion.li variants={{ hidden: () => ({ opacity: 0, y: -50, }), visible: () => ({ opacity: 1, y: 0,
                              transition: {
                                delay: 0.025,
                              },
                            }),
                            removed: {
                              opacity: 0,
                            },
                          }}
                          initial={
                            hasRenderedstakepoolRef.current
                              ? "visible"
                              : "hidden"
                          }
                          animate="visible"
                          exit="removed"
                          className="flex items-center justify-between py-2 group"
                          data-testid="stakepool"
                        >
                    <span
                      className="flex items-center justify-between px-6 py-2 text-sm font-medium text-white"
                    >
                      {activeStakepool.text}
                    </span>
                    </motion.li>
                    <motion.li variants={{ hidden: () => ({ opacity: 0, y: -50, }), visible: () => ({ opacity: 1, y: 0,
                              transition: {
                                delay: 0.025,
                              },
                            }),
                            removed: {
                              opacity: 0,
                            },
                          }}
                          initial={
                            hasRenderedstakepoolRef.current
                              ? "visible"
                              : "hidden"
                          }
                          animate="visible"
                          exit="removed"
                          className="flex items-start flex-col py-2 group"
                          data-testid="stakepool"
                        >
                    <span className="flex items-center justify-between px-6 py-2 text-sm font-medium text-cool-gray-400">
                        Ticker: {activeStakepool.ticker}
                     </span>
                    <span className="flex items-center justify-between px-6 py-2 text-sm font-medium text-cool-gray-400">
                        Created at: {activeStakepool.launchDate}
                     </span>
                    <span className="flex items-center justify-between px-6 py-2 text-sm font-medium text-cool-gray-400">
                        Labels: {activeStakepool.category.map((cat, id) => (Array.isArray(cat.name) ? (cat.name.map((c, id) => <span key={id} className="ml-1">{c}</span>)) : (cat.name)))}
                     </span>
                     </motion.li>
                     <motion.li variants={{ hidden: () => ({ opacity: 0, y: -50, }), visible: () => ({ opacity: 1, y: 0,
                              transition: {
                                delay: 0.025,
                              },
                            }),
                            removed: {
                              opacity: 0,
                            },
                          }}
                          initial={
                            hasRenderedstakepoolRef.current
                              ? "visible"
                              : "hidden"
                          }
                          animate="visible"
                          exit="removed"
                          className="flex items-center justify-between py-2 group"
                          data-testid="stakepool"
                        >
                    <span className="flex items-center justify-between px-6 py-2 text-sm font-medium text-cool-gray-400">
                        Some information
                     </span>
                     </motion.li>
                  </div>
                  {isAddingCategory && (
                    <form
                      onSubmit={createCategory}
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
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
