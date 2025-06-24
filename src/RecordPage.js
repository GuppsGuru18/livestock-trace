import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ethers } from 'ethers';
import './Livestock.css';

const contractABI = [
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
const contractAddress = "0xee2af09600e1ad717ed5fa9f39aaf9600cec50b8";

const RecordPage = () => {
  const [searchParams] = useSearchParams();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  const recordID = parseInt(searchParams.get('id'));
  const livestockID = 1; // Optional: Make this dynamic by also passing ?livestock=1 in URL

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        const records = await contract.getLivestockRecords(livestockID);
        const match = records.find(r => r.recordID.toString() === recordID.toString());

        if (match) setRecord(match);
        else setError("Record not found.");
      } catch (err) {
        console.error(err);
        setError("Error fetching record.");
      }
    };

    fetchRecord();
  }, [recordID]);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (error) return <p>{error}</p>;
  if (!record) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Livestock Record</h1>
      <p><b>Record ID:</b> {record.recordID.toString()}</p>
      <p><b>Owner:</b> {record.nameOfOwner}</p>
      <p><b>Breed:</b> {record.breed}</p>
      <p><b>Vet:</b> {record.vetName}</p>
      <p><b>Vaccination:</b> {record.vaccination}</p>
      <p><b>Date of Birth:</b> {formatDate(record.dateOfBirth)}</p>
      <p><b>Timestamp:</b> {new Date(record.timestamp.toNumber() * 1000).toLocaleString()}</p>
    </div>
  );
};

export default RecordPage;