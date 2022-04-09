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
import { PropertiesData } from "../PropertiesData";
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

  const AddRows = () => {
    var propertiesTemp = propertiesArray
      .filter((r) => r.value != "")
      .map((x) => {
        x.value = x.value.value;
        delete x.values;
        return x;
      });
    console.log(propertiesTemp);
    setProperties(propertiesTemp);
    // setProperties(selectedProperties);
    setShowModal(false);
  };

  const [selectedProperties, setSelectedProperties] = useState([]);
  const [propertiesArray, setPropertiesArray] = useState(PropertiesData);
  // const [selectedValue, setSelectedValue] = useState("");

  const handleCreate = (index, obj) => {
    setPropertiesArray((prev) =>
      Object.values({
        ...prev,
        [index]: {
          ...prev[index],
          value: {
            value: obj,
            label: obj,
          },
          values: [
            ...prev[index].values,
            {
              value: obj,
              label: obj,
            },
          ],
        },
      })
    );
    // setSelectedValue({
    //   value: obj,
    //   label: obj,
    // });

    setSelectedProperties((prev) => [
      ...prev,
      {
        type: propertiesArray[index].type.toLowerCase(),
        value: obj,
      },
    ]);

    // console.log(propertiesArray);
  };

  const handleChange = (index, obj) => {
    setPropertiesArray((prev) =>
      Object.values({
        ...prev,
        [index]: {
          ...prev[index],
          value: {
            value: obj.value,
            label: obj.value,
          },
        },
      })
    );

    setSelectedProperties((prev) => [
      ...prev,
      {
        type: propertiesArray[index].type.toLowerCase(),
        value: obj.value,
      },
    ]);

    // console.log(propertiesArray);
    // setSelectedValue(obj);
  };

  return (
    <div className="scrollable-modal ">
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
          <div className="properties-row">
            {propertiesArray &&
              propertiesArray.map((property, index) => {
                return (
                  <div key={index} className="properties-flex">
                    <div className="properties-type">
                      <p>{property.type}</p>
                    </div>
                    <div className="properties-select">
                      <CreatableSelect
                        // isClearable
                        className="createble-select"
                        value={property?.value}
                        options={property.values}
                        onChange={(value) => handleChange(index, value)}
                        onCreateOption={(value) => handleCreate(index, value)}
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <button onClick={AddRows}>Save</button>
        </div>
      </Modal>
    </div>
  );
}

export default AddPropertyModal;

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
