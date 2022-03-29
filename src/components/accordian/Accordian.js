import React, { useEffect, useState } from "react";
import "./accordian.css";
function Accordian({ title, content, setSingleSelectedProperty }) {
  const [contentArray] = useState(content);
  const [searchInput, setsearchInput] = useState("");
  const [resultsArray, setResultsArray] = useState(contentArray);
  const [showContent, setShowContent] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState({
    type: "",
    values: [],
  });

  const onChange = (e) => {
    setsearchInput(e.target.value);
    if (e.target.value==="") {
      setResultsArray(contentArray);
    } else {
      var resultArray = contentArray.filter((text) =>
        text.includes(searchInput.toLowerCase())
      );
      setResultsArray(resultArray);
    }
  };

  const alreadyPresent = (data) => {
    return selectedProperties && selectedProperties.values.includes(data);
  };

  useEffect(() => {
    console.log(selectedProperties);
    setSingleSelectedProperty(selectedProperties);
  }, [selectedProperties]);

  return (
    <div className="accordian-div">
      <div className="accordian-header">
        <h4>{title}</h4>
        {showContent ? (
          <i
            class="fa-solid fa-caret-up"
            onClick={() => setShowContent(false)}
          ></i>
        ) : (
          <i
            class="fa-solid fa-caret-down"
            onClick={() => setShowContent(true)}
          ></i>
        )}
      </div>
      <div className="accordian-content">
        {showContent && (
          <div>
            <input
              type="text"
              className="select-search-input"
              placeholder="Search"
              value={searchInput}
              onChange={onChange}
            />
            <ul>
              <div className="checkbox">
                {resultsArray &&
                  resultsArray.map((data, index) => {
                    return (
                      <label className="checkbox-wrap" key={index}>
                        <input
                          type="checkbox"
                          checked={
                            selectedProperties &&
                            selectedProperties.values.includes(data)
                          }
                          onChange={() => {
                            if (alreadyPresent(data)) {
                              var remainingValues =
                                selectedProperties.values.filter(
                                  (x) => x !== data
                                );
                              setSelectedProperties({
                                type: title,
                                values: remainingValues,
                              });
                            } else {
                              setSelectedProperties((prev) => ({
                                type: title,
                                values: [...prev.values, data],
                              }));
                            }
                          }}
                        />
                        <span className="checkmark"></span>
                        {data}
                      </label>
                    );
                  })}
              </div>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Accordian;
