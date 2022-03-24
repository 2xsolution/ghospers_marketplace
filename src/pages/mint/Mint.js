import React, { useState } from "react";
import "./mint.css";
import { FileUploader } from "react-drag-drop-files";
import IPFSUtils from './IPFSUtils';


function Mint() {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

	const mintNFT = async (event) => {

    IPFSUtils.uploadFileToIPFS([file]).then((lists) => {
      if (lists.length > 0) {
        const content_uri1 = {
          name: 'Angel1',
          symbol: 'angel1',
          image: lists[0],
          properties: {
            files: [{ uri: "image.png", type: "image/png" }],
            category: "image",
          }
        }

        IPFSUtils.uploadTextToIPFS(content_uri1).then((path) => {
          // mintNFT({ name: 'Angel', content_uri: path }, wallet).then(() => {
          //   toast.success('Succeed', {
          //     position: "bottom-left",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     pauseOnHover: true,
          //     draggable: true,
          //     progress: undefined,
          //     type: toast.TYPE.SUCCESS,
          //     theme: 'colored'
          //   });
          // });
        })
      }
    });

		// const tokenID = await createNFT("");
		// console.log('minted token ID : ', tokenID);
		// if (tokenID) {
		// 	setSampleNFTTokenID(tokenID);
		// 	updateTokenIds();
		// }
	}

  return (
    <div>
      <div className="mint-container">
        <div className="file-div">
          <p>PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
          <FileUploader
            multiple={true}
            handleChange={handleChange}
            name="file"
            classes="drag-zone"
            types={fileTypes}
          />
        </div>
        <div className="inputs-div">
          <div>
            <label htmlFor="">Title</label>
            <input
              type="text"
              className="mint-input"
              placeholder="example: gaming art design"
            />
          </div>
          <div>
            <label htmlFor="">Description (Optional)</label>
            <input
              type="text"
              className="mint-input"
              placeholder="example: gaming art design"
            />
          </div>
          <div>
            <label htmlFor="">Price</label>
            <input type="text" className="mint-input" placeholder="0 BNB" />
          </div>
          <button onClick={mintNFT}>Create Item</button>
        </div>
      </div>
    </div>
  );
}

export default Mint;
