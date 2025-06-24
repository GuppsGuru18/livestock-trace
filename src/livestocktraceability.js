import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { QRCodeCanvas } from 'qrcode.react';
import './Livestock.css';

const contractABI =[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "livestockID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dateOfBirth",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "nameOfOwner",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "vetName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "vaccination",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "breed",
				"type": "string"
			}
		],
		"name": "addRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			}
		],
		"name": "authorizeProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "livestockID",
				"type": "uint256"
			}
		],
		"name": "getLivestockRecords",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "recordID",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dateOfBirth",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "nameOfOwner",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "vetName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "vaccination",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "breed",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct Livestocktraceability.Record[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			}
		],
		"name": "isAuthorized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0xee2af09600e1ad717ed5fa9f39aaf9600cec50b8"; // Update if redeployed

const Livestocktraceability = () => {
  const [account, setAccount] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [contract, setContract] = useState(null);

  const [livestockID, setLivestockID] = useState('');
  const [nameOfOwner, setNameOfOwner] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [breed, setBreed] = useState('');
  const [vetName, setVetName] = useState('');
  const [vaccination, setVaccination] = useState('');
  const [providerAddress, setProviderAddress] = useState('');

  const [livestockRecords, setLivestockRecords] = useState([]);

  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) return alert('MetaMask not detected!');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 11155111) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }]
        });
        return connectWallet();
      }

      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const owner = await contract.getOwner();

      setContract(contract);
      setAccount(userAddress);
      setIsOwner(userAddress.toLowerCase() === owner.toLowerCase());
    };

    connectWallet();
  }, []);

  const addRecord = async () => {
    if (!contract) return;
    try {
      const dobTimestamp = Math.floor(new Date(dateOfBirth).getTime() / 1000);
      const tx = await contract.addRecord(
        parseInt(livestockID),
        dobTimestamp,
        nameOfOwner,
        breed,
        vetName,
        vaccination
      );
      await tx.wait();
      alert('Record added!');
      fetchLivestockRecords();
    } catch (err) {
      console.error(err);
      alert("Error adding record.");
    }
  };

  const authorizeProvider = async () => {
    if (!isOwner || !contract) return;
    try {
      const tx = await contract.authorizeProvider(providerAddress);
      await tx.wait();
      alert('Provider authorized!');
    } catch (err) {
      console.error(err);
      alert("Error authorizing provider.");
    }
  };

  const fetchLivestockRecords = async () => {
    try {
      const records = await contract.getLivestockRecords(parseInt(livestockID));
      setLivestockRecords(records);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch records.");
    }
  };

  const formatDate = (timestamp) => new Date(timestamp * 1000).toLocaleDateString();

  return (
    <div className="container">
      <h1>🐄 Livestock Traceability System</h1>
      {account && <p>Connected Account: <b>{account}</b></p>}
      {isOwner && <p className="owner-banner">You are the contract owner.</p>}

      <div className="section">
        <h2>Add Record</h2>
        <input type="number" placeholder="Livestock ID" value={livestockID} onChange={e => setLivestockID(e.target.value)} />
        <input type="text" placeholder="Owner Name" value={nameOfOwner} onChange={e => setNameOfOwner(e.target.value)} />
        <input type="date" placeholder="DOB" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
        <input type="text" placeholder="Breed" value={breed} onChange={e => setBreed(e.target.value)} />
        <input type="text" placeholder="Vet Name" value={vetName} onChange={e => setVetName(e.target.value)} />
        <input type="text" placeholder="Vaccination" value={vaccination} onChange={e => setVaccination(e.target.value)} />
        <button onClick={addRecord}>Add Record</button>
      </div>

      <div className="section">
        <h2>Authorize Provider</h2>
        <input type="text" placeholder="Address" value={providerAddress} onChange={e => setProviderAddress(e.target.value)} />
        <button onClick={authorizeProvider}>Authorize</button>
      </div>

      <div className="section">
        <h2>Fetch Records</h2>
        <input type="number" placeholder="Livestock ID" value={livestockID} onChange={e => setLivestockID(e.target.value)} />
        <button onClick={fetchLivestockRecords}>Fetch</button>
      </div>

      <div className="section">
        <h2>Records</h2>
        {livestockRecords.length === 0 ? <p>No records yet.</p> :
        livestockRecords.map((record, idx) => {
  const recordURL = `https://685ab2652182a33698735ea9--effervescent-mousse-9eb598.netlify.app/record?id=${record.recordID}`;

  return (
    <div key={idx} className="record-card">
      <p><b>Record ID:</b> {record.recordID.toString()}</p>
      <p><b>Owner:</b> {record.nameOfOwner}</p>
      <p><b>Breed:</b> {record.breed}</p>
      <p><b>Vet:</b> {record.vetName}</p>
      <p><b>Vaccination:</b> {record.vaccination}</p>
      <p><b>Date of Birth:</b> {formatDate(record.dateOfBirth)}</p>
      <p><b>Timestamp:</b> {new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</p>
      <QRCodeCanvas value={recordURL} size={100} />
    </div>
  );
})
		}
      </div>
    </div>
  );
};

export default Livestocktraceability;