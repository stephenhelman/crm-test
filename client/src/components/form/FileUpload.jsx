import axios from "axios";
import { useState } from "react";
import Information from "./Information";

const FileUpload = ({ setClient, showModal, setShowModal, setBureau }) => {
  const [showForm, setShowForm] = useState(false);
  const [showExperian, setShowExperian] = useState(false);
  const [showTransUnion, setShowTransUnion] = useState(false);
  const [showEquifax, setShowEquifax] = useState(false);
  const [experian, setExperian] = useState([]);
  const [transUnion, setTransUnion] = useState([]);
  const [equifax, setEquifax] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (showExperian && !experian.name) ||
      (showTransUnion && !transUnion.name) ||
      (showEquifax && !equifax.name) ||
      (!experian.name && !transUnion.name && !equifax.name)
    ) {
      alert("Please upload a credit report to continue");
      return;
    }

    const formData = new FormData();

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    let postUrl = "https://boge-cpi.onrender.com/api";
    //determine which options are selected
    if (experian.name && !transUnion.name && !equifax.name) {
      formData.append("Experian", experian);
      postUrl += "/experian";
    }
    if (transUnion.name && !experian.name && !equifax.name) {
      formData.append("TransUnion", transUnion);
      postUrl += "/transunion";
    }
    if (equifax.name && !experian.name && !transUnion.name) {
      formData.append("Equifax", equifax);
      postUrl += "/equifax";
    }
    if (experian.name && transUnion.name && !equifax.name) {
      formData.append("Experian", experian);
      formData.append("TransUnion", transUnion);
      postUrl += "/multi";
    }
    if (experian.name && equifax.name && !transUnion.name) {
      formData.append("Experian", experian);
      formData.append("Equifax", equifax);
      postUrl += "/multi";
    }
    if (transUnion.name && equifax.name && !experian.name) {
      formData.append("TransUnion", transUnion);
      formData.append("Equifax", equifax);
      postUrl += "/multi";
    }
    if (experian.name && transUnion.name && equifax.name) {
      formData.append("Experian", experian);
      formData.append("TransUnion", transUnion);
      formData.append("Equifax", equifax);
    }

    const results = await axios.post(postUrl, formData, config);
    setClient(results.data.data);
    setShowModal(false);
    setShowForm(false);
    console.log(Object.keys(results.data.data)[0]);
    const { data } = results.data;
    const bureau = Object.keys(data)[0];
    setBureau(data[bureau]["Credit Bureau"]);
  };

  const handleExperianUpload = (e) => {
    setClient({});
    setExperian(e.target.files[0]);
  };

  const handleTransUnionUpload = (e) => {
    setClient({});
    setTransUnion(e.target.files[0]);
  };

  const handleEquifaxUpload = (e) => {
    setClient({});
    setEquifax(e.target.files[0]);
  };

  const handleResetClicked = () => {
    setClient({});
    setExperian([]);
    setTransUnion([]);
    setEquifax([]);
    setShowForm(false);
    setShowExperian(false);
    setShowTransUnion(false);
    setShowEquifax(false);
  };

  const information = !showForm ? (
    <Information
      setShowForm={setShowForm}
      setShowEquifax={setShowEquifax}
      setShowExperian={setShowExperian}
      setShowTransUnion={setShowTransUnion}
    />
  ) : null;

  const experianInputs = showExperian ? (
    <div className="inputContainer">
      <label htmlFor="Experian">Upload Experian File</label>
      <input
        id="Experian"
        type="file"
        onChange={handleExperianUpload}
        required
      />
    </div>
  ) : null;

  const transUnionInputs = showTransUnion ? (
    <div className="inputContainer">
      <label htmlFor="Transunion">Upload TransUnion File</label>
      <input
        id="TransUnion"
        type="file"
        onChange={handleTransUnionUpload}
        required
      />
    </div>
  ) : null;

  const equifaxInputs = showEquifax ? (
    <div className="inputContainer">
      <label htmlFor="Equifax">Upload Equifax File</label>
      <input id="Equifax" type="file" onChange={handleEquifaxUpload} required />
    </div>
  ) : null;

  const form = showForm ? (
    <form
      action="/"
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="fileUpload"
    >
      <h2>Credit Report Upload Form</h2>
      <fieldset className="uploads">
        {experianInputs}
        {transUnionInputs}
        {equifaxInputs}
      </fieldset>

      <div className="buttonContainer">
        <button className="formButton" onClick={handleSubmit}>
          Upload
        </button>
        <button
          className="formButton"
          type="button"
          onClick={handleResetClicked}
        >
          Reset
        </button>
      </div>
    </form>
  ) : null;

  const modal = showModal ? (
    <div className="overlay">
      {information}
      {form}
    </div>
  ) : null;

  return modal;
};

export default FileUpload;
