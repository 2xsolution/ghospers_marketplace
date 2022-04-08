import React, {
  Component,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import Modal from "react-modal";
import { BASEURL } from "../../../utils/Utils";
import "./addPropertyModal.css";
import CreatableSelect from "react-select/creatable";

Modal.setAppElement("#root");

function AddPropertyModal({
  setShowModal,
  showModal,
  setProperties,
  properties,
}) {
  console.log(showModal);
  function closeModal() {
    setShowModal(false);
  }

  const [rows, setRows] = useState([
    {
      type: "",
      value: "",
    },
  ]);

  const [propertiesArray, setPropertiesArray] = useState([
    {
      type: "body",
      value: "",
    },
    {
      type: "hair",
      value: "",
    },
  ]);

  // const onChange = (e, index) => {
  //   setRows((prev) =>
  //     Object.values({
  //       ...prev,
  //       [index]: { ...prev[index], [e.target.name]: e.target.value },
  //     })
  //   );
  // };

  // const removeRow = (index) => {
  //   console.log(index);
  //   if (rows.length !== 1) {
  //     console.log(rows);
  //     console.log(rows[index]);
  //     var rowsTemp = [...rows];
  //     console.log(rowsTemp);
  //     rowsTemp.splice(index, 1);
  //     console.log(rowsTemp);
  //     setRows(rowsTemp);
  //   }
  // };

  const AddRows = () => {
    var propertiesTemp = propertiesArray.filter(
      (r) => r.type != "" && r.value != ""
    );
    setProperties(propertiesTemp);
    setShowModal(false);
  };

  // useEffect(() => {
  //   console.log(properties);
  //   if (!properties) {
  //     setpro([
  //       {
  //         type: "",
  //         value: "",
  //       },
  //     ]);
  //   }
  // }, [properties]);

  // const handleChange = useCallback((inputValue) => setValue(inputValue), []);

  const handleCreate = (e, index) => {
    setPropertiesArray((prev) =>
      Object.values({
        ...prev,
        [index]: { ...prev[index], [e.target.name]: e.target.value },
      })
    );
    console.log(propertiesArray);
  };

  return (
    <div className="scrollable-modal">
      <Modal
        isOpen={showModal}
        shouldCloseOnOverlayClick={false}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        // style={customStyles}
        // className="scrollable-modal"
        contentLabel="Example Modal"
      >
        <div className="properties-modal-content">
          <h2>Add Properties </h2>
          <div className="property-rows">
            {propertiesArray &&
              propertiesArray.map((row, index) => {
                return (
                  <div key={index} className="inputs-div">
                    <div>
                      <label htmlFor="">Type</label>
                      <input
                        type="text"
                        name="type"
                        value={row.type}
                        // onChange={(e) => onChange(e, index)}
                        className="mint-input"
                        placeholder="Hair"
                      />
                    </div>
                    <div>
                      <label htmlFor="">Value</label>
                      <CreatableSelect
                        isClearable
                        name="value"
                        className="createble-select"
                        // value={value}
                        // options={options}
                        // onChange={handleChange}
                        onCreateOption={(e) => handleCreate(e, index)}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <button
          //  onClick={AddRows}
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default AddPropertyModal;
