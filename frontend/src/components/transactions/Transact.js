import React, { useEffect, useState } from 'react';

import {useForm, useController, Controller} from "react-hook-form";
import {useNavigate} from "react-router-dom"
import axios from 'axios';
import Select from 'react-select';

const Transact= () =>{

    
    const saveData = (res) => {
        sessionStorage.setItem("account", res);
        console.log(JSON.stringify(sessionStorage))
    }
    
    useEffect(()=>{
        let data = sessionStorage.getItem("info");
        data = JSON.parse(data);
        console.log("hello")
        const custId = data.custId;
        
        const URL = `http://localhost:8080/fetchAccounts/${custId}`
        axios({
            method: 'get',
            url: URL,
          })
        .then(
            (response)=>{
                console.log(response.data);
                saveData(JSON.stringify(response.data));
                let accNums = JSON.parse((sessionStorage.getItem("account")));
                accNums.map((val,index)=>accountIds.push({label:val,value:index}))
                console.log(accountIds)
                console.log(accNums,typeof(accNums))
            }
        )
        .catch(e => {
            console.log(e);
        })
        },[])
    const [senderAccount,setSenderAccount] = useState('');
    const [type,setType]  = useState('');

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control
        } = useForm();

    // const {field : {value: accountNo, onChange: accNoChange, ...restAccNum}} = useController({name: 'accountNum',control});
    
    // const {field : {value: transactionType, onChange: transactionTypeChange, ...restTransactionType}} = useController({name: 'transactionType',control});

    // const accountIds = JSON.parse(sessionStorage.getItem("account"));
    // const accountIds = [{label:989897878,value:1},{label:78766545544,value:2},{label:89878767654543,value:3}];
        
let accountIds=[];


    const transactTypes=[{label:"withdrawal",value:1},{label:"deposit",value:2},{label:"fund transfer",value:3}];

      const min = 100000000000; // Minimum 12-digit number
      const max = 999999999999; // Maximum 12-digit number
      const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
      const transactionId = randomNum.toString();

    const onSubmit = (data)=>{

        const payload = {
            accountUpdateModel:{
                
            senderAccount: senderAccount,
            recieverAccount: data.receiverAccount,
            amount: parseInt(data.amount)
            },
          transaction:{  
            type : type,
            timeStamp: new Date().toISOString().split('T')[0],
            amount:parseInt(data.amount),
            transactionId:transactionId,
            status:"in progress"
          }
        }
        console.log(payload);

        const URL = `http://localhost:8080/transaction`
        axios({
            method: 'post',
            url: URL,
            data:payload
          })
        .then(
            response=>{
                console.log(response.data);
                
                alert("Transaction done success");
                navigate("/welcome")

            }
        )
        .catch(e => {
            alert(e.message);
            console.log(e);
        })
        // // sessionStorage.setItem("account",JSON.stringify(account));
        // navigate('/addOccupation')
    };


    return(

        <div>
            <h1>Transact</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
               <Select
               name='select1'
                options={accountIds}
                
                onChange={value=>{setSenderAccount(value.label);}}
               />
                <Select
                name='select2'
                options={transactTypes}
                onChange={value=>setType(value.label)}
               />
                <br/>
                {/* <Select placeholder="Select transaction type"
                options={transactTypes}
                value={transactionType?transactTypes.find(x=>x===transactionType):transactionType} {...register("type")}
                onChange={option => transactionTypeChange(option?option.value:option)}
                {...restTransactionType}
                /> */}
                <br/>
 
                 <label>Receiver account no: </label>
                <input type="text" 
                        name="receiverAccountNo"
                        {...register("receiverAccount")}
                ></input>
                <label>Amount in Rs: </label>
                <input type="text" 
                        name="amount"
                        {...register("amount")}
                ></input>
                    <input type="submit" value="Next"
                
                ></input>
            </form>
        </div>
    )
}

export default Transact;